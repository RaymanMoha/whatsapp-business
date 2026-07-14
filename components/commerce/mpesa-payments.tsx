"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check, ChevronRight, Clock3, CreditCard, Download, MessageCircleMore, PhoneCall, RefreshCw, Search, Send, Share2 } from "lucide-react";

type Payment = {
   id: string;
   phone: string;
   amount: number;
   accountReference: string;
   description: string;
   status: string;
   chatId?: string | null;
   customerName?: string | null;
   productId?: string | null;
   productName?: string | null;
   lineItems?: Array<{
      productId?: string;
      name: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
   }>;
   itemCount?: number;
   source?: string | null;
   customerMessage?: string;
   responseDescription?: string;
   mpesaReceiptNumber?: string;
   checkoutRequestId?: string;
   confirmationSentAt?: string | null;
   receiptId?: string | null;
   receiptCreatedAt?: string | null;
   receiptSharedAt?: string | null;
   paidAt?: string | null;
   createdAt: string;
};

type MpesaStatus = {
   configured: boolean;
   missing: string[];
   environment: string;
   shortCode?: string | null;
   callbackUrl?: string | null;
};

export function MpesaPayments({
   initialMpesa = null,
   initialPayments = [],
}: {
   initialMpesa?: MpesaStatus | null;
   initialPayments?: Payment[];
}) {
   const [payments, setPayments] = React.useState<Payment[]>(initialPayments);
   const [mpesa, setMpesa] = React.useState<MpesaStatus | null>(initialMpesa);
   const [loading, setLoading] = React.useState(!initialMpesa);
   const [submitting, setSubmitting] = React.useState(false);
   const [sharingId, setSharingId] = React.useState<string | null>(null);
   const [notice, setNotice] = React.useState("");
   const [query, setQuery] = React.useState("");
   const [filter, setFilter] = React.useState<"all" | "pending" | "paid" | "failed">("all");
   const [selectedId, setSelectedId] = React.useState(initialPayments[0]?.id || "");
   const [requestOpen, setRequestOpen] = React.useState(false);
   const [form, setForm] = React.useState({
      phone: "",
      amount: "1",
      accountReference: "WhatsAppOrder",
      description: "WhatsApp order payment",
   });

   async function loadPayments() {
      const response = await fetch("/api/commerce/payments", { cache: "no-store" });
      const data = await response.json();
      setMpesa(data.mpesa);
      setPayments(Array.isArray(data.payments) ? data.payments : []);
      setSelectedId((current) => current || data.payments?.[0]?.id || "");
      setLoading(false);
   }

   async function startPayment(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSubmitting(true);
      setNotice("");

      try {
         const response = await fetch("/api/commerce/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               ...form,
               amount: Number(form.amount),
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Payment could not be started");
         setNotice(data.payment.customerMessage || "STK push sent. Ask the customer to enter their M-Pesa PIN.");
         await loadPayments();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Payment could not be started");
      } finally {
         setSubmitting(false);
      }
   }

   async function shareReceipt(payment: Payment) {
      setSharingId(payment.id);
      setNotice("");
      try {
         const response = await fetch(`/api/commerce/payments/${encodeURIComponent(payment.id)}/receipt`, {
            method: "POST",
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Receipt could not be shared");
         setPayments((current) =>
            current.map((item) =>
               item.id === payment.id ? { ...item, receiptSharedAt: data.receipt.sharedAt } : item,
            ),
         );
         setNotice(`Receipt shared with ${payment.customerName || payment.phone} on WhatsApp.`);
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Receipt could not be shared");
      } finally {
         setSharingId(null);
      }
   }

   React.useEffect(() => {
      if (initialMpesa) return;
      loadPayments().catch(() => {
         setLoading(false);
         setNotice("Payments could not load.");
      });
   }, [initialMpesa]);

   const filtered = payments.filter((payment) => {
      const status = payment.status.toLowerCase();
      const matchesFilter = filter === "all" || (filter === "paid" ? status === "paid" : filter === "failed" ? status.includes("fail") : status !== "paid" && !status.includes("fail"));
      const matchesQuery = `${payment.customerName || ""} ${payment.phone} ${payment.accountReference} ${payment.mpesaReceiptNumber || ""}`.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
   });
   const selected = payments.find((payment) => payment.id === selectedId) || filtered[0];
   const counts = { paid: payments.filter((item) => item.status === "Paid").length, failed: payments.filter((item) => item.status.toLowerCase().includes("fail")).length };

   function progressFor(payment: Payment) {
      const failed = payment.status.toLowerCase().includes("fail");
      const paid = payment.status === "Paid";
      return [
         { label: "Payment requested", detail: "Payment request created for this customer.", done: true, icon: CreditCard },
         { label: "Phone prompt sent", detail: payment.customerMessage || "STK Push sent to the customer phone.", done: !failed, icon: PhoneCall },
         { label: failed ? "Payment failed" : "Payment confirmed", detail: failed ? (payment.responseDescription || "The customer did not complete payment.") : "M-Pesa callback received and verified.", done: paid || failed, failed, icon: failed ? AlertCircle : Check },
         { label: "Receipt shared", detail: payment.receiptSharedAt ? `Shared ${new Date(payment.receiptSharedAt).toLocaleString()}` : "Ready after payment is confirmed.", done: Boolean(payment.receiptSharedAt), icon: Share2 },
      ];
   }

   return (
      <section className="overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(0,63,55,.08)]">
         <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 sm:px-6">
            <div><h2 className="font-semibold">Transaction command center</h2><p className="mt-1 text-sm text-zinc-500">Follow every request from phone prompt to verified receipt.</p></div>
            <div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void loadPayments()} className="!bg-white !text-zinc-900 hover:!bg-zinc-50"><RefreshCw className="size-4" /> Refresh</Button><Button type="button" size="sm" onClick={() => setRequestOpen((value) => !value)}><Send className="size-4" /> Request payment</Button></div>
         </div>
         {requestOpen ? <div className="border-b border-zinc-200 bg-emerald-50/50 p-5 sm:p-6">
            <div className="mx-auto max-w-5xl">
               {mpesa && !mpesa.configured ? (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                     <strong className="block">M-Pesa is not configured yet.</strong>
                     <span>Missing: {mpesa.missing.join(", ")}</span>
                  </div>
               ) : null}
               <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_.7fr_1fr_1.5fr_auto] xl:items-end" onSubmit={startPayment}>
                  <label className="space-y-2 text-sm font-medium">
                     Customer phone
                     <Input
                        value={form.phone}
                        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="2547XXXXXXXX"
                     />
                  </label>
                  <label className="space-y-2 text-sm font-medium">
                     Amount
                     <Input
                        type="number"
                        min="1"
                        value={form.amount}
                        onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                     />
                  </label>
                  <label className="space-y-2 text-sm font-medium">
                     Account reference
                     <Input
                        value={form.accountReference}
                        onChange={(event) =>
                           setForm((prev) => ({ ...prev, accountReference: event.target.value }))
                        }
                        maxLength={12}
                     />
                  </label>
                  <label className="space-y-2 text-sm font-medium">
                     Description
                     <Input
                        value={form.description}
                        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                     />
                  </label>
                  {notice ? <p className="rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{notice}</p> : null}
                  <Button type="submit" disabled={submitting || !mpesa?.configured}>
                     {submitting ? "Sending STK…" : "Send STK push"}
                  </Button>
               </form>
            </div>
         </div> : null}
         {notice ? <p role="status" className="border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-sm text-zinc-700">{notice}</p> : null}
         <div className="grid min-h-[620px] xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r"><div className="border-b border-zinc-200 p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions…" className="h-11 bg-white pl-9" /></div><div className="mt-3 grid grid-cols-4 text-[11px] font-medium text-zinc-500">{([['all', `All ${payments.length}`], ['pending', `Pending ${payments.length-counts.paid-counts.failed}`], ['paid', `Paid ${counts.paid}`], ['failed', `Failed ${counts.failed}`]] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border-b-2 px-1 py-2.5 ${filter === value ? 'border-emerald-700 text-emerald-800' : 'border-transparent'}`}>{label}</button>)}</div></div>{loading ? <p className="p-5 text-sm text-zinc-500">Loading payments…</p> : null}{!loading && !filtered.length ? <p className="p-6 text-sm text-zinc-500">No payments match this view.</p> : null}<div className="max-h-[520px] overflow-y-auto">{filtered.map((payment) => { const failed = payment.status.toLowerCase().includes('fail'); return <button key={payment.id} type="button" onClick={() => setSelectedId(payment.id)} className={`flex w-full items-center gap-3 border-b border-zinc-100 border-l-4 px-4 py-4 text-left ${selected?.id === payment.id ? 'border-l-emerald-700 bg-emerald-50/80' : 'border-l-transparent hover:bg-white'}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full ${failed ? 'bg-red-50 text-red-700' : payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>{failed ? <AlertCircle className="size-4" /> : payment.status === 'Paid' ? <Check className="size-4" /> : <Clock3 className="size-4" />}</span><span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><strong className="truncate text-sm">{payment.customerName || payment.phone}</strong><strong className="shrink-0 text-sm">KES {payment.amount}</strong></span><span className="mt-1 flex justify-between gap-2 text-[11px] text-zinc-400"><span>{payment.accountReference}</span><span className={failed ? 'text-red-600' : payment.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{payment.status}</span></span></span><ChevronRight className="size-4 text-zinc-400" /></button>})}</div></aside>
            {selected ? <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_320px]"><main className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r sm:p-8"><div className="flex flex-wrap justify-between gap-4 border-b border-zinc-100 pb-5"><div><p className="text-xs text-zinc-400">Payment ID</p><h2 className="mt-1 text-xl font-semibold">{selected.accountReference}</h2><p className="mt-1 text-xs text-zinc-500">{selected.customerName || selected.phone}</p></div><div className="text-right"><p className="text-xs text-zinc-400">Total</p><strong className="mt-1 block text-xl text-emerald-800">KES {selected.amount}</strong></div></div><div className="py-8">{progressFor(selected).map((step, index, steps) => <div key={step.label} className="relative flex gap-4 pb-9 last:pb-0">{index < steps.length-1 ? <span className={`absolute left-[19px] top-10 h-[calc(100%-20px)] w-px ${step.done ? 'bg-emerald-600' : 'bg-zinc-200'}`} /> : null}<span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ${step.failed ? 'bg-red-600 text-white' : step.done ? 'bg-emerald-700 text-white' : 'border border-zinc-200 bg-white text-zinc-400'}`}><step.icon className="size-4" /></span><div className="pt-1"><strong className="text-sm">{step.label}</strong><p className="mt-1 text-sm leading-6 text-zinc-500">{step.detail}</p></div></div>)}</div></main><aside className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Payment details</p><dl className="mt-4 divide-y divide-zinc-100 text-sm">{[['Phone', selected.phone], ['Channel', selected.source === 'whatsapp' ? 'WhatsApp' : 'Dashboard'], ['Receipt', selected.mpesaReceiptNumber || 'Not issued'], ['Created', new Date(selected.createdAt).toLocaleString()]].map(([label,value]) => <div key={label} className="flex justify-between gap-4 py-3"><dt className="text-zinc-400">{label}</dt><dd className="break-all text-right font-medium">{value}</dd></div>)}</dl>{selected.lineItems?.length ? <div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">Items</p>{selected.lineItems.map((item) => <div key={item.productId || item.name} className="flex justify-between gap-3 py-3 text-sm"><span>{item.quantity} × {item.name}</span><strong>KES {item.lineTotal}</strong></div>)}</div> : null}{selected.status === 'Paid' ? <div className="mt-6 grid gap-2"><Button asChild variant="outline" className="!bg-white !text-zinc-900 hover:!bg-zinc-50"><a href={`/api/commerce/payments/${encodeURIComponent(selected.id)}/receipt`} target="_blank" rel="noreferrer"><Download className="size-4" /> View receipt</a></Button><Button type="button" className="!bg-[#073f36] !text-white hover:!bg-[#052f29]" onClick={() => void shareReceipt(selected)} disabled={sharingId === selected.id}><MessageCircleMore className="size-4" />{sharingId === selected.id ? 'Sharing…' : selected.receiptSharedAt ? 'Share again' : 'Share on WhatsApp'}</Button></div> : null}</aside></div> : <div className="grid place-items-center p-10 text-sm text-zinc-500">Select a payment to inspect its progress.</div>}
         </div>
      </section>
   );
}
