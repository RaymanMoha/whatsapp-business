import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MpesaPayments } from "@/components/commerce/mpesa-payments";
import Heading from "@/components/heading";
import { getMpesaStatus, listPayments } from "@/src/mpesa-store";

export default async function PaymentsPage() {
   const [mpesa, payments] = await Promise.all([getMpesaStatus(), listPayments()]);

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="M-Pesa Payments"
               description="Send STK Push payment prompts and track M-Pesa payment callbacks."
            />
            <MpesaPayments initialMpesa={mpesa} initialPayments={payments} />
         </div>
      </DashboardLayout>
   );
}
