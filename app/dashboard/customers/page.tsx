import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function CustomersPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Customers"
            description="Customer profiles and WhatsApp conversation history will appear here once order capture is connected."
         />
      </DashboardLayout>
   );
}
