import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { WhatsappSessionManager, type WhatsappConnectionState } from "@/components/commerce/whatsapp-session-manager";
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
         <div className="mx-auto w-full max-w-[720px] space-y-3 pt-2 sm:max-w-none sm:space-y-6 sm:pt-0">
            <div className="space-y-1.5 pr-16 sm:pr-0">
               <h1 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-zinc-950 sm:text-3xl">
                  WhatsApp Connection
               </h1>
               <p className="text-sm leading-6 text-zinc-600 sm:max-w-3xl sm:text-base">
                  Pair a phone, check message delivery, and reconnect the WhatsApp number safely.
               </p>
            </div>
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
               <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Connection facts</CardTitle>
               </CardHeader>
               <CardContent className="whatsapp-session-facts grid gap-2 p-3 pt-0 sm:gap-3 sm:p-6 sm:pt-0 md:grid-cols-2">
                  {[
                     ["Connection status", connectionState?.session.status || "Unavailable"],
                     ["Connection session", connectionState?.session.name || "Unavailable"],
                     ["Connected phone", connectionState?.session.phone || "Not connected"],
                     ["WhatsApp name", connectionState?.session.pushName || "Not available"],
                     ["WAHA engine", connectionState?.session.engine || "Not reported"],
                     ["Last checked", connectionState?.updatedAt ? new Date(connectionState.updatedAt).toLocaleString() : "Not checked"],
                  ].map(([label, value]) => (
                     <div key={label} className="rounded-xl border bg-white/70 p-3 sm:p-4">
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
