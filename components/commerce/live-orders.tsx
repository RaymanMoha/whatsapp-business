"use client";

import * as React from "react";

type OrderIntent = {
   id: string;
   chatId: string;
   customerName: string;
   request: string;
   createdAt: string;
   status: string;
   replyPreview: string;
};

export function LiveOrders({
   initialOrders = [],
}: {
   initialOrders?: OrderIntent[];
}) {
   const [orders, setOrders] = React.useState<OrderIntent[]>(initialOrders);
   const [loaded, setLoaded] = React.useState(initialOrders.length > 0);

   React.useEffect(() => {
      let cancelled = false;

      async function load() {
         try {
            const response = await fetch("/api/commerce/orders", { cache: "no-store" });
            const data = await response.json();
            if (!cancelled) {
               setOrders(Array.isArray(data.orders) ? data.orders : []);
               setLoaded(true);
            }
         } catch {
            if (!cancelled) setLoaded(true);
         }
      }

      if (initialOrders.length === 0) load();
      const interval = window.setInterval(load, 5000);
      return () => {
         cancelled = true;
         window.clearInterval(interval);
      };
   }, [initialOrders.length]);

   if (!loaded) {
      return <p className="text-sm text-zinc-500">Loading order intent…</p>;
   }

   if (orders.length === 0) {
      return (
         <div className="rounded-xl border border-dashed p-4 text-sm text-zinc-600">
            No order intent detected yet. Messages mentioning buying, delivery, price,
            stock, or availability will appear here.
         </div>
      );
   }

   return (
      <div className="space-y-3">
         {orders.map((order) => (
            <div key={order.id} className="rounded-xl border p-4">
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                     <strong>{order.customerName}</strong>
                     <span className="ml-2 text-xs text-zinc-500">{order.chatId}</span>
                  </div>
                  <span
                     className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === "AI replied"
                           ? "bg-emerald-50 text-emerald-700"
                           : "bg-amber-50 text-amber-700"
                     }`}>
                     {order.status}
                  </span>
               </div>
               <p className="mt-3 text-sm text-zinc-900">{order.request}</p>
               {order.replyPreview ? (
                  <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                     {order.replyPreview}
                  </p>
               ) : null}
               <p className="mt-2 text-xs text-zinc-500">
                  {new Date(order.createdAt).toLocaleString()}
               </p>
            </div>
         ))}
      </div>
   );
}
