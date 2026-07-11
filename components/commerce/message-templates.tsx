"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

   const selected = templates.find((template) => template.id === selectedId);
   const preview = renderPreview(form.body);
   const variables = extractVariables(form.body);

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
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
         <Card className="text-black dark:text-black">
            <CardHeader>
               <div className="flex items-start justify-between gap-3">
                  <div>
                     <CardTitle>Saved templates</CardTitle>
                     <CardDescription>
                        Reusable replies for WhatsApp customers.
                     </CardDescription>
                  </div>
                  <Button type="button" size="sm" onClick={newTemplate}>
                     New
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="space-y-3">
               {loading ? <p className="text-sm text-zinc-500">Loading templates…</p> : null}
               {!loading && templates.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-4 text-sm text-zinc-500">
                     No templates yet. Create the first one on the right.
                  </p>
               ) : null}
               {templates.map((template) => (
                  <button
                     key={template.id}
                     type="button"
                     onClick={() => selectTemplate(template)}
                     className={`w-full rounded-xl border p-4 text-left transition ${
                        template.id === selectedId
                           ? "border-emerald-400 bg-emerald-50"
                           : "border-zinc-200 bg-white hover:border-emerald-200"
                     }`}>
                     <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm">{template.name}</strong>
                        <Badge variant="secondary">{template.category}</Badge>
                     </div>
                     <p className="mt-2 line-clamp-2 whitespace-pre-line text-xs text-zinc-600">
                        {template.body}
                     </p>
                  </button>
               ))}
            </CardContent>
         </Card>

         <div className="grid gap-6 lg:grid-cols-2">
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>{selected ? "Edit template" : "Create template"}</CardTitle>
                  <CardDescription>
                     Use variables like {"{{customer_name}}"} or {"{{product_list}}"}.
                  </CardDescription>
               </CardHeader>
               <CardContent>
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
                     <div className="flex flex-wrap gap-2">
                        {variables.length > 0 ? (
                           variables.map((variable) => (
                              <Badge key={variable} variant="outline">
                                 {`{{${variable}}}`}
                              </Badge>
                           ))
                        ) : (
                           <span className="text-xs text-zinc-500">No variables detected.</span>
                        )}
                     </div>
                     {notice ? <p className="text-sm text-zinc-600">{notice}</p> : null}
                     <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={saving}>
                           {saving ? "Saving…" : "Save template"}
                        </Button>
                        {form.id ? (
                           <Button type="button" variant="outline" disabled={saving} onClick={deleteTemplate}>
                              Delete
                           </Button>
                        ) : null}
                     </div>
                  </form>
               </CardContent>
            </Card>

            <Card className="overflow-hidden text-black dark:text-black">
               <CardHeader className="bg-zinc-950 text-white">
                  <CardTitle>WhatsApp preview</CardTitle>
                  <CardDescription className="text-zinc-300">
                     Variables are filled with sample customer and product data.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 bg-[#efe7dc] p-6">
                  <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-4 shadow-sm">
                     <p className="whitespace-pre-line text-sm leading-6 text-zinc-900">
                        {preview || "Write a template to preview it here."}
                     </p>
                  </div>
                  <Button type="button" onClick={copyPreview} disabled={!form.body}>
                     Copy preview
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
