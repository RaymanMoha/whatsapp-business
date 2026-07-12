import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime";

export default async function SessionPage() {
   const status = await getCommerceRuntimeStatus();

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="WhatsApp Connection"
               description="WhatsApp pairing, message delivery, automation readiness, and connection health."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Runtime status</CardTitle>
               </CardHeader>
               <CardContent className="grid gap-3 md:grid-cols-2">
                  {[
                     ["Connection status", status.messaging.status],
                     ["Connection session", status.messaging.session],
                     ["Connected phone", status.messaging.phone || "Not connected"],
                     ["WhatsApp name", status.messaging.pushName || "Not available"],
                     ["Bot service", status.bot.online ? "Online" : "Offline"],
                     ["AI service", status.ai.configured ? "Configured" : "Missing key"],
                     [
                        "MongoDB",
                        status.mongo.configured
                           ? status.mongo.connected
                              ? `Connected · ${status.mongo.database}`
                              : "Configured but not connected"
                           : "Using local JSON fallback",
                     ],
                     [
                        "Product pictures",
                        `${status.products.withImages}/${status.products.total} uploaded`,
                     ],
                     [
                        "M-Pesa",
                        status.mpesa.configured
                           ? `${status.mpesa.environment} · ${status.mpesa.shortCode}`
                           : `Missing ${status.mpesa.missing.length} settings`,
                     ],
                  ].map(([label, value]) => (
                     <div key={label} className="rounded-xl border p-4">
                        <strong className="block">{label}</strong>
                        <p className="mt-1 text-sm text-zinc-600">{value}</p>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
