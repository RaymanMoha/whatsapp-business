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
               title="WAHA Session"
               description="WhatsApp connection status, QR pairing, webhook delivery, and session health."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Runtime status</CardTitle>
               </CardHeader>
               <CardContent className="grid gap-3 md:grid-cols-2">
                  {[
                     ["WAHA status", status.waha.status],
                     ["WAHA session", status.waha.session],
                     ["Connected phone", status.waha.phone || "Not connected"],
                     ["WhatsApp name", status.waha.pushName || "Not available"],
                     ["Bot service", status.bot.online ? "Online" : "Offline"],
                     ["Groq", status.groq.configured ? "Configured" : "Missing key"],
                     [
                        "MongoDB",
                        status.mongo.configured
                           ? status.mongo.connected
                              ? `Connected · ${status.mongo.database}`
                              : "Configured but not connected"
                           : "Using local JSON fallback",
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
