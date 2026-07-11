import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MpesaPayments } from "@/components/commerce/mpesa-payments";
import Heading from "@/components/heading";

export default function PaymentsPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="M-Pesa Payments"
               description="Send STK Push payment prompts and track M-Pesa payment callbacks."
            />
            <MpesaPayments />
         </div>
      </DashboardLayout>
   );
}
