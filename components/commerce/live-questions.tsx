"use client";

import * as React from "react";
import { AlertTriangle, Bot, CheckCircle2, Clock3, MessageCircleQuestion, Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";

type ConversationSummary = { id: string; chatId: string; customerName: string; updatedAt: string; lastQuestion: string; lastReply: string; status: string; error?: string; messageCount: number };

function statusTone(status: string) {
   if (status === "Reply sent") return "bg-emerald-50 text-emerald-700";
   if (status === "Send failed") return "bg-red-50 text-red-700";
   return "bg-amber-50 text-amber-700";
}

export function LiveQuestions() {
   const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
   const [loaded, setLoaded] = React.useState(false);
   const [selectedId, setSelectedId] = React.useState("");
   const [query, setQuery] = React.useState("");
   const [filter, setFilter] = React.useState<"all" | "attention" | "replied">("all");

   React.useEffect(() => {
      let cancelled = false;
      async function load() {
         try {
            const response = await fetch("/api/commerce/messages", { cache: "no-store" });
            const data = await response.json();
            if (!cancelled) {
               const next = Array.isArray(data.conversations) ? data.conversations : [];
               setConversations(next);
               setSelectedId((current) => current || next[0]?.id || "");
               setLoaded(true);
            }
         } catch { if (!cancelled) setLoaded(true); }
      }
      void load();
      const interval = window.setInterval(load, 3500);
      return () => { cancelled = true; window.clearInterval(interval); };
   }, []);

   const attention = conversations.filter((item) => item.status !== "Reply sent").length;
   const filtered = conversations.filter((item) => {
      const search = `${item.customerName} ${item.lastQuestion} ${item.lastReply}`.toLowerCase().includes(query.toLowerCase());
      return search && (filter === "all" || (filter === "replied" ? item.status === "Reply sent" : item.status !== "Reply sent"));
   });
   const selected = conversations.find((item) => item.id === selectedId) || filtered[0];

   if (!loaded) return <div className="min-h-[560px] animate-pulse rounded-[28px] border bg-white/60" />;
   if (!conversations.length) return <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><MessageCircleQuestion /></span><h2 className="mt-5 text-xl font-semibold">No customer questions yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">Incoming questions and assistant replies will appear here automatically.</p></div></div>;

   return <section className="grid min-h-[620px] overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(0,63,55,.08)] xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r"><div className="border-b border-zinc-200 p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions…" className="h-11 rounded-xl bg-white pl-9" /></div><div className="mt-3 grid grid-cols-3 text-xs font-medium text-zinc-500">{([['all', `All ${conversations.length}`], ['attention', `Attention ${attention}`], ['replied', `Replied ${conversations.length - attention}`]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border-b-2 px-1 py-2.5 ${filter === value ? 'border-emerald-700 text-emerald-800' : 'border-transparent'}`}>{label}</button>)}</div></div><div className="max-h-[520px] overflow-y-auto">{filtered.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`w-full border-b border-zinc-100 border-l-4 px-4 py-4 text-left transition ${selected?.id === item.id ? 'border-l-emerald-700 bg-emerald-50/80' : 'border-l-transparent hover:bg-white'}`}><div className="flex items-center justify-between gap-3"><strong className="truncate text-sm">{item.customerName}</strong><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${statusTone(item.status)}`}>{item.status}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-600">{item.lastQuestion}</p><p className="mt-2 text-[11px] text-zinc-400">{new Date(item.updatedAt).toLocaleString()}</p></button>)}</div></aside>
      {selected ? <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_300px]"><main className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Selected conversation</p><h2 className="mt-2 text-xl font-semibold">{selected.customerName}</h2><p className="mt-1 text-xs text-zinc-400">{selected.chatId}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusTone(selected.status)}`}>{selected.status}</span></div><div className="mx-auto max-w-2xl py-8"><div className="max-w-[88%] rounded-2xl rounded-tl-sm border bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-xs font-semibold text-zinc-500"><UserRound className="size-4" /> Customer asked</div><p className="mt-3 text-sm leading-7 text-zinc-900">{selected.lastQuestion}</p></div>{selected.lastReply ? <div className="ml-auto mt-4 max-w-[88%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] p-5"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-800"><Bot className="size-4" /> Assistant replied</div><p className="mt-3 text-sm leading-7 text-zinc-900">{selected.lastReply}</p></div> : null}{selected.error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950"><div className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4" /> Reply needs attention</div><p className="mt-2 text-sm leading-6 text-red-800">{selected.error}</p><a href="/dashboard/knowledge" className="mt-4 inline-flex rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white">Improve approved knowledge</a></div> : null}</div></main><aside className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Conversation health</p><div className="mt-5 space-y-4"><div className="flex gap-3 border-b pb-4"><Clock3 className="size-4 text-zinc-400" /><div><span className="block text-xs text-zinc-400">Last activity</span><strong className="mt-1 block text-sm">{new Date(selected.updatedAt).toLocaleString()}</strong></div></div><div className="flex gap-3 border-b pb-4"><MessageCircleQuestion className="size-4 text-zinc-400" /><div><span className="block text-xs text-zinc-400">Messages</span><strong className="mt-1 block text-sm">{selected.messageCount} total</strong></div></div><div className="flex gap-3"><CheckCircle2 className="size-4 text-emerald-600" /><div><span className="block text-xs text-zinc-400">Automation status</span><strong className="mt-1 block text-sm">{selected.status === 'Reply sent' ? 'Handled automatically' : 'Review recommended'}</strong></div></div></div></aside></div> : null}
   </section>;
}
