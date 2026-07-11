import { NextRequest, NextResponse } from "next/server";
import { updatePaymentByCheckoutRequestId } from "@/src/mpesa-store";

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

      await updatePaymentByCheckoutRequestId(checkoutRequestId, {
         resultCode: callback.ResultCode,
         resultDescription: callback.ResultDesc,
         status: callback.ResultCode === 0 ? "Paid" : "Failed",
         mpesaReceiptNumber: metadata.MpesaReceiptNumber || null,
         paidAt: metadata.TransactionDate ? String(metadata.TransactionDate) : null,
         callbackPayload: body,
      }).catch(() => null);
   }

   return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
