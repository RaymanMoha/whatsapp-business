"use client";

import * as React from "react";
import {
   AlertCircle,
   CalendarDays,
   Check,
   ChevronRight,
   CircleCheckBig,
   Clock3,
   CookingPot,
   MessageCircleMore,
   PackageCheck,
   ReceiptText,
   RefreshCw,
   Search,
   ShoppingBag,
   Smartphone,
   UserRound,
   WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LineItem = { productId?: string; name: string; quantity: number; lineTotal: number; unitPrice?: number };
type StatusHistory = { status: string; at: string; actor?: string };
type Order = {
   id: string;
   orderNumber: string;
   customerName: string;
   phone?: string | null;
   chatId?: string | null;
   lineItems: LineItem[];
   itemCount: number;
   subtotal?: number;
   discount?: number;
   promotion?: { id: string; name: string; type: string } | null;
   amount: number;
   status: string;
   paymentStatus: string;
   mpesaReceiptNumber?: string | null;
   source?: string;
   statusHistory?: StatusHistory[];
   createdAt: string;
   updatedAt: string;
};

type Filter = "All" | "Active" | "Completed";

const nextActions: Record<string, { status: string; label: string } | null> = {
   Paid: { status: "Preparing", label: "Start preparing" },
   Preparing: { status: "Ready", label: "Mark ready for pickup" },
   Ready: { status: "Completed", label: "Complete order" },
   Completed: null,
   "Awaiting payment": null,
   "Payment failed": null,
   Cancelled: null,
};

const timelineSteps = [
   { status: "Paid", label: "Payment confirmed", description: "M-Pesa payment received and verified.", icon: ReceiptText },
   { status: "Preparing", label: "Preparing", description: "The order is being prepared for the customer.", icon: CookingPot },
   { status: "Ready", label: "Ready for pickup", description: "The order is ready to hand over or dispatch.", icon: ShoppingBag },
   { status: "Completed", label: "Completed", description: "The order has been fulfilled successfully.", icon: CircleCheckBig },
];

function money(value: number) {
   return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value)}`;
}

function shortDate(value: string) {
   return new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function timeOnly(value: string) {
   return new Intl.DateTimeFormat("en-KE", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function statusClasses(status: string) {
   if (status === "Completed") return "border-emerald-200 bg-emerald-50 text-emerald-800";
   if (status === "Paid" || status === "Ready") return "border-teal-200 bg-teal-50 text-teal-800";
   if (status === "Preparing") return "border-amber-200 bg-amber-50 text-amber-800";
   if (status === "Payment failed" || status === "Cancelled") return "border-red-200 bg-red-50 text-red-700";
   return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

function stepTimestamp(order: Order, status: string) {
   const event = order.statusHistory?.find((entry) => entry.status === status);
   if (event?.at) return event.at;
   if (status === "Paid" && order.status !== "Awaiting payment") return order.createdAt;
   return null;
}

function OrderQueueRow({ order, selected, onSelect }: { order: Order; selected: boolean; onSelect: () => void }) {
   const failed = order.status === "Payment failed" || order.status === "Cancelled";
   return (
      <button
         type="button"
         onClick={onSelect}
         aria-pressed={selected}
         className={`group relative grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 border-b px-4 py-4 text-left transition last:border-b-0 ${
            selected ? "bg-emerald-50" : failed ? "bg-red-50/40 hover:bg-red-50" : "bg-white hover:bg-zinc-50"
         }`}>
         {selected ? <span className="absolute inset-y-0 left-0 w-1 bg-emerald-700" /> : null}
         <div className="min-w-0 pl-1">
            <div className="flex items-center gap-2">
               <span className={`grid size-8 shrink-0 place-items-center rounded-full ${failed ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
                  {failed ? <AlertCircle className="size-4" /> : <MessageCircleMore className="size-4" />}
               </span>
               <div className="min-w-0">
                  <strong className="block truncate text-sm text-zinc-950">{order.orderNumber}</strong>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{order.phone || order.chatId || order.customerName}</p>
               </div>
            </div>
            {failed ? <p className="mt-2 pl-10 text-xs font-semibold text-red-600">{order.status}</p> : null}
         </div>
         <div className="flex items-center gap-2 text-right">
            <div>
               <strong className="block text-sm text-zinc-900">{money(order.amount)}</strong>
               <span className="text-xs text-zinc-500">{timeOnly(order.createdAt)}</span>
            </div>
            <ChevronRight className={`size-4 transition ${selected ? "translate-x-0 text-emerald-700" : "-translate-x-1 text-zinc-300 group-hover:translate-x-0"}`} />
         </div>
      </button>
   );
}

function OrderTimeline({ order, saving, onMove }: { order: Order; saving: boolean; onMove: (status: string) => void }) {
   const currentIndex = timelineSteps.findIndex((step) => step.status === order.status);
   const action = nextActions[order.status];

   if (order.status === "Payment failed" || order.status === "Cancelled" || order.status === "Awaiting payment") {
      const failed = order.status !== "Awaiting payment";
      return (
         <div className="flex min-h-[440px] items-center justify-center p-8 text-center">
            <div className="max-w-sm">
               <span className={`mx-auto grid size-16 place-items-center rounded-full ${failed ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                  {failed ? <AlertCircle className="size-7" /> : <Clock3 className="size-7" />}
               </span>
               <h3 className="mt-5 text-xl font-semibold text-zinc-950">{failed ? "Payment was not completed" : "Waiting for payment"}</h3>
               <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {failed ? "No fulfilment work is needed for this order. The customer can start a new payment from WhatsApp." : "The timeline will unlock automatically after a verified M-Pesa callback."}
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="px-6 py-7 sm:px-8">
         <div className="relative">
            {timelineSteps.map((step, index) => {
               const Icon = step.icon;
               const complete = order.status === "Completed" || index < currentIndex;
               const current = index === currentIndex && order.status !== "Completed";
               const upcoming = index > currentIndex;
               const timestamp = stepTimestamp(order, step.status);
               return (
                  <div key={step.status} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-4 pb-9 last:pb-0">
                     {index < timelineSteps.length - 1 ? (
                        <span className={`absolute left-[21px] top-10 h-[calc(100%-24px)] w-px ${complete ? "bg-emerald-600" : upcoming ? "border-l border-dashed border-zinc-300" : "bg-emerald-600"}`} />
                     ) : null}
                     <span className={`relative z-10 grid size-11 place-items-center rounded-full border-2 transition-all ${
                        complete
                           ? "border-emerald-700 bg-emerald-700 text-white"
                           : current
                             ? "border-emerald-700 bg-emerald-50 text-emerald-800 shadow-[0_0_0_6px_rgba(16,185,129,.10)]"
                             : "border-zinc-200 bg-white text-zinc-400"
                     }`}>
                        {complete ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" />}
                     </span>
                     <div className={`pt-1 ${upcoming ? "opacity-55" : ""}`}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                           <div>
                              <h3 className="text-base font-semibold text-zinc-950">{step.label}</h3>
                              <p className="mt-1 text-sm leading-6 text-zinc-500">{step.description}</p>
                           </div>
                           {timestamp ? <time className="text-xs font-medium text-zinc-400">{shortDate(timestamp)}</time> : null}
                        </div>
                        {current && action ? (
                           <Button type="button" disabled={saving} onClick={() => onMove(action.status)} className="mt-4 h-10 rounded-xl bg-[#075c4f] px-5 text-white shadow-sm hover:bg-[#06483f]">
                              {saving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <ChevronRight className="mr-2 size-4" />}
                              {saving ? "Updating…" : action.label}
                           </Button>
                        ) : null}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: React.ReactNode }) {
   return (
      <div className="grid grid-cols-[22px_100px_minmax(0,1fr)] items-start gap-2 py-3 text-sm">
         <Icon className="mt-0.5 size-4 text-zinc-400" />
         <span className="text-zinc-500">{label}</span>
         <span className="text-right font-medium text-zinc-900">{value}</span>
      </div>
   );
}

function OrderDetails({ order }: { order: Order }) {
   return (
      <aside className="border-t border-zinc-200 px-5 py-6 lg:border-l lg:border-t-0">
         <h2 className="text-sm font-semibold text-zinc-950">Order details</h2>
         <div className="mt-3 divide-y divide-zinc-100">
            <DetailRow icon={CalendarDays} label="Placed" value={shortDate(order.createdAt)} />
            <DetailRow icon={UserRound} label="Customer" value={order.customerName || "Customer"} />
            <DetailRow icon={Smartphone} label="Phone" value={order.phone || order.chatId || "—"} />
         </div>

         <div className="mt-6">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-semibold text-zinc-950">Items</h2>
               <span className="text-xs text-zinc-400">{order.itemCount || order.lineItems?.length || 0}</span>
            </div>
            <div className="mt-3 divide-y divide-zinc-100 border-y border-zinc-100">
               {order.lineItems?.length ? order.lineItems.map((item) => (
                  <div key={item.productId || item.name} className="flex items-center justify-between gap-4 py-3">
                     <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-50"><PackageCheck className="size-4 text-zinc-500" /></span>
                        <div className="min-w-0">
                           <strong className="block truncate text-sm font-medium text-zinc-900">{item.name}</strong>
                           <span className="text-xs text-zinc-400">Qty {item.quantity}</span>
                        </div>
                     </div>
                     <strong className="shrink-0 text-sm text-zinc-900">{money(item.lineTotal)}</strong>
                  </div>
               )) : <p className="py-4 text-sm text-zinc-500">Dashboard payment request</p>}
            </div>
         </div>

         <div className="mt-6 space-y-3 rounded-2xl bg-zinc-50 p-4">
            {Number(order.discount || 0) > 0 ? (
               <>
                  <div className="flex items-center justify-between gap-3 text-sm text-zinc-600"><span>Subtotal</span><span>{money(Number(order.subtotal || order.amount))}</span></div>
                  <div className="flex items-center justify-between gap-3 text-sm font-medium text-emerald-700"><span>{order.promotion?.name || "Promotion"}</span><span>−{money(Number(order.discount || 0))}</span></div>
               </>
            ) : null}
            <div className="flex items-center justify-between gap-3">
               <span className="flex items-center gap-2 text-sm text-zinc-600"><WalletCards className="size-4" />M-Pesa</span>
               <strong className="text-sm text-emerald-800">{money(order.amount)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 text-xs">
               <span className="text-zinc-400">Receipt</span>
               <span className="font-semibold text-zinc-700">{order.mpesaReceiptNumber || order.paymentStatus}</span>
            </div>
         </div>

         <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><MessageCircleMore className="size-4" /></span>
            <div><strong className="block text-sm text-zinc-900">WhatsApp</strong><span className="text-xs text-zinc-500">{order.source === "dashboard" ? "Dashboard request" : "Chat order"}</span></div>
         </div>
      </aside>
   );
}

export function LiveOrders({ initialOrders = [] }: { initialOrders?: Order[] }) {
   const [orders, setOrders] = React.useState<Order[]>(initialOrders);
   const [selectedId, setSelectedId] = React.useState(initialOrders[0]?.id || "");
   const [savingId, setSavingId] = React.useState("");
   const [notice, setNotice] = React.useState("");
   const [query, setQuery] = React.useState("");
   const [filter, setFilter] = React.useState<Filter>("All");

   async function loadOrders() {
      const response = await fetch("/api/commerce/orders", { cache: "no-store" });
      const data = await response.json();
      const nextOrders = Array.isArray(data.orders) ? data.orders : [];
      setOrders(nextOrders);
      setSelectedId((current) => current && nextOrders.some((order: Order) => order.id === current) ? current : nextOrders[0]?.id || "");
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

   const counts = React.useMemo(() => ({
      All: orders.length,
      Active: orders.filter((order) => ["Paid", "Preparing", "Ready"].includes(order.status)).length,
      Completed: orders.filter((order) => order.status === "Completed").length,
   }), [orders]);

   const visibleOrders = React.useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();
      return orders.filter((order) => {
         const matchesFilter = filter === "All" || (filter === "Active" ? ["Paid", "Preparing", "Ready"].includes(order.status) : order.status === "Completed");
         const matchesQuery = !normalizedQuery || [order.orderNumber, order.customerName, order.phone, order.chatId].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedQuery));
         return matchesFilter && matchesQuery;
      });
   }, [filter, orders, query]);

   const selectedOrder = orders.find((order) => order.id === selectedId) || visibleOrders[0] || null;

   if (orders.length === 0) {
      return (
         <section className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white px-6 py-20 text-center shadow-[0_20px_70px_rgba(0,0,0,.06)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-700" />
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><PackageCheck className="size-7" /></span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">Your fulfilment timeline starts here</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">A verified M-Pesa payment creates an order automatically. Its payment, preparation, pickup, and completion history will appear here.</p>
            <Button type="button" variant="outline" onClick={() => loadOrders()} className="mt-6 rounded-xl"><RefreshCw className="mr-2 size-4" />Check for orders</Button>
         </section>
      );
   }

   return (
      <div className="space-y-4">
         {notice ? <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p> : null}
         <section className="grid min-h-[690px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_22px_70px_rgba(0,0,0,.07)] xl:grid-cols-[330px_minmax(0,1fr)]">
            <aside className="order-2 border-t border-zinc-200 bg-white xl:order-1 xl:border-b-0 xl:border-l-0 xl:border-r xl:border-t-0">
               <div className="border-b border-zinc-200 p-4">
                  <div className="flex gap-2">
                     <label className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders…" className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-9" />
                     </label>
                     <Button type="button" variant="outline" size="icon" onClick={() => loadOrders()} aria-label="Refresh orders" className="size-11 rounded-xl"><RefreshCw className="size-4" /></Button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 border-b border-zinc-200">
                     {(["All", "Active", "Completed"] as Filter[]).map((item) => (
                        <button key={item} type="button" onClick={() => setFilter(item)} className={`relative pb-3 text-xs font-semibold transition ${filter === item ? "text-emerald-800" : "text-zinc-400 hover:text-zinc-700"}`}>
                           {item} <span className="ml-1 font-normal">{counts[item]}</span>
                           {filter === item ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-emerald-700" /> : null}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="max-h-[570px] overflow-y-auto">
                  {visibleOrders.length ? visibleOrders.map((order) => <OrderQueueRow key={order.id} order={order} selected={selectedOrder?.id === order.id} onSelect={() => setSelectedId(order.id)} />) : (
                     <div className="px-6 py-16 text-center"><Search className="mx-auto size-7 text-zinc-300" /><p className="mt-3 text-sm font-medium text-zinc-700">No matching orders</p><p className="mt-1 text-xs text-zinc-400">Try another search or filter.</p></div>
                  )}
               </div>
               <div className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-400">Showing {visibleOrders.length} of {orders.length} orders</div>
            </aside>

            {selectedOrder ? (
               <div className="order-1 min-w-0 animate-in fade-in duration-300 xl:order-2" key={selectedOrder.id}>
                  <header className="grid gap-5 border-b border-zinc-200 px-6 py-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
                     <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-950">{selectedOrder.orderNumber}</h2>
                        <p className="mt-1 flex items-center gap-2 text-xs text-zinc-500"><MessageCircleMore className="size-4 text-emerald-600" />WhatsApp · {shortDate(selectedOrder.createdAt)}</p>
                     </div>
                     <div className="flex gap-8">
                        <div><span className="block text-xs text-zinc-400">Customer</span><strong className="mt-1 block max-w-40 truncate text-sm text-zinc-900">{selectedOrder.customerName}</strong></div>
                        <div><span className="block text-xs text-zinc-400">Total</span><strong className="mt-1 block text-base text-emerald-800">{money(selectedOrder.amount)}</strong></div>
                     </div>
                     <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClasses(selectedOrder.status)}`}>{selectedOrder.status}</span>
                  </header>
                  <div className="grid lg:grid-cols-[minmax(360px,1fr)_340px]">
                     <OrderTimeline order={selectedOrder} saving={savingId === selectedOrder.id} onMove={(status) => moveOrder(selectedOrder, status)} />
                     <OrderDetails order={selectedOrder} />
                  </div>
               </div>
            ) : null}
         </section>
      </div>
   );
}
