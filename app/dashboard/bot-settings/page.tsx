import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntegrationSettings } from "@/components/commerce/integration-settings";
import type { SettingsPayload } from "@/components/commerce/integration-settings";
import { commerceApprovedKnowledge } from "@/lib/commerce-data";
import { getSettingsForDashboard } from "@/src/settings-store";

export const dynamic = "force-dynamic";

export default async function BotSettingsPage() {
   const settings = await getSettingsForDashboard() as SettingsPayload;

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <div className="pl-9 sm:pl-0">
               <Heading
                  title="Bot Settings"
                  description="Configure how the WhatsApp assistant answers, when it sends products, and when it hands off."
               />
            </div>
            <IntegrationSettings initialSettings={settings} />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Approved knowledge used by the AI</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {commerceApprovedKnowledge.map((entry) => (
                     <div key={entry.topic} className="rounded-xl border p-4">
                        <strong>{entry.topic}</strong>
                        <p className="mt-1 text-sm text-zinc-600">{entry.content}</p>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
