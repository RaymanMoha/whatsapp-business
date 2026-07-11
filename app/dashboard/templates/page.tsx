import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function TemplatesPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Message Templates"
            description="Reusable WhatsApp response formats for product lists, delivery questions, order confirmation, and handoff."
         />
      </DashboardLayout>
   );
}
