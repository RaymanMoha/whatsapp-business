import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { applyPaymentCallback, getPaymentByCheckoutRequestId, updatePaymentByCheckoutRequestId } from "@/src/mpesa-store";
import { ensurePaymentReceipt } from "@/src/receipt-store";
import { clearCart } from "@/src/cart-store";
import { commitPaidOrder, syncOrderFromPayment } from "@/src/order-store";
import { enqueuePaymentDelivery } from "@/src/message-queue";

function secretsMatch(received: string, expected: string) {
   const left = Buffer.from(received);
   const right = Buffer.from(expected);
   return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function callbackMetadata(callback: Record<string, unknown>) {
   const items = (callback as { CallbackMetadata?: { Item?: Array<{ Name: string; Value?: unknown }> } })
      ?.CallbackMetadata?.Item;
   return Array.isArray(items)
      ? items.reduce((acc: Record<string, unknown>, item) => {
           acc[item.Name] = item.Value ?? null;
           return acc;
        }, {})
      : {};
}

export async function POST(request: NextRequest) {
   const expectedSecret = process.env.MPESA_CALLBACK_SECRET?.trim();
   const receivedSecret = request.nextUrl.searchParams.get("token") || request.headers.get("x-callback-token") || "";

   if (!expectedSecret || !secretsMatch(receivedSecret, expectedSecret)) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Unauthorized callback" }, { status: 401 });
   }

   const body = await request.json().catch(() => null);
   const callback = body?.Body?.stkCallback;
   const checkoutRequestId = String(callback?.CheckoutRequestID || "");
   if (!checkoutRequestId || !Number.isInteger(callback?.ResultCode)) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback payload" }, { status: 400 });
   }

   const existing = await getPaymentByCheckoutRequestId(checkoutRequestId);
   if (!existing) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Unknown checkout request" }, { status: 404 });
   }

   const metadata = callbackMetadata(callback);
   const paid = callback.ResultCode === 0;
   const callbackAmount = Number(metadata.Amount);
   const receiptNumber = String(metadata.MpesaReceiptNumber || "").trim();

   if (paid && (!receiptNumber || !Number.isFinite(callbackAmount) || callbackAmount !== Number(existing.amount))) {
      await updatePaymentByCheckoutRequestId(checkoutRequestId, {
         status: "Callback rejected",
         resultCode: callback.ResultCode,
         resultDescription: "Payment callback amount or receipt did not match the request",
         rejectedCallbackPayload: body,
      });
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Payment verification failed" }, { status: 400 });
   }

   const { payment, duplicate } = await applyPaymentCallback(checkoutRequestId, {
      resultCode: callback.ResultCode,
      resultDescription: String(callback.ResultDesc || ""),
      status: paid ? "Paid" : "Failed",
      mpesaReceiptNumber: receiptNumber || null,
      paidAt: metadata.TransactionDate ? String(metadata.TransactionDate) : null,
      callbackPayload: body,
   });

   if (!payment) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Payment record unavailable" }, { status: 500 });
   }

   const order = await syncOrderFromPayment(payment);
   const confirmedPaid = payment.status === "Paid";
   if (!confirmedPaid) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: duplicate ? "Already processed" : "Accepted" });
   }

   await Promise.all([
      payment.chatId ? clearCart(payment.chatId).catch(() => null) : Promise.resolve(),
      commitPaidOrder(order.id),
   ]);

   const receipt = await ensurePaymentReceipt(payment);
   await updatePaymentByCheckoutRequestId(checkoutRequestId, {
      receiptId: receipt.id,
      receiptCreatedAt: receipt.createdAt,
   });
   await enqueuePaymentDelivery({
      id: `payment-delivery-${payment.id}`,
      type: "payment-receipt",
      paymentId: payment.id,
      orderId: order.id,
   });

   return NextResponse.json({ ResultCode: 0, ResultDesc: duplicate ? "Already processed" : "Accepted" });
}
