"use client";

import * as React from "react";
import {
   ArrowRight,
   Check,
   CheckCircle2,
   Clipboard,
   Cloud,
   ExternalLink,
   FileInput,
   FileSpreadsheet,
   FileText,
   KeyRound,
   Loader2,
   RefreshCw,
   ShieldCheck,
   Sparkles,
   Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type SecretStatus = { configured: boolean; ending: string | null; source: string };

export type GoogleToolsSettings = {
   values: {
      googleSpreadsheetUrl: string;
      googleAppsScriptUrl: string;
   };
   secrets: {
      googleIntegrationSecret: SecretStatus;
   };
   updatedAt: string | null;
};

type Activity = {
   state: "idle" | "working" | "success" | "error";
   message?: string;
};

const destinations = [
   { name: "Catalog", detail: "Products, prices, stock and image status", icon: Table2, color: "text-emerald-700", bg: "bg-emerald-50" },
   { name: "Orders", detail: "Customer, items, total and fulfilment status", icon: FileText, color: "text-blue-700", bg: "bg-blue-50" },
   { name: "Payments", detail: "Reference, amount, receipt and payment status", icon: FileSpreadsheet, color: "text-amber-700", bg: "bg-amber-50" },
];

function StatusMessage({ activity }: { activity: Activity }) {
   if (activity.state === "idle") return null;
   const success = activity.state === "success";
   return (
      <div role="status" aria-live="polite" className={`flex items-center gap-2 text-sm ${success ? "text-emerald-700" : activity.state === "error" ? "text-red-700" : "text-zinc-500"}`}>
         {activity.state === "working" ? <Loader2 className="size-4 animate-spin" /> : success ? <CheckCircle2 className="size-4" /> : <span className="size-2 rounded-full bg-red-500" />}
         {activity.message}
      </div>
   );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint: string; children: React.ReactNode }) {
   return (
      <div className="grid gap-2">
         <label htmlFor={id} className="text-sm font-semibold text-zinc-900">{label}</label>
         {children}
         <p className="text-xs leading-5 text-zinc-500">{hint}</p>
      </div>
   );
}

export function GoogleTools({ initialSettings, appUrl }: { initialSettings: GoogleToolsSettings; appUrl: string }) {
   const { toast } = useToast();
   const [settings, setSettings] = React.useState(initialSettings);
   const [spreadsheetUrl, setSpreadsheetUrl] = React.useState(initialSettings.values.googleSpreadsheetUrl || "");
   const [appsScriptUrl, setAppsScriptUrl] = React.useState(initialSettings.values.googleAppsScriptUrl || "");
   const [integrationSecret, setIntegrationSecret] = React.useState("");
   const [save, setSave] = React.useState<Activity>({ state: "idle" });
   const [test, setTest] = React.useState<Activity>({ state: "idle" });
   const [sync, setSync] = React.useState<Activity>({ state: "idle" });
   const [copied, setCopied] = React.useState(false);

   const isConfigured = Boolean(
      spreadsheetUrl && appsScriptUrl && (integrationSecret || settings.secrets.googleIntegrationSecret.configured),
   );
   const webhookUrl = `${appUrl}/api/integrations/google/webhook`;

   async function saveConfiguration() {
      setSave({ state: "working", message: "Saving secure connection…" });
      try {
         const response = await fetch("/api/commerce/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               values: { googleSpreadsheetUrl: spreadsheetUrl, googleAppsScriptUrl: appsScriptUrl },
               secrets: { googleIntegrationSecret: integrationSecret },
            }),
         });
         const payload = await response.json();
         if (!response.ok) throw new Error(payload.error || "Connection could not be saved");
         setSettings(payload.settings);
         setIntegrationSecret("");
         setSave({ state: "success", message: "Connection saved securely" });
         toast({ title: "Google tools saved", description: "The connection is ready to test.", variant: "success" });
      } catch (error) {
         setSave({ state: "error", message: error instanceof Error ? error.message : "Connection could not be saved" });
      }
   }

   async function testConnection() {
      setTest({ state: "working", message: "Checking Apps Script…" });
      try {
         const response = await fetch("/api/commerce/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider: "google", credentials: { appsScriptUrl, integrationSecret } }),
         });
         const payload = await response.json();
         if (!response.ok) throw new Error(payload.error || "Connection test failed");
         setTest({ state: "success", message: payload.message });
      } catch (error) {
         setTest({ state: "error", message: error instanceof Error ? error.message : "Connection test failed" });
      }
   }

   async function syncNow() {
      setSync({ state: "working", message: "Sending commerce data to Sheets…" });
      try {
         const response = await fetch("/api/commerce/google/sync", { method: "POST" });
         const payload = await response.json();
         if (!response.ok) throw new Error(payload.error || "Sync failed");
         const message = `${payload.counts.products} products, ${payload.counts.orders} orders and ${payload.counts.payments} payments synced`;
         setSync({ state: "success", message });
         toast({ title: "Google Sheets is up to date", description: message, variant: "success" });
      } catch (error) {
         setSync({ state: "error", message: error instanceof Error ? error.message : "Sync failed" });
      }
   }

   async function copyWebhook() {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
   }

   function generateSecret() {
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const value = btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
      setIntegrationSecret(value);
      setSave({ state: "idle" });
   }

   return (
      <form
         className="min-w-0 space-y-6"
         onSubmit={(event) => {
            event.preventDefault();
            void saveConfiguration();
         }}>
         <section className="relative min-w-0 overflow-hidden rounded-[28px] bg-[#073f36] px-6 py-8 text-white shadow-[0_24px_70px_rgba(7,63,54,.24)] sm:px-9 sm:py-10">
            <div className="absolute -right-16 -top-24 size-72 rounded-full bg-[#b7f34a]/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
               <div>
                  <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                     <Cloud className="size-6 text-[#c7f36a]" />
                  </div>
                  <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Run commerce operations from tools your team already knows.</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/70 sm:text-base">Keep the dashboard as the source of truth while staff use Google Sheets for reporting and Google Forms for structured product entry.</p>
               </div>
               <div className="border-l border-white/15 pl-6">
                  <div className="flex items-center gap-3">
                     <span className={`grid size-9 place-items-center rounded-full ${isConfigured ? "bg-[#c7f36a] text-[#073f36]" : "bg-white/10 text-white/60"}`}>
                        {isConfigured ? <Check className="size-5" /> : <KeyRound className="size-4" />}
                     </span>
                     <div>
                        <p className="text-sm font-semibold">{isConfigured ? "Connection configured" : "Setup required"}</p>
                        <p className="mt-1 text-xs text-emerald-50/55">Encrypted credentials · manual sync control</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
               <div className="border-b border-zinc-200 bg-zinc-50/80 p-6 lg:border-b-0 lg:border-r sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Connection</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">Link one operations Sheet</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">The script creates and maintains separate Catalog, Orders and Payments tabs.</p>
                  <ol className="mt-7 space-y-5">
                     {["Create a blank Google Sheet", "Add and deploy the supplied Apps Script", "Paste both links and your shared secret"].map((step, index) => (
                        <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-700">
                           <span className="grid size-7 shrink-0 place-items-center rounded-full border border-zinc-300 bg-white text-xs font-bold">{index + 1}</span>
                           <span>{step}</span>
                        </li>
                     ))}
                  </ol>
                  <a href="/google-commerce-sync.gs" target="_blank" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600">
                     Open Apps Script template <ExternalLink className="size-4" />
                  </a>
               </div>

               <div className="min-w-0 p-6 sm:p-8">
                  <div className="grid gap-6">
                     <Field id="spreadsheetUrl" label="Google Sheet URL" hint="Paste the full URL of the Sheet that should receive commerce data.">
                        <Input id="spreadsheetUrl" type="url" value={spreadsheetUrl} onChange={(event) => setSpreadsheetUrl(event.target.value)} placeholder="https://docs.google.com/spreadsheets/d/…/edit" className="h-12 rounded-xl border-zinc-200 bg-white" />
                     </Field>
                     <Field id="appsScriptUrl" label="Apps Script web app URL" hint="Use the /exec URL created when you deploy the script as a web app.">
                        <Input id="appsScriptUrl" type="url" value={appsScriptUrl} onChange={(event) => setAppsScriptUrl(event.target.value)} placeholder="https://script.google.com/macros/s/…/exec" className="h-12 rounded-xl border-zinc-200 bg-white" />
                     </Field>
                     <Field id="integrationSecret" label="Shared integration secret" hint={settings.secrets.googleIntegrationSecret.configured ? `A secret is configured and ends in ${settings.secrets.googleIntegrationSecret.ending}. Leave blank to keep it.` : "Use a unique random value of at least 32 characters and add the same value in Apps Script."}>
                        <div className="relative">
                           <Input id="integrationSecret" type="password" autoComplete="new-password" value={integrationSecret} onChange={(event) => setIntegrationSecret(event.target.value)} placeholder={settings.secrets.googleIntegrationSecret.configured ? "Configured securely" : "Create a long random secret"} className="h-12 rounded-xl border-zinc-200 bg-white pr-24" />
                           <button type="button" onClick={generateSecret} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200">
                              Generate
                           </button>
                        </div>
                     </Field>
                  </div>
                  <div className="mt-7 flex flex-col gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                     <StatusMessage activity={save} />
                     <div className="ml-auto flex gap-3">
                        <Button type="button" variant="outline" onClick={() => void testConnection()} disabled={test.state === "working"} className="h-11 rounded-xl border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50">
                           {test.state === "working" ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Test
                        </Button>
                        <Button type="submit" disabled={save.state === "working"} className="h-11 rounded-xl bg-[#073f36] px-5 text-white hover:bg-[#052f29]">
                           {save.state === "working" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save connection
                        </Button>
                     </div>
                  </div>
                  {test.state !== "idle" ? <div className="mt-4"><StatusMessage activity={test} /></div> : null}
               </div>
            </div>
         </section>

         <section className="grid overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-8">
               <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                     <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Sheet destinations</p>
                     <h3 className="mt-3 text-xl font-semibold tracking-tight">A clean working view for every team</h3>
                  </div>
                  <Button type="button" onClick={() => void syncNow()} disabled={!isConfigured || sync.state === "working"} className="h-11 rounded-xl bg-[#c7f36a] px-5 text-[#073f36] hover:bg-[#b8e85e] disabled:bg-zinc-200 disabled:text-zinc-500">
                     {sync.state === "working" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Sync now
                  </Button>
               </div>
               <div className="mt-7 divide-y divide-zinc-100 border-y border-zinc-100">
                  {destinations.map((destination) => (
                     <div key={destination.name} className="flex items-center gap-4 py-5">
                        <span className={`grid size-11 place-items-center rounded-2xl ${destination.bg} ${destination.color}`}><destination.icon className="size-5" /></span>
                        <div className="min-w-0 flex-1">
                           <strong className="text-sm">{destination.name}</strong>
                           <p className="mt-1 text-sm text-zinc-500">{destination.detail}</p>
                        </div>
                        <ArrowRight className="size-4 text-zinc-300" />
                     </div>
                  ))}
               </div>
               {sync.state !== "idle" ? <div className="mt-5"><StatusMessage activity={sync} /></div> : null}
            </div>

            <aside className="border-t border-zinc-200 bg-[#f5f7f5] p-6 xl:border-l xl:border-t-0 sm:p-8">
               <div className="grid size-11 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><FileInput className="size-5" /></div>
               <h3 className="mt-5 text-lg font-semibold">Turn a Form into product entry</h3>
               <p className="mt-3 text-sm leading-6 text-zinc-600">Create fields named ID, Name, Subtitle, Category, Price, Stock, Available and Emoji. A form submission can update the catalog after validation.</p>
               <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-500">Secure webhook</p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 pl-3">
                     <code className="min-w-0 flex-1 truncate text-xs text-zinc-600">{webhookUrl}</code>
                     <button type="button" onClick={() => void copyWebhook()} className="grid size-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200" aria-label="Copy webhook URL">
                        {copied ? <Check className="size-4 text-emerald-700" /> : <Clipboard className="size-4" />}
                     </button>
                  </div>
               </div>
               <div className="mt-6 flex gap-3 border-t border-zinc-200 pt-5 text-xs leading-5 text-zinc-500">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-600" />
                  Invalid rows are rejected before they can change products. Repeated events are ignored safely.
               </div>
            </aside>
         </section>
      </form>
   );
}
