import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KnowledgeManager, type KnowledgeEntry } from "@/components/commerce/knowledge-manager";
import Heading from "@/components/heading";
import { readApprovedKnowledge } from "@/src/knowledge-store";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
   const entries = await readApprovedKnowledge() as KnowledgeEntry[];

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Approved Knowledge"
               description="Business hours, delivery rules, payment guidance, product policies, and safe answers the AI can use."
            />
            <KnowledgeManager initialEntries={entries} />
         </div>
      </DashboardLayout>
   );
}
