"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clipboard, FileText, MessageCircleMore, Plus, Search, Trash2, Variable } from "lucide-react";

type MessageTemplate = {
   id: string;
   name: string;
   category: string;
   body: string;
   variables: string[];
   updatedAt: string;
};

type FormState = {
   id?: string;
   name: string;
   category: string;
   body: string;
};

const emptyForm: FormState = {
   name: "",
   category: "General",
   body: "",
};

const sampleValues: Record<string, string> = {
   customer_name: "Amina",
   product_list: "• Organic Honey — KES 249\n• Green Tea — KES 149\n• Lavender Candle — KES 249",
   order_summary: "2 × Organic Honey\n1 × Green Tea",
   order_total: "KES 647",
};

function renderPreview(body: string) {
   return body.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => {
      return sampleValues[key] || `[${key}]`;
   });
}

function extractVariables(body: string) {
   return [...new Set(Array.from(body.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)).map((match) => match[1]))];
}

export function MessageTemplates() {
   const [templates, setTemplates] = React.useState<MessageTemplate[]>([]);
   const [selectedId, setSelectedId] = React.useState<string>("");
   const [form, setForm] = React.useState<FormState>(emptyForm);
   const [loading, setLoading] = React.useState(true);
   const [saving, setSaving] = React.useState(false);
   const [notice, setNotice] = React.useState("");
   const [query, setQuery] = React.useState("");

   const selected = templates.find((template) => template.id === selectedId);
   const preview = renderPreview(form.body);
   const variables = extractVariables(form.body);
   const filteredTemplates = templates.filter((template) => `${template.name} ${template.category} ${template.body}`.toLowerCase().includes(query.toLowerCase()));
   const categories = [...new Set(templates.map((template) => template.category))];

   function insertVariable(variable: string) {
      setForm((current) => ({ ...current, body: `${current.body}${current.body ? " " : ""}{{${variable}}}` }));
   }

   async function loadTemplates() {
      const response = await fetch("/api/commerce/templates", { cache: "no-store" });
      const data = await response.json();
      const nextTemplates = Array.isArray(data.templates) ? data.templates : [];
      setTemplates(nextTemplates);
      setLoading(false);

      if (!selectedId && nextTemplates.length > 0) {
         selectTemplate(nextTemplates[0]);
      }
   }

   function selectTemplate(template: MessageTemplate) {
      setSelectedId(template.id);
      setForm({
         id: template.id,
         name: template.name,
         category: template.category,
         body: template.body,
      });
      setNotice("");
   }

   function newTemplate() {
      setSelectedId("");
      setForm(emptyForm);
      setNotice("");
   }

   async function saveTemplate(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSaving(true);
      setNotice("");

      try {
         const response = await fetch("/api/commerce/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Template could not be saved");
         }

         setNotice("Template saved.");
         setSelectedId(data.template.id);
         await loadTemplates();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Template could not be saved");
      } finally {
         setSaving(false);
      }
   }

   async function deleteTemplate() {
      if (!form.id) return;
      setSaving(true);
      setNotice("");

      try {
         const response = await fetch(`/api/commerce/templates?id=${encodeURIComponent(form.id)}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Template could not be deleted");
         }

         setNotice("Template deleted.");
         setSelectedId("");
         setForm(emptyForm);
         await loadTemplates();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Template could not be deleted");
      } finally {
         setSaving(false);
      }
   }

   async function copyPreview() {
      await navigator.clipboard.writeText(preview);
      setNotice("Preview copied. Paste it into WhatsApp or a customer reply.");
   }

   React.useEffect(() => {
      loadTemplates().catch(() => {
         setLoading(false);
         setNotice("Templates could not load.");
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <section className="grid min-h-[680px] overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(0,63,55,.08)] xl:grid-cols-[310px_minmax(0,1fr)_360px]">
         <aside className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r">
            <div className="border-b border-zinc-200 p-4"><Button type="button" onClick={newTemplate} className="mb-3 w-full"><Plus className="size-4" /> Create template</Button><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates…" className="h-11 bg-white pl-9" /></div></div>
            <div className="border-b border-zinc-200 px-4 py-3 text-xs text-zinc-500">{templates.length} templates · {categories.length} categories</div>
            <div className="max-h-[560px] overflow-y-auto">
               {loading ? <p className="text-sm text-zinc-500">Loading templates…</p> : null}
               {!loading && templates.length === 0 ? (
                  <p className="m-4 rounded-xl border border-dashed p-4 text-sm text-zinc-500">
                     No templates yet. Create the first reusable reply.
                  </p>
               ) : null}
               {filteredTemplates.map((template) => (
                  <button
                     key={template.id}
                     type="button"
                     onClick={() => selectTemplate(template)}
                     className={`w-full border-b border-zinc-100 border-l-4 p-4 text-left transition ${
                        template.id === selectedId
                           ? "border-l-emerald-700 bg-emerald-50"
                           : "border-l-transparent hover:bg-white"
                     }`}>
                     <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm">{template.name}</strong>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{template.category}</span>
                     </div>
                     <p className="mt-2 line-clamp-2 whitespace-pre-line text-xs text-zinc-600">
                        {template.body}
                     </p>
                  </button>
               ))}
            </div>
         </aside>

         <main className="border-b border-zinc-200 p-6 xl:border-b-0 xl:border-r sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">{selected ? "Editing saved template" : "New reusable reply"}</p><h2 className="mt-2 text-xl font-semibold">{selected ? selected.name : "Create template"}</h2><p className="mt-1 text-sm text-zinc-500">Compose the exact message customers should receive.</p></div>{form.id ? <Button type="button" variant="outline" size="sm" disabled={saving} onClick={deleteTemplate} className="border-red-200 text-red-700"><Trash2 className="size-4" /> Delete</Button> : null}</div>
            <div className="pt-6">
                  <form className="space-y-4" onSubmit={saveTemplate}>
                     <div className="grid gap-3 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium">
                           Name
                           <Input
                              value={form.name}
                              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                              placeholder="Available products"
                           />
                        </label>
                        <label className="space-y-2 text-sm font-medium">
                           Category
                           <Input
                              value={form.category}
                              onChange={(event) =>
                                 setForm((prev) => ({ ...prev, category: event.target.value }))
                              }
                              placeholder="Products"
                           />
                        </label>
                     </div>
                     <label className="space-y-2 text-sm font-medium">
                        Message body
                        <Textarea
                           value={form.body}
                           onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                           rows={10}
                           placeholder="Hi {{customer_name}}, here is what is available today..."
                           className="min-h-56"
                        />
                     </label>
                     <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-zinc-500"><Variable className="size-4" /> Insert variable</div><div className="mt-3 flex flex-wrap gap-2">{Object.keys(sampleValues).map((variable) => <button key={variable} type="button" onClick={() => insertVariable(variable)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:border-emerald-400 hover:text-emerald-800">{`{{${variable}}}`}</button>)}</div><p className="mt-3 text-xs text-zinc-400">{variables.length ? `${variables.length} variable${variables.length === 1 ? '' : 's'} detected in this message.` : 'No variables used yet.'}</p></div>
                     {notice ? <p className="text-sm text-zinc-600">{notice}</p> : null}
                     <div className="flex items-center justify-between gap-4 border-t pt-5"><span className="flex items-center gap-2 text-xs text-zinc-500">{form.name && form.body ? <><Check className="size-4 text-emerald-700" /> Ready to save</> : <><FileText className="size-4" /> Add a name and message</>}</span><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save template"}</Button></div>
                  </form>
            </div>
         </main>

         <aside className="bg-zinc-50/60 p-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">WhatsApp preview</p><p className="mt-1 text-sm text-zinc-500">Sample values are filled automatically.</p></div><div className="mx-auto mt-6 max-w-[290px] rounded-[34px] border-[7px] border-zinc-950 bg-[#efe7dc] p-3 shadow-xl"><div className="mb-4 flex items-center gap-3 rounded-t-[22px] bg-[#075e54] px-3 py-4 text-white"><span className="grid size-8 place-items-center rounded-full bg-white/20"><MessageCircleMore className="size-4" /></span><div><strong className="block text-xs">Commerce assistant</strong><span className="text-[10px] text-white/70">online</span></div></div><div className="min-h-[330px] py-4">
                  <div className="ml-auto max-w-[94%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-4 shadow-sm">
                     <p className="whitespace-pre-line text-sm leading-6 text-zinc-900">
                        {preview || "Write a template to preview it here."}
                     </p>
                  </div>
               </div></div><Button type="button" variant="outline" className="mt-5 w-full bg-white" onClick={copyPreview} disabled={!form.body}><Clipboard className="size-4" /> Copy ready message</Button><div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4"><p className="text-xs font-semibold">Template details</p><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between"><dt className="text-zinc-400">Category</dt><dd>{form.category || '—'}</dd></div><div className="flex justify-between"><dt className="text-zinc-400">Variables</dt><dd>{variables.length}</dd></div><div className="flex justify-between"><dt className="text-zinc-400">Updated</dt><dd>{selected?.updatedAt ? new Date(selected.updatedAt).toLocaleDateString() : 'Not saved'}</dd></div></dl></div></aside>
      </section>
   );
}
