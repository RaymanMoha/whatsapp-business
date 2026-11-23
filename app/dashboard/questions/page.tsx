import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { LiveQuestions } from "@/components/commerce/live-questions";

export default function QuestionsPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Customer Questions"
               description="See what customers ask and where the AI needs better approved business information."
            />
            <LiveQuestions />
         </div>
      </DashboardLayout>
   );
}
