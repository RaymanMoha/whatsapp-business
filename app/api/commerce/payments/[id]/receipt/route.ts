import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPaymentById, updatePaymentById } from "@/src/mpesa-store";
import { ensurePaymentReceipt, markReceiptShared } from "@/src/receipt-store";
import { sendWahaFile } from "@/src/waha";

type Context = { params: Promise<{ id: string }> };

function receiptResponse(receipt: { data: string; filename: string; mimetype: string }) {
   return new NextResponse(Buffer.from(receipt.data, "base64"), {
      headers: {
         "Content-Type": receipt.mimetype,
         "Content-Disposition": `inline; filename="${receipt.filename}"`,
         "Cache-Control": "private, no-store",
      },
   });
}

export async function GET(_request: NextRequest, context: Context) {
   if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   const { id } = await context.params;
   const payment = await getPaymentById(id);
   if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
   if (payment.status !== "Paid") {
      return NextResponse.json({ error: "Receipt is available after payment is confirmed" }, { status: 409 });
   }

   const receipt = await ensurePaymentReceipt(payment);
   if (!payment.receiptId) {
      await updatePaymentById(payment.id, {
         receiptId: receipt.id,
         receiptCreatedAt: receipt.createdAt,
      });
   }
   return receiptResponse(receipt);
}

export async function POST(_request: NextRequest, context: Context) {
   if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   const { id } = await context.params;
   const payment = await getPaymentById(id);
   if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
   if (payment.status !== "Paid") {
      return NextResponse.json({ error: "Receipt is available after payment is confirmed" }, { status: 409 });
   }

   const chatId = payment.chatId || (payment.phone ? `${String(payment.phone).replace(/\D/g, "")}@c.us` : null);
   if (!chatId) return NextResponse.json({ error: "Customer WhatsApp number is missing" }, { status: 409 });

   const receipt = await ensurePaymentReceipt(payment);
   await sendWahaFile(
      chatId,
      receipt,
      `Your receipt for ${payment.productName || payment.accountReference || "your order"}. Thank you for your payment.`,
   );
   const sharedAt = await markReceiptShared(payment.id);
   await updatePaymentById(payment.id, {
      receiptId: receipt.id,
      receiptCreatedAt: receipt.createdAt,
      receiptSharedAt: sharedAt,
   });

   return NextResponse.json({ receipt: { id: receipt.id, filename: receipt.filename, sharedAt } });
}
