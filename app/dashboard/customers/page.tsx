import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LiveCustomers } from "@/components/commerce/live-customers";
import Heading from "@/components/heading";
import { listCustomerSummaries } from "@/src/customer-store";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
   const customers = await listCustomerSummaries();

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Customers"
               description="Customer profiles and conversation history from live WhatsApp messages."
            />
            <LiveCustomers initialCustomers={customers} />
         </div>
      </DashboardLayout>
   );
}
