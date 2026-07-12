import { NextRequest, NextResponse } from "next/server";
import { initiateStkPush } from "@/src/mpesa";
import { getMpesaStatus, listPayments } from "@/src/mpesa-store";
import { syncOrderFromPayment } from "@/src/order-store";

export async function GET() {
   return NextResponse.json({
      mpesa: await getMpesaStatus(),
      payments: await listPayments(),
   });
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const payment = await initiateStkPush({
         phone: body.phone,
         amount: body.amount,
         accountReference: body.accountReference,
         description: body.description,
      });
      await syncOrderFromPayment(payment);
      return NextResponse.json({ payment });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "M-Pesa payment could not be started" },
         { status: 400 },
      );
   }
}
