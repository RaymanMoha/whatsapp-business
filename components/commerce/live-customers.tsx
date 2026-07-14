"use client";

import * as React from "react";
import { ArrowUpRight, Clock3, MessageCircleMore, Search, UserRound, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";

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

function initials(name: string) {
   return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CU";
}

function shortDate(value: string) {
   return value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Unknown";
}

export function LiveCustomers({ initialCustomers = [] }: { initialCustomers?: Customer[] }) {
   const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
   const [loaded, setLoaded] = React.useState(initialCustomers.length > 0);
   const [query, setQuery] = React.useState("");
   const [filter, setFilter] = React.useState<"all" | "replied" | "waiting">("all");
   const [selectedId, setSelectedId] = React.useState(initialCustomers[0]?.id || "");

   React.useEffect(() => {
      let cancelled = false;
      async function load() {
         try {
            const response = await fetch("/api/commerce/customers", { cache: "no-store" });
            const data = await response.json();
            if (!cancelled) {
               const next = Array.isArray(data.customers) ? data.customers : [];
               setCustomers(next);
               setSelectedId((current) => current || next[0]?.id || "");
               setLoaded(true);
            }
         } catch { if (!cancelled) setLoaded(true); }
      }
      if (initialCustomers.length === 0) void load();
      const interval = window.setInterval(load, 5000);
      return () => { cancelled = true; window.clearInterval(interval); };
   }, [initialCustomers.length]);

   const filtered = customers.filter((customer) => {
      const matchesQuery = `${customer.customerName} ${customer.chatId} ${customer.lastMessage}`.toLowerCase().includes(query.toLowerCase());
      const replied = customer.status === "Replied";
      return matchesQuery && (filter === "all" || (filter === "replied" ? replied : !replied));
   });
   const selected = customers.find((customer) => customer.id === selectedId) || filtered[0];
   const waiting = customers.filter((customer) => customer.status !== "Replied").length;

   if (!loaded) return <div className="min-h-[560px] animate-pulse rounded-[28px] border bg-white/60" />;

   if (customers.length === 0) {
      return <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-8 text-center">
         <div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><UsersRound /></span><h2 className="mt-5 text-xl font-semibold">Your customer workspace is ready</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">Profiles, message activity and reply status will appear here after the first customer texts the connected number.</p></div>
      </div>;
   }

   return (
      <section className="grid min-h-[620px] overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(0,63,55,.08)] xl:grid-cols-[390px_minmax(0,1fr)]">
         <aside className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r">
            <div className="border-b border-zinc-200 p-4">
               <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers…" className="h-11 rounded-xl bg-white pl-9" /></div>
               <div className="mt-3 grid grid-cols-3 text-xs font-medium text-zinc-500">
                  {([['all', `All ${customers.length}`], ['waiting', `Waiting ${waiting}`], ['replied', `Replied ${customers.length - waiting}`]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border-b-2 px-2 py-2.5 transition ${filter === value ? "border-emerald-700 text-emerald-800" : "border-transparent hover:text-zinc-900"}`}>{label}</button>)}
               </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
               {filtered.map((customer) => <button key={customer.id} type="button" onClick={() => setSelectedId(customer.id)} className={`flex w-full gap-3 border-b border-zinc-100 px-4 py-4 text-left transition ${selected?.id === customer.id ? "border-l-4 border-l-emerald-700 bg-emerald-50/80" : "border-l-4 border-l-transparent hover:bg-white"}`}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#073f36] text-xs font-bold text-white">{initials(customer.customerName)}</span>
                  <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><strong className="truncate text-sm">{customer.customerName}</strong><span className="shrink-0 text-[11px] text-zinc-400">{customer.lastSeenAt ? new Date(customer.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span></span><span className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{customer.lastMessage || "No message text"}</span><span className={`mt-2 inline-block text-[11px] font-semibold ${customer.status === "Replied" ? "text-emerald-700" : "text-amber-700"}`}>{customer.status}</span></span>
               </button>)}
            </div>
         </aside>

         {selected ? <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <main className="min-w-0 border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r sm:p-8">
               <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-900">{initials(selected.customerName)}</span><div><h2 className="text-xl font-semibold">{selected.customerName}</h2><p className="mt-1 text-xs text-zinc-500">{selected.chatId}</p></div></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selected.status === "Replied" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{selected.status}</span></div>
               <div className="grid min-h-[360px] place-items-center py-8"><div className="w-full max-w-xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Latest conversation</p><div className="mt-5 rounded-2xl rounded-tl-sm border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-sm leading-7 text-zinc-800">{selected.lastMessage || "No message text recorded."}</p><p className="mt-3 text-xs text-zinc-400">Received {shortDate(selected.lastSeenAt)}</p></div>{selected.status === "Replied" ? <div className="ml-auto mt-4 max-w-[88%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] p-5"><p className="text-sm leading-6 text-zinc-800">The commerce assistant replied to this customer.</p><p className="mt-2 text-xs text-emerald-800/60">Reply delivered</p></div> : <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><strong>Customer is waiting.</strong><p className="mt-1 text-amber-800">Open Customer Questions to review the latest response state.</p></div>}</div></div>
            </main>
            <aside className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Customer details</p><div className="mt-5 space-y-1">
               {[[UserRound, "First seen", shortDate(selected.firstSeenAt)], [Clock3, "Last seen", shortDate(selected.lastSeenAt)], [MessageCircleMore, "Messages", `${selected.messageCount} total`]].map(([Icon, label, value]) => <div key={label as string} className="flex items-start gap-3 border-b border-zinc-100 py-4"><Icon className="mt-0.5 size-4 text-zinc-400" /><span className="min-w-0"><span className="block text-xs text-zinc-400">{label as string}</span><strong className="mt-1 block break-words text-sm">{value as string}</strong></span></div>)}
            </div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-zinc-50 p-4"><strong className="text-xl">{selected.inboundCount}</strong><span className="mt-1 block text-xs text-zinc-500">received</span></div><div className="rounded-xl bg-zinc-50 p-4"><strong className="text-xl">{selected.outboundCount}</strong><span className="mt-1 block text-xs text-zinc-500">sent</span></div></div><a href="/dashboard/questions" className="mt-6 flex h-11 items-center justify-between rounded-xl bg-[#073f36] px-4 text-sm font-semibold text-white">Open question queue <ArrowUpRight className="size-4" /></a></aside>
         </div> : null}
      </section>
   );
}
