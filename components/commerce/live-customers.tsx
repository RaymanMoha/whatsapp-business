"use client";

import * as React from "react";

type Customer = {
   id: string;
   chatId: string;
   customerName: string;
   firstSeenAt: string;
   lastSeenAt: string;
   lastMessage: string;
   inboundCount: number;
   outboundCount: number;
   messageCount: number;
   status: string;
};

export function LiveCustomers() {
   const [customers, setCustomers] = React.useState<Customer[]>([]);
   const [loaded, setLoaded] = React.useState(false);

   React.useEffect(() => {
      let cancelled = false;

      async function load() {
         try {
            const response = await fetch("/api/commerce/customers", { cache: "no-store" });
            const data = await response.json();
            if (!cancelled) {
               setCustomers(Array.isArray(data.customers) ? data.customers : []);
               setLoaded(true);
            }
         } catch {
            if (!cancelled) setLoaded(true);
         }
      }

      load();
      const interval = window.setInterval(load, 5000);
      return () => {
         cancelled = true;
         window.clearInterval(interval);
      };
   }, []);

   if (!loaded) {
      return <p className="text-sm text-zinc-500">Loading customers…</p>;
   }

   if (customers.length === 0) {
      return (
         <div className="rounded-xl border border-dashed p-4 text-sm text-zinc-600">
            No WhatsApp customers recorded yet. When a customer texts the connected number,
            their profile will appear here automatically.
         </div>
      );
   }

   return (
      <div className="overflow-hidden rounded-xl border">
         <div className="grid grid-cols-5 bg-zinc-50 px-4 py-3 text-sm font-bold">
            <span>Customer</span>
            <span>Last message</span>
            <span>Status</span>
            <span>Messages</span>
            <span>Last seen</span>
         </div>
         {customers.map((customer) => (
            <div key={customer.id} className="grid grid-cols-5 gap-3 border-t px-4 py-4 text-sm">
               <div className="min-w-0">
                  <strong className="block truncate">{customer.customerName}</strong>
                  <span className="block truncate text-xs text-zinc-500">{customer.chatId}</span>
               </div>
               <span className="line-clamp-2 text-zinc-700">{customer.lastMessage || "No message text"}</span>
               <span
                  className={`h-fit w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                     customer.status === "Replied"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                  }`}>
                  {customer.status}
               </span>
               <span>
                  {customer.messageCount} total
                  <span className="block text-xs text-zinc-500">
                     {customer.inboundCount} in · {customer.outboundCount} out
                  </span>
               </span>
               <span className="text-xs text-zinc-500">
                  {customer.lastSeenAt ? new Date(customer.lastSeenAt).toLocaleString() : "Unknown"}
               </span>
            </div>
         ))}
      </div>
   );
}
