"use client";

import * as React from "react";
import { BookOpenText, Check, Clock3, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type KnowledgeEntry = {
   id: string;
   topic: string;
   content: string;
   createdAt: string;
   updatedAt: string;
};

type Draft = { id?: string; topic: string; content: string };
const emptyDraft: Draft = { topic: "", content: "" };

function formatUpdatedAt(value?: string) {
   if (!value) return "Not saved yet";
   return new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
   }).format(new Date(value));
}

export function KnowledgeManager({ initialEntries }: { initialEntries: KnowledgeEntry[] }) {
   const [entries, setEntries] = React.useState(initialEntries);
   const [selectedId, setSelectedId] = React.useState(initialEntries[0]?.id || "");
   const [draft, setDraft] = React.useState<Draft>(initialEntries[0] || emptyDraft);
   const [saving, setSaving] = React.useState(false);
   const [notice, setNotice] = React.useState("");

   const latestUpdate = entries
      .map((entry) => entry.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

   function selectEntry(entry: KnowledgeEntry) {
      setSelectedId(entry.id);
      setDraft({ id: entry.id, topic: entry.topic, content: entry.content });
      setNotice("");
   }

   function createEntry() {
      setSelectedId("");
      setDraft(emptyDraft);
      setNotice("");
   }

   async function saveEntry(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSaving(true);
      setNotice("");

      try {
         const response = await fetch("/api/commerce/knowledge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Knowledge could not be saved");

         const saved = data.entry as KnowledgeEntry;
         setEntries((current) => {
            const exists = current.some((entry) => entry.id === saved.id);
            return exists
               ? current.map((entry) => (entry.id === saved.id ? saved : entry))
               : [...current, saved];
         });
         setSelectedId(saved.id);
         setDraft({ id: saved.id, topic: saved.topic, content: saved.content });
         setNotice("Saved. New customer replies will use this information.");
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Knowledge could not be saved");
      } finally {
         setSaving(false);
      }
   }

   async function deleteEntry() {
      if (!draft.id) return;
      setSaving(true);
      setNotice("");

      try {
         const response = await fetch(`/api/commerce/knowledge?id=${encodeURIComponent(draft.id)}`, {
            method: "DELETE",
         });
         if (!response.ok) throw new Error("Knowledge could not be deleted");

         const remaining = entries.filter((entry) => entry.id !== draft.id);
         setEntries(remaining);
         if (remaining[0]) selectEntry(remaining[0]);
         else createEntry();
         setNotice("Entry deleted.");
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Knowledge could not be deleted");
      } finally {
         setSaving(false);
      }
   }

   return (
      <div className="space-y-6">
         <section className="grid overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm sm:grid-cols-3">
            <div className="flex items-center gap-4 border-b border-zinc-100 p-5 sm:border-b-0 sm:border-r">
               <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><BookOpenText className="size-5" /></span>
               <div><strong className="block text-xl">{entries.length}</strong><span className="text-sm text-zinc-500">approved topics</span></div>
            </div>
            <div className="flex items-center gap-4 border-b border-zinc-100 p-5 sm:border-b-0 sm:border-r">
               <span className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck className="size-5" /></span>
               <div><strong className="block text-sm">Live in replies</strong><span className="text-sm text-zinc-500">only saved facts are used</span></div>
            </div>
            <div className="flex items-center gap-4 p-5">
               <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><Clock3 className="size-5" /></span>
               <div><strong className="block text-sm">Last updated</strong><span className="text-sm text-zinc-500">{formatUpdatedAt(latestUpdate)}</span></div>
            </div>
         </section>

         <section className="grid min-h-[560px] overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r">
               <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
                  <div>
                     <h2 className="font-semibold text-zinc-950">Knowledge library</h2>
                     <p className="mt-1 text-sm leading-5 text-zinc-500">Choose a topic to review or update.</p>
                  </div>
                  <Button type="button" size="icon" onClick={createEntry} aria-label="Add knowledge topic" className="shrink-0 rounded-xl">
                     <Plus className="size-4" />
                  </Button>
               </div>
               <div className="space-y-2 p-3">
                  {entries.map((entry) => (
                     <button
                        key={entry.id}
                        type="button"
                        onClick={() => selectEntry(entry)}
                        className={cn(
                           "w-full rounded-xl border px-4 py-3.5 text-left transition",
                           selectedId === entry.id
                              ? "border-emerald-300 bg-emerald-50 shadow-sm"
                              : "border-transparent hover:border-zinc-200 hover:bg-white",
                        )}>
                        <span className="flex items-center justify-between gap-3">
                           <strong className="text-sm text-zinc-900">{entry.topic}</strong>
                           {selectedId === entry.id ? <Check className="size-4 shrink-0 text-emerald-700" /> : null}
                        </span>
                        <span className="mt-1.5 line-clamp-2 block text-xs leading-5 text-zinc-500">{entry.content}</span>
                     </button>
                  ))}
                  {entries.length === 0 ? (
                     <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-5 text-sm leading-6 text-zinc-500">
                        No approved topics yet. Add the first verified business answer.
                     </div>
                  ) : null}
               </div>
            </div>

            <div className="p-6 sm:p-8">
               <div className="max-w-3xl">
                  <div className="mb-7 flex items-start justify-between gap-4">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{draft.id ? "Editing approved answer" : "New approved answer"}</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Give the assistant one clear source of truth</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Write only confirmed business information. If a detail changes, update it here before customers ask.</p>
                     </div>
                  </div>

                  <form className="space-y-6" onSubmit={saveEntry}>
                     <label className="block space-y-2 text-sm font-medium text-zinc-800">
                        Topic
                        <Input
                           value={draft.topic}
                           onChange={(event) => setDraft((current) => ({ ...current, topic: event.target.value }))}
                           placeholder="e.g. Delivery areas"
                           className="h-12 rounded-xl border-zinc-200 bg-white"
                        />
                     </label>
                     <label className="block space-y-2 text-sm font-medium text-zinc-800">
                        Approved information
                        <Textarea
                           value={draft.content}
                           onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
                           placeholder="Write the exact information the assistant is allowed to use..."
                           className="min-h-52 resize-y rounded-xl border-zinc-200 bg-white p-4 leading-7"
                        />
                     </label>

                     <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                        Do not save PINs, passwords, OTPs, private customer data, or information that has not been verified by the business.
                     </div>

                     {notice ? <p role="status" aria-live="polite" className="text-sm font-medium text-zinc-600">{notice}</p> : null}
                     <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" disabled={saving} className="h-11 rounded-xl px-5">
                           <Save className="mr-2 size-4" />{saving ? "Saving…" : "Save approved answer"}
                        </Button>
                        {draft.id ? (
                           <Button type="button" variant="outline" disabled={saving} onClick={deleteEntry} className="h-11 rounded-xl border-red-200 px-5 text-red-700 hover:bg-red-50 hover:text-red-800">
                              <Trash2 className="mr-2 size-4" />Delete
                           </Button>
                        ) : null}
                     </div>
                  </form>
               </div>
            </div>
         </section>
      </div>
   );
}
