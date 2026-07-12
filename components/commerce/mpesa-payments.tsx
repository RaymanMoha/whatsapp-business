"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

   return (
      <div className="grid min-w-0 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
         <Card className="min-w-0 text-black dark:text-black">
            <CardHeader>
               <CardTitle>Request M-Pesa payment</CardTitle>
               <CardDescription>
                  Sends an STK Push prompt to the customer phone number.
               </CardDescription>
            </CardHeader>
            <CardContent>
               {mpesa && !mpesa.configured ? (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                     <strong className="block">M-Pesa is not configured yet.</strong>
                     <span>Missing: {mpesa.missing.join(", ")}</span>
                  </div>
               ) : null}
               <form className="space-y-4" onSubmit={startPayment}>
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
            </CardContent>
         </Card>

         <Card className="min-w-0 text-black dark:text-black">
            <CardHeader>
               <CardTitle>Payment history</CardTitle>
               <CardDescription>
                  Environment: {mpesa?.environment || "unknown"} · Shortcode: {mpesa?.shortCode || "not set"}
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               {loading ? <p className="text-sm text-zinc-500">Loading payments…</p> : null}
               {!loading && payments.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-zinc-600">
                     No payment requests yet.
                  </div>
               ) : null}
               {payments.map((payment) => (
                  <div key={payment.id} className="min-w-0 rounded-xl border p-4">
                     <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                           <strong>{payment.productName || payment.accountReference || payment.phone}</strong>
                           <p className="text-xs text-zinc-500">
                              {payment.customerName || payment.chatId || payment.phone}
                           </p>
                        </div>
                        <span
                           className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              payment.status === "Paid"
                                 ? "bg-emerald-50 text-emerald-700"
                                 : payment.status === "Failed" || payment.status === "Request failed"
                                   ? "bg-red-50 text-red-700"
                                   : "bg-amber-50 text-amber-700"
                           }`}>
                           {payment.status}
                        </span>
                     </div>
                     <p className="mt-2 break-all text-sm text-zinc-700">
                        KES {payment.amount} · {payment.phone}
                     </p>
                     <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">
                           {payment.source === "whatsapp" ? "WhatsApp order" : "Dashboard request"}
                        </span>
                        {payment.confirmationSentAt ? (
                           <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                              Customer confirmed
                           </span>
                        ) : payment.status === "Paid" && payment.chatId ? (
                           <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                              Confirmation pending
                           </span>
                        ) : null}
                     </div>
                     <p className="mt-1 text-xs text-zinc-500">{payment.responseDescription || payment.customerMessage}</p>
                     {payment.mpesaReceiptNumber ? (
                        <p className="mt-1 text-xs text-emerald-700">Receipt: {payment.mpesaReceiptNumber}</p>
                     ) : null}
                     {payment.status === "Paid" ? (
                        <div className="mt-4 flex min-w-0 flex-col items-stretch justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 sm:flex-row sm:items-center">
                           <div>
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
                                 Customer receipt
                              </p>
                              <p className="mt-1 text-xs text-emerald-950/60">
                                 {payment.receiptSharedAt
                                    ? `Shared ${new Date(payment.receiptSharedAt).toLocaleString()}`
                                    : "Ready to view, download, or send on WhatsApp"}
                              </p>
                           </div>
                           <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                              <Button asChild variant="outline" size="sm" className="w-full bg-white sm:w-auto">
                                 <a
                                    href={`/api/commerce/payments/${encodeURIComponent(payment.id)}/receipt`}
                                    target="_blank"
                                    rel="noreferrer">
                                    View receipt
                                 </a>
                              </Button>
                              <Button
                                 type="button"
                                 size="sm"
                                 className="w-full sm:w-auto"
                                 onClick={() => shareReceipt(payment)}
                                 disabled={sharingId === payment.id}>
                                 {sharingId === payment.id ? "Sharing…" : payment.receiptSharedAt ? "Share again" : "Share on WhatsApp"}
                              </Button>
                           </div>
                        </div>
                     ) : null}
                     {payment.checkoutRequestId ? (
                        <p className="mt-1 text-[11px] text-zinc-400">Checkout: {payment.checkoutRequestId}</p>
                     ) : null}
                     <p className="mt-2 text-xs text-zinc-500">
                        {payment.paidAt
                           ? `Paid at ${payment.paidAt}`
                           : payment.createdAt
                             ? new Date(payment.createdAt).toLocaleString()
                             : ""}
                     </p>
                  </div>
               ))}
            </CardContent>
         </Card>
      </div>
   );
}
