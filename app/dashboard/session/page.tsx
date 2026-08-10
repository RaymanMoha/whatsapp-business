import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { WhatsappSessionManager, type WhatsappConnectionState } from "@/components/commerce/whatsapp-session-manager";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWhatsappConnectionState } from "@/src/waha-session";

export const dynamic = "force-dynamic";

export default async function SessionPage() {
   const connectionResult = await getWhatsappConnectionState({ includeQr: true }).then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
   );
   const connectionState = connectionResult.status === "fulfilled" ? connectionResult.value as WhatsappConnectionState : null;

   return (
      <DashboardLayout hideHelperChat>
         <div className="space-y-4 sm:space-y-6">
            <Heading
               title="WhatsApp Connection"
               description="WhatsApp pairing, message delivery, automation readiness, and connection health."
            />
            {connectionState ? (
               <WhatsappSessionManager initialState={connectionState} />
            ) : (
               <Card className="border-amber-200 bg-amber-50 text-amber-950 dark:text-amber-950">
                  <CardHeader>
                     <CardTitle>WhatsApp connection manager unavailable</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm leading-6">
                        {connectionResult.status === "rejected" && connectionResult.reason instanceof Error
                           ? connectionResult.reason.message
                           : "WhatsApp infrastructure is not configured yet."}
                     </p>
                  </CardContent>
               </Card>
            )}
            <Card className="text-black dark:text-black">
               <CardHeader className="p-4 sm:p-6">
                  <CardTitle>Connection facts</CardTitle>
               </CardHeader>
               <CardContent className="grid gap-2 p-4 pt-0 sm:gap-3 sm:p-6 sm:pt-0 md:grid-cols-2">
                  {[
                     ["Connection status", connectionState?.session.status || "Unavailable"],
                     ["Connection session", connectionState?.session.name || "Unavailable"],
                     ["Connected phone", connectionState?.session.phone || "Not connected"],
                     ["WhatsApp name", connectionState?.session.pushName || "Not available"],
                     ["WAHA engine", connectionState?.session.engine || "Not reported"],
                     ["Last checked", connectionState?.updatedAt ? new Date(connectionState.updatedAt).toLocaleString() : "Not checked"],
                  ].map(([label, value]) => (
                     <div key={label} className="rounded-xl border p-3 sm:p-4">
                        <strong className="block text-sm">{label}</strong>
                        <p className="mt-1 break-words text-sm text-zinc-600">{value}</p>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
