"use client";

import * as React from "react";
import {
   AlertCircle,
   BrainCircuit,
   CheckCircle2,
   Database,
   Eye,
   EyeOff,
   KeyRound,
   Loader2,
   LockKeyhole,
   MessageCircleMore,
   Save,
   ShieldCheck,
   Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type PublicValues = {
   businessName: string;
   botName: string;
   handoffMessage: string;
   groqModel: string;
   mpesaEnvironment: string;
   mpesaBusinessShortCode: string;
   mpesaPartyA: string;
   mpesaTransactionType: string;
   mpesaCallbackUrl: string;
};

type SecretName = "groqApiKey" | "mpesaConsumerKey" | "mpesaConsumerSecret" | "mpesaPassKey";

type SecretStatus = {
   configured: boolean;
   ending: string | null;
   source: string;
};

export type SettingsPayload = {
   values: PublicValues;
   secrets: Record<SecretName, SecretStatus>;
   locked: {
      mongo: boolean;
      dashboardAuth: boolean;
      waha: { configured: boolean; baseUrl: string; session: string };
   };
   updatedAt: string | null;
   updatedBy: string | null;
};

type TestState = { state: "idle" | "testing" | "success" | "error"; message?: string };

const emptySecrets: Record<SecretName, string> = {
   groqApiKey: "",
   mpesaConsumerKey: "",
   mpesaConsumerSecret: "",
   mpesaPassKey: "",
};

function FieldLabel({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: string }) {
   return (
      <label htmlFor={htmlFor} className="space-y-2">
         <span className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-900">
            {children}
            {hint ? <span className="text-xs font-normal text-zinc-400">{hint}</span> : null}
         </span>
      </label>
   );
}

function SecretField({
   id,
   label,
   value,
   status,
   onChange,
}: {
   id: SecretName;
   label: string;
   value: string;
   status: SecretStatus;
   onChange: (value: string) => void;
}) {
   const [visible, setVisible] = React.useState(false);
   const placeholder = status.configured
      ? `Configured${status.ending ? ` · ends ${status.ending}` : ""}`
      : "Paste credential";

   return (
      <div className="space-y-2">
         <FieldLabel htmlFor={id} hint={status.configured ? status.source : "required"}>
            {label}
         </FieldLabel>
         <div className="relative">
            <Input
               id={id}
               type={visible ? "text" : "password"}
               autoComplete="off"
               value={value}
               placeholder={placeholder}
               onChange={(event) => onChange(event.target.value)}
               className="h-11 rounded-xl border-zinc-200 bg-white pr-11"
            />
            <button
               type="button"
               onClick={() => setVisible((current) => !current)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-800"
               aria-label={visible ? `Hide ${label}` : `Show ${label}`}>
               {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
         </div>
         <p className="text-xs leading-5 text-zinc-500">
            {value ? "A new value will replace the configured credential when saved." : "The current value is never sent to your browser."}
         </p>
      </div>
   );
}

function ProviderStatus({ test }: { test: TestState }) {
   if (test.state === "idle") return null;
   const success = test.state === "success";
   return (
      <div role="status" aria-live="polite" className={`flex items-center gap-2 text-xs font-medium ${success ? "text-emerald-700" : test.state === "error" ? "text-red-600" : "text-zinc-500"}`}>
         {test.state === "testing" ? <Loader2 className="size-3.5 animate-spin" /> : success ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
         <span>{test.state === "testing" ? "Testing connection…" : test.message}</span>
      </div>
   );
}

export function IntegrationSettings({ initialSettings }: { initialSettings: SettingsPayload }) {
   const { toast } = useToast();
   const [settings, setSettings] = React.useState(initialSettings);
   const [values, setValues] = React.useState(initialSettings.values);
   const [secrets, setSecrets] = React.useState(emptySecrets);
   const [saving, setSaving] = React.useState(false);
   const [tests, setTests] = React.useState<Record<string, TestState>>({
      groq: { state: "idle" },
      waha: { state: "idle" },
      mpesa: { state: "idle" },
   });

   function updateValue<K extends keyof PublicValues>(key: K, value: PublicValues[K]) {
      setValues((current) => ({ ...current, [key]: value }));
   }

   function updateSecret(key: SecretName, value: string) {
      setSecrets((current) => ({ ...current, [key]: value }));
   }

   async function saveSettings() {
      setSaving(true);
      try {
         const response = await fetch("/api/commerce/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values, secrets }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Settings could not be saved");
         setSettings(data.settings);
         setValues(data.settings.values);
         setSecrets(emptySecrets);
         toast({ title: "Settings saved", description: "The bot will refresh them automatically within a few seconds.", variant: "success" });
      } catch (error) {
         toast({ title: "Could not save settings", description: error instanceof Error ? error.message : "Try again.", variant: "error" });
      } finally {
         setSaving(false);
      }
   }

   async function testConnection(provider: "groq" | "waha" | "mpesa") {
      setTests((current) => ({ ...current, [provider]: { state: "testing" } }));
      const credentials = provider === "groq"
         ? { apiKey: secrets.groqApiKey }
         : provider === "mpesa"
           ? {
                consumerKey: secrets.mpesaConsumerKey,
                consumerSecret: secrets.mpesaConsumerSecret,
                environment: values.mpesaEnvironment,
             }
           : {};
      try {
         const response = await fetch("/api/commerce/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider, credentials }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Connection test failed");
         setTests((current) => ({ ...current, [provider]: { state: "success", message: data.message } }));
      } catch (error) {
         setTests((current) => ({
            ...current,
            [provider]: { state: "error", message: error instanceof Error ? error.message : "Connection test failed" },
         }));
      }
   }

   return (
      <form
         onSubmit={(event) => {
            event.preventDefault();
            void saveSettings();
         }}
         className="overflow-hidden rounded-[28px] border border-white/60 bg-white text-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
         <div className="relative overflow-hidden bg-[#072f2a] px-6 py-7 text-white sm:px-8">
            <div className="absolute -right-16 -top-24 size-64 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
               <div className="flex max-w-2xl items-start gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-300 text-[#073b34]">
                     <ShieldCheck className="size-5" strokeWidth={2.2} />
                  </div>
                  <div>
                     <h2 className="text-xl font-semibold tracking-tight">Secure configuration center</h2>
                     <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/70">
                        Update provider credentials without exposing stored values. Secrets are encrypted before MongoDB storage and never returned to this page.
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  {settings.updatedAt ? (
                     <p className="text-xs text-emerald-50/55">Last saved {new Date(settings.updatedAt).toLocaleString()}</p>
                  ) : null}
                  <Button type="submit" disabled={saving} className="h-11 rounded-xl bg-emerald-300 px-5 text-[#073b34] hover:bg-emerald-200">
                     {saving ? <Loader2 className="animate-spin" /> : <Save />}
                     {saving ? "Encrypting…" : "Save changes"}
                  </Button>
               </div>
            </div>
         </div>

         <div className="divide-y divide-zinc-100">
            <section className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
               <div>
                  <div className="flex items-center gap-3">
                     <BrainCircuit className="size-5 text-violet-600" />
                     <h3 className="font-semibold">AI replies</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">Groq generates product-aware answers using your approved store information.</p>
                  <div className="mt-4 space-y-2">
                     <Button type="button" variant="outline" size="sm" className="rounded-lg border-[#0b5b50] bg-[#0b5b50] text-white hover:bg-[#08483f] hover:text-white" onClick={() => testConnection("groq")} disabled={tests.groq.state === "testing"}>
                        Test Groq
                     </Button>
                     <ProviderStatus test={tests.groq} />
                  </div>
               </div>
               <div className="grid gap-5 md:grid-cols-2">
                  <SecretField id="groqApiKey" label="Groq API key" value={secrets.groqApiKey} status={settings.secrets.groqApiKey} onChange={(value) => updateSecret("groqApiKey", value)} />
                  <div className="space-y-2">
                     <FieldLabel htmlFor="groqModel">Model</FieldLabel>
                     <Input id="groqModel" value={values.groqModel} onChange={(event) => updateValue("groqModel", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                     <p className="text-xs leading-5 text-zinc-500">Used by WhatsApp replies and the dashboard assistant.</p>
                  </div>
               </div>
            </section>

            <section className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
               <div>
                  <div className="flex items-center gap-3">
                     <Smartphone className="size-5 text-emerald-600" />
                     <h3 className="font-semibold">M-Pesa collections</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">Credentials used for checkout, combined-cart STK Push and payment confirmation.</p>
                  <div className="mt-4 space-y-2">
                     <Button type="button" variant="outline" size="sm" className="rounded-lg border-[#0b5b50] bg-[#0b5b50] text-white hover:bg-[#08483f] hover:text-white" onClick={() => testConnection("mpesa")} disabled={tests.mpesa.state === "testing"}>
                        Test M-Pesa
                     </Button>
                     <ProviderStatus test={tests.mpesa} />
                  </div>
               </div>
               <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                     <FieldLabel htmlFor="mpesaEnvironment">Environment</FieldLabel>
                     <select id="mpesaEnvironment" value={values.mpesaEnvironment} onChange={(event) => updateValue("mpesaEnvironment", event.target.value)} className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100">
                        <option value="sandbox">Sandbox</option>
                        <option value="production">Production</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <FieldLabel htmlFor="mpesaBusinessShortCode">Business shortcode</FieldLabel>
                     <Input id="mpesaBusinessShortCode" value={values.mpesaBusinessShortCode} onChange={(event) => updateValue("mpesaBusinessShortCode", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
                  <SecretField id="mpesaConsumerKey" label="Consumer key" value={secrets.mpesaConsumerKey} status={settings.secrets.mpesaConsumerKey} onChange={(value) => updateSecret("mpesaConsumerKey", value)} />
                  <SecretField id="mpesaConsumerSecret" label="Consumer secret" value={secrets.mpesaConsumerSecret} status={settings.secrets.mpesaConsumerSecret} onChange={(value) => updateSecret("mpesaConsumerSecret", value)} />
                  <SecretField id="mpesaPassKey" label="STK passkey" value={secrets.mpesaPassKey} status={settings.secrets.mpesaPassKey} onChange={(value) => updateSecret("mpesaPassKey", value)} />
                  <div className="space-y-2">
                     <FieldLabel htmlFor="mpesaPartyA">Party A</FieldLabel>
                     <Input id="mpesaPartyA" value={values.mpesaPartyA} onChange={(event) => updateValue("mpesaPartyA", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <FieldLabel htmlFor="mpesaTransactionType">Transaction type</FieldLabel>
                     <Input id="mpesaTransactionType" value={values.mpesaTransactionType} onChange={(event) => updateValue("mpesaTransactionType", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <FieldLabel htmlFor="mpesaCallbackUrl" hint="HTTPS required">Callback URL</FieldLabel>
                     <Input id="mpesaCallbackUrl" value={values.mpesaCallbackUrl} onChange={(event) => updateValue("mpesaCallbackUrl", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
               </div>
            </section>

            <section className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
               <div>
                  <div className="flex items-center gap-3">
                     <MessageCircleMore className="size-5 text-sky-600" />
                     <h3 className="font-semibold">Assistant identity</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">Customer-facing names and the safe fallback used when approved information is missing.</p>
               </div>
               <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                     <FieldLabel htmlFor="businessName">Business name</FieldLabel>
                     <Input id="businessName" value={values.businessName} onChange={(event) => updateValue("businessName", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
                  <div className="space-y-2">
                     <FieldLabel htmlFor="botName">Assistant name</FieldLabel>
                     <Input id="botName" value={values.botName} onChange={(event) => updateValue("botName", event.target.value)} className="h-11 rounded-xl border-zinc-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <FieldLabel htmlFor="handoffMessage">Human handoff message</FieldLabel>
                     <Textarea id="handoffMessage" value={values.handoffMessage} onChange={(event) => updateValue("handoffMessage", event.target.value)} className="min-h-24 rounded-xl border-zinc-200" />
                  </div>
               </div>
            </section>

            <section className="bg-zinc-50 px-6 py-7 sm:px-8">
               <div className="flex items-start gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-700">
                     <LockKeyhole className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                     <h3 className="font-semibold">Locked infrastructure settings</h3>
                     <p className="mt-1 text-sm leading-6 text-zinc-500">These remain environment-managed so the dashboard cannot remove its own database, authentication or WhatsApp access.</p>
                     <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm"><Database className="size-4 text-zinc-500" /><span>MongoDB {settings.locked.mongo ? "configured" : "missing"}</span></div>
                        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm"><KeyRound className="size-4 text-zinc-500" /><span>Dashboard auth {settings.locked.dashboardAuth ? "secured" : "missing"}</span></div>
                        <button type="button" onClick={() => testConnection("waha")} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm transition hover:border-zinc-400">
                           <span className="flex items-center gap-3"><MessageCircleMore className="size-4 text-zinc-500" />WAHA {settings.locked.waha.session}</span>
                           {tests.waha.state === "testing" ? <Loader2 className="size-4 animate-spin" /> : <span className="text-xs text-zinc-400">Test</span>}
                        </button>
                     </div>
                     {tests.waha.state !== "idle" ? <div className="mt-3"><ProviderStatus test={tests.waha} /></div> : null}
                  </div>
               </div>
            </section>
         </div>
      </form>
   );
}
