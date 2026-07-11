import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function KnowledgePage() {
   return (
      <DashboardLayout>
         <Heading
            title="Approved Knowledge"
            description="Business hours, delivery rules, payment guidance, product policies, and safe answers the AI can use."
         />
      </DashboardLayout>
   );
}
