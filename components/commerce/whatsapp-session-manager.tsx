"use client";

import * as React from "react";
import {
   AlertTriangle,
   CheckCircle2,
   Loader2,
   LogOut,
   QrCode,
   RefreshCcw,
   RotateCcw,
   Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type SessionStatus = {
   name: string;
   status: string;
   phone: string | null;
   pushName: string | null;
   engine: string | null;
};

export type WhatsappConnectionState = {
   configured: boolean;
   session: SessionStatus;
   qr: { image: string | null; error: string | null };
   canShowQr: boolean;
   updatedAt: string;
};

type ActionName = "start" | "restart" | "logout";

function statusTone(status: string) {
   if (status === "WORKING") return "border-emerald-200 bg-emerald-50 text-emerald-800";
   if (status === "SCAN_QR_CODE" || status === "STARTING") return "border-amber-200 bg-amber-50 text-amber-900";
   return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

async function readState(includeQr = false) {
   const response = await fetch(`/api/commerce/session${includeQr ? "?qr=1" : ""}`, { cache: "no-store" });
   const data = await response.json();
   if (!response.ok) throw new Error(data.error || "WhatsApp status could not be loaded");
   return data as WhatsappConnectionState;
}

export function WhatsappSessionManager({ initialState }: { initialState: WhatsappConnectionState }) {
   const { toast } = useToast();
   const [state, setState] = React.useState(initialState);
   const [busyAction, setBusyAction] = React.useState<ActionName | "refresh" | null>(null);
   const [confirmText, setConfirmText] = React.useState("");

   const working = state.session.status === "WORKING";
   const showQr = Boolean(state.qr.image);
   const needsPolling = !working && (state.canShowQr || state.session.status === "STARTING");

   async function refresh(includeQr = state.canShowQr) {
      setBusyAction("refresh");
      try {
         setState(await readState(includeQr));
      } catch (error) {
         toast({
            title: "Could not refresh WhatsApp",
            description: error instanceof Error ? error.message : "Try again.",
            variant: "error",
         });
      } finally {
         setBusyAction(null);
      }
   }

   async function runAction(action: ActionName) {
      setBusyAction(action);
      try {
         const response = await fetch("/api/commerce/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               action,
               confirm: action === "logout" ? confirmText.trim().toLowerCase() : undefined,
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "WhatsApp action failed");
         setState(data.state);
         if (action === "logout") setConfirmText("");
         toast({
            title: action === "logout" ? "WhatsApp logged out" : "WhatsApp session updated",
            description: action === "logout" ? "Scan the QR code with the new number." : "The connection status has been refreshed.",
            variant: "success",
         });
      } catch (error) {
         toast({
            title: "WhatsApp action failed",
            description: error instanceof Error ? error.message : "Try again.",
            variant: "error",
         });
      } finally {
         setBusyAction(null);
      }
   }

   React.useEffect(() => {
      if (!needsPolling) return;
      const timer = window.setInterval(() => {
         readState(true).then(setState).catch(() => undefined);
      }, 8000);
      return () => window.clearInterval(timer);
   }, [needsPolling]);

   return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
         <Card className="text-black dark:text-black">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
               <div>
                  <CardTitle>Self-service number connection</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                     Reconnect the WhatsApp number behind the configured WAHA session without exposing server keys.
                  </p>
               </div>
               <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusTone(state.session.status)}`}>
                  {working ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
                  {state.session.status}
               </span>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid gap-3 md:grid-cols-2">
                  {[
                     ["Session", state.session.name],
                     ["Connected phone", state.session.phone || "Not connected"],
                     ["WhatsApp name", state.session.pushName || "Not available"],
                     ["Engine", state.session.engine || "Not reported"],
                  ].map(([label, value]) => (
                     <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <strong className="block text-sm text-zinc-900">{label}</strong>
                        <p className="mt-1 break-words text-sm text-zinc-600">{value}</p>
                     </div>
                  ))}
               </div>

               <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  <strong className="flex items-center gap-2"><AlertTriangle className="size-4" /> Changing number means logging out this WAHA session.</strong>
                  <p className="mt-2">
                     The old WhatsApp device link is removed. The new owner must scan the QR from WhatsApp → Linked devices.
                  </p>
               </div>

               <div className="grid gap-3 sm:grid-cols-3">
                  <Button type="button" variant="outline" disabled={busyAction !== null} onClick={() => refresh(true)}>
                     {busyAction === "refresh" ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
                     Refresh
                  </Button>
                  <Button type="button" variant="outline" disabled={busyAction !== null} onClick={() => runAction("start")}>
                     {busyAction === "start" ? <Loader2 className="animate-spin" /> : <QrCode />}
                     Start / QR
                  </Button>
                  <Button type="button" variant="outline" disabled={busyAction !== null} onClick={() => runAction("restart")}>
                     {busyAction === "restart" ? <Loader2 className="animate-spin" /> : <RotateCcw />}
                     Restart
                  </Button>
               </div>

               <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <label htmlFor="disconnect-confirm" className="text-sm font-semibold text-red-950">
                     To connect a different number, type <span className="font-mono">disconnect</span>
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                     <Input
                        id="disconnect-confirm"
                        value={confirmText}
                        onChange={(event) => setConfirmText(event.target.value)}
                        placeholder="disconnect"
                        className="h-11 border-red-200 bg-white"
                     />
                     <Button
                        type="button"
                        disabled={busyAction !== null || confirmText.trim().toLowerCase() !== "disconnect"}
                        onClick={() => runAction("logout")}
                        className="bg-red-700 text-white hover:bg-red-800">
                        {busyAction === "logout" ? <Loader2 className="animate-spin" /> : <LogOut />}
                        Logout number
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="text-black dark:text-black">
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Smartphone className="size-5" /> Pair new phone</CardTitle>
            </CardHeader>
            <CardContent>
               {showQr ? (
                  <div className="space-y-4">
                     <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={state.qr.image!} alt="WhatsApp pairing QR code" className="mx-auto aspect-square w-full max-w-72 rounded-2xl object-contain" />
                     </div>
                     <p className="text-sm leading-6 text-zinc-600">
                        Open WhatsApp on the new phone, go to Linked devices, then scan this QR. It expires quickly, so refresh if it stops working.
                     </p>
                  </div>
               ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center">
                     <QrCode className="mx-auto size-10 text-zinc-400" />
                     <p className="mt-3 text-sm font-semibold text-zinc-900">
                        {working ? "Connected. QR is hidden." : "QR not ready yet."}
                     </p>
                     <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {state.qr.error || "Click Start / QR or Refresh to request a pairing code from WAHA."}
                     </p>
                  </div>
               )}
               <p className="mt-4 text-xs text-zinc-400">
                  Last checked {new Date(state.updatedAt).toLocaleString()}
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
