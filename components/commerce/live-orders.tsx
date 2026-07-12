"use client";

import * as React from "react";
import { CheckCircle2, Clock3, PackageCheck, RefreshCw, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

type LineItem = { productId?: string; name: string; quantity: number; lineTotal: number };
type Order = {
   id: string;
   orderNumber: string;
   customerName: string;
   phone?: string | null;
   chatId?: string | null;
   lineItems: LineItem[];
   itemCount: number;
   amount: number;
   status: string;
   paymentStatus: string;
   mpesaReceiptNumber?: string | null;
   source?: string;
   createdAt: string;
   updatedAt: string;
};

const nextActions: Record<string, { status: string; label: string } | null> = {
   Paid: { status: "Preparing", label: "Start preparing" },
   Preparing: { status: "Ready", label: "Mark ready" },
   Ready: { status: "Completed", label: "Complete order" },
   Completed: null,
   "Awaiting payment": null,
   "Payment failed": null,
   Cancelled: null,
};

function statusClasses(status: string) {
   if (status === "Completed") return "bg-emerald-100 text-emerald-800";
   if (status === "Paid" || status === "Ready") return "bg-teal-50 text-teal-800";
   if (status === "Preparing") return "bg-violet-50 text-violet-800";
   if (status === "Payment failed" || status === "Cancelled") return "bg-red-50 text-red-700";
   return "bg-amber-50 text-amber-800";
}

export function LiveOrders({ initialOrders = [] }: { initialOrders?: Order[] }) {
   const [orders, setOrders] = React.useState<Order[]>(initialOrders);
   const [savingId, setSavingId] = React.useState("");
   const [notice, setNotice] = React.useState("");

   async function loadOrders() {
      const response = await fetch("/api/commerce/orders", { cache: "no-store" });
      const data = await response.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
   }

   async function moveOrder(order: Order, status: string) {
      setSavingId(order.id);
      setNotice("");
      try {
         const response = await fetch("/api/commerce/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: order.id, status }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Order could not be updated");
         setOrders((current) => current.map((item) => (item.id === order.id ? data.order : item)));
         setNotice(`${order.orderNumber} moved to ${status}.`);
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Order could not be updated");
      } finally {
         setSavingId("");
      }
   }

   React.useEffect(() => {
      const interval = window.setInterval(() => loadOrders().catch(() => null), 5000);
      return () => window.clearInterval(interval);
   }, []);

   const active = orders.filter((order) => ["Paid", "Preparing", "Ready"].includes(order.status));
   const completed = orders.filter((order) => order.status === "Completed");
   const waiting = orders.filter((order) => order.status === "Awaiting payment");

   return (
      <div className="space-y-5">
         <div className="grid overflow-hidden rounded-2xl border bg-white shadow-sm sm:grid-cols-3">
            {[
               [Clock3, "Awaiting payment", waiting.length],
               [UtensilsCrossed, "In fulfilment", active.length],
               [CheckCircle2, "Completed", completed.length],
            ].map(([Icon, label, count]) => {
               const StatusIcon = Icon as typeof Clock3;
               return (
                  <div key={String(label)} className="flex items-center gap-4 border-b p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                     <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><StatusIcon className="size-5" /></span>
                     <div><strong className="block text-xl">{String(count)}</strong><span className="text-sm text-zinc-500">{String(label)}</span></div>
                  </div>
               );
            })}
         </div>

         {notice ? <p role="status" className="rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{notice}</p> : null}

         <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
               <div><h2 className="font-semibold">Order queue</h2><p className="mt-1 text-sm text-zinc-500">Payment-confirmed orders appear here automatically.</p></div>
               <Button type="button" variant="outline" size="sm" onClick={() => loadOrders()}><RefreshCw className="mr-2 size-4" />Refresh</Button>
            </div>

            {orders.length === 0 ? (
               <div className="grid min-h-64 place-items-center p-8 text-center">
                  <div><PackageCheck className="mx-auto size-10 text-emerald-700" /><h3 className="mt-4 font-semibold">No orders yet</h3><p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">A verified payment creates the first order and places it in the fulfilment queue.</p></div>
               </div>
            ) : (
               <div className="divide-y">
                  {orders.map((order) => {
                     const action = nextActions[order.status];
                     return (
                        <article key={order.id} className="grid gap-5 p-5 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:items-center">
                           <div>
                              <strong className="block text-sm text-zinc-950">{order.orderNumber}</strong>
                              <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(order.status)}`}>{order.status}</span>
                              <p className="mt-2 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                           </div>
                           <div>
                              <strong className="text-sm">{order.customerName}</strong>
                              <p className="mt-1 text-xs text-zinc-500">{order.phone || order.chatId || "WhatsApp customer"}</p>
                              <div className="mt-3 space-y-1 text-sm text-zinc-700">
                                 {order.lineItems?.length ? order.lineItems.map((item) => <p key={item.productId || item.name}>{item.quantity} × {item.name}</p>) : <p>Dashboard payment request</p>}
                              </div>
                           </div>
                           <div className="lg:text-right">
                              <strong className="block text-lg">KES {order.amount}</strong>
                              {order.mpesaReceiptNumber ? <span className="text-xs text-emerald-700">{order.mpesaReceiptNumber}</span> : <span className="text-xs text-zinc-500">{order.paymentStatus}</span>}
                              {action ? <Button type="button" size="sm" disabled={savingId === order.id} onClick={() => moveOrder(order, action.status)} className="mt-3 w-full lg:w-auto">{savingId === order.id ? "Updating…" : action.label}</Button> : null}
                           </div>
                        </article>
                     );
                  })}
               </div>
            )}
         </section>
      </div>
   );
}
