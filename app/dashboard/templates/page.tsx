import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MessageTemplates } from "@/components/commerce/message-templates";
import Heading from "@/components/heading";

export default function TemplatesPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Message Templates"
               description="Reusable WhatsApp response formats for product lists, delivery questions, order confirmation, and handoff."
            />
            <MessageTemplates />
         </div>
      </DashboardLayout>
   );
}
