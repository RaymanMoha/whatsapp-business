import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { commerceApprovedKnowledge, commerceBusinessProfile } from "@/lib/commerce-data";
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime";

export default async function BotSettingsPage() {
   const status = await getCommerceRuntimeStatus();
   const settings = [
      ["Business", status.bot.businessName || commerceBusinessProfile.name],
      ["WAHA session", `${status.waha.session} · ${status.waha.status}`],
      ["AI model", status.groq.model],
      ["Groq key", status.groq.configured ? "Configured" : "Missing"],
      ["Bot service", status.bot.online ? "Online" : "Offline"],
      [
         "Data storage",
         status.mongo.configured
            ? status.mongo.connected
               ? `MongoDB · ${status.mongo.database}`
               : "MongoDB configured but not connected"
            : "Local JSON fallback",
      ],
      ["Product pictures", `${status.products.withImages}/${status.products.total} uploaded`],
      ["M-Pesa", status.mpesa.configured ? "Configured" : `Missing ${status.mpesa.missing.length} settings`],
      ["Fallback", process.env.HUMAN_HANDOFF_MESSAGE || commerceBusinessProfile.handoff],
   ];

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Bot Settings"
               description="Configure how the WhatsApp assistant answers, when it sends products, and when it hands off."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Current automation rules</CardTitle>
               </CardHeader>
               <CardContent className="grid gap-3 md:grid-cols-2">
                  {settings.map(([label, value]) => (
                     <div key={label} className="rounded-xl border p-4">
                        <strong className="block">{label}</strong>
                        <p className="mt-1 text-sm text-zinc-600">{value}</p>
                     </div>
                  ))}
               </CardContent>
            </Card>
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
