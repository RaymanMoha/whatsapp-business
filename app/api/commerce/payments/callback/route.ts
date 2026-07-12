import { NextRequest, NextResponse } from "next/server";
import { updatePaymentByCheckoutRequestId } from "@/src/mpesa-store";
import { appendConversationEvent } from "@/src/message-store";
import { sendWahaText } from "@/src/waha";

export async function POST(request: NextRequest) {
   const body = await request.json();
   const callback = body?.Body?.stkCallback;
   const checkoutRequestId = callback?.CheckoutRequestID;

   if (checkoutRequestId) {
      const metadata = Array.isArray(callback?.CallbackMetadata?.Item)
         ? callback.CallbackMetadata.Item.reduce((acc: Record<string, unknown>, item: { Name: string; Value?: unknown }) => {
              acc[item.Name] = item.Value ?? null;
              return acc;
           }, {})
         : {};

      const payment = await updatePaymentByCheckoutRequestId(checkoutRequestId, {
         resultCode: callback.ResultCode,
         resultDescription: callback.ResultDesc,
         status: callback.ResultCode === 0 ? "Paid" : "Failed",
         mpesaReceiptNumber: metadata.MpesaReceiptNumber || null,
         paidAt: metadata.TransactionDate ? String(metadata.TransactionDate) : null,
         callbackPayload: body,
      }).catch(() => null);

      if (callback.ResultCode === 0 && payment?.chatId && !payment.confirmationSentAt) {
         const productName = payment.productName || payment.accountReference || "your order";
         const receipt = metadata.MpesaReceiptNumber ? `\nReceipt: ${metadata.MpesaReceiptNumber}` : "";
         const message = [
            `Payment received for ${productName}.`,
            `Amount: KES ${payment.amount}.`,
            `Your order is confirmed.${receipt}`,
         ].join("\n");

         await sendWahaText(payment.chatId, message).then(async () => {
            await updatePaymentByCheckoutRequestId(checkoutRequestId, {
               confirmationSentAt: new Date().toISOString(),
            });
            await appendConversationEvent({
               id: `${checkoutRequestId}-payment-confirmed`,
               chatId: payment.chatId,
               customerName: payment.customerName || payment.chatId,
               direction: "assistant",
               text: message,
               status: "sent",
            });
         }).catch(() => null);
      }
   }

   return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
