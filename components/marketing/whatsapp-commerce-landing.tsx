"use client";

import Image from "next/image";
import Link from "next/link";
import {
   ArrowRight,
   Sparkles,
   Zap,
} from "lucide-react";
import AuthCommerceImage from "@/public/auth-commerce-ai.webp";

const commerceTicker = [
   "Product pictures",
   "WhatsApp replies",
   "M-Pesa STK push",
   "Customer inbox",
   "AI catalog assistant",
   "Payment records",
   "Live orders",
   "Approved knowledge",
];

const steps = [
   {
      num: "01",
      title: "Load your catalog",
      desc: "Add product names, prices, stock, descriptions, and pictures. The AI only uses approved store data when replying.",
      tag: "Catalog",
   },
   {
      num: "02",
      title: "Customers chat on WhatsApp",
      desc: "The commerce engine receives the message, drafts an approved reply, and shows the customer products, availability, and next steps in chat.",
      tag: "WhatsApp",
   },
   {
      num: "03",
      title: "Payments start from chat",
      desc: "When a customer wants to pay, the bot collects the right phone number and starts an M-Pesa STK push for the selected product.",
      tag: "M-Pesa",
   },
   {
      num: "04",
      title: "Dashboard stays in sync",
      desc: "Orders, customers, questions, catalog media, and payment confirmations are visible from one operating dashboard.",
      tag: "Operations",
   },
];

const productVisuals = [
   {
      name: "California Set",
      price: "KES 1,500",
      stock: "8 in stock",
      status: "Available",
   },
   {
      name: "Mini Pathos",
      price: "KES 900",
      stock: "3 left",
      status: "Low stock",
   },
   {
      name: "Lavender Candle",
      price: "KES 249",
      stock: "Ready",
      status: "Available",
   },
];

const workbenchRows = [
   ["Amina N.", "Mini Pathos", "Asked for pictures", "AI handled", "Now"],
   ["Kevin M.", "California Set", "Payment pending", "STK sent", "2m"],
   ["Njeri S.", "Green Tea", "Needs human reply", "Review", "8m"],
];

const journey = [
   ["Message received", "Customer asks what is available today."],
   ["Catalog matched", "AI pulls only products with price, stock, and approved description."],
   ["Product shown", "Pictures and short buying options are sent back in WhatsApp."],
   ["Payment started", "M-Pesa STK push is initiated and the record is saved."],
   ["Follow-up ready", "Dashboard shows the customer, product, receipt, and next action."],
];

function ContourBackground() {
   return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
         <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full">
            <defs>
               <style>{`
                  @keyframes wc-wave-a{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
                  @keyframes wc-wave-b{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}
                  @keyframes wc-drift{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-900}}
                  .wc-contour-a{fill:none;stroke:#0f6b4f;stroke-width:1.1;stroke-dasharray:8 6;animation:wc-drift 20s linear infinite;}
                  .wc-contour-b{fill:none;stroke:#22c77e;stroke-width:.75;stroke-dasharray:5 9;animation:wc-drift 26s linear infinite reverse;}
               `}</style>
            </defs>
            <g style={{ animation: "wc-wave-a 9s ease-in-out infinite", transformOrigin: "720px 180px" }}>
               <path className="wc-contour-a" d="M-200,70 Q200,10 450,110 T890,55 T1290,100 T1700,60" opacity="0.28" />
               <path className="wc-contour-a" d="M-200,115 Q250,45 490,155 T940,85 T1340,140 T1700,105" opacity="0.22" />
               <path className="wc-contour-a" d="M-200,160 Q300,85 530,200 T990,125 T1390,175 T1700,148" opacity="0.17" />
               <path className="wc-contour-b" d="M-200,250 Q360,168 605,280 T1065,198 T1462,244 T1700,225" opacity="0.12" />
            </g>
            <g style={{ animation: "wc-wave-b 12s ease-in-out infinite 1.5s", transformOrigin: "720px 460px" }}>
               <path className="wc-contour-b" d="M-200,345 Q175,280 415,375 T855,308 T1258,355 T1700,318" opacity="0.24" />
               <path className="wc-contour-a" d="M-200,395 Q218,318 462,418 T905,342 T1308,385 T1700,355" opacity="0.18" />
               <path className="wc-contour-a" d="M-200,445 Q258,368 505,460 T952,378 T1355,422 T1700,398" opacity="0.13" />
               <path className="wc-contour-b" d="M-200,545 Q318,452 578,548 T1040,455 T1440,500 T1700,480" opacity="0.09" />
            </g>
            <g style={{ animation: "wc-wave-a 14s ease-in-out infinite 3s", transformOrigin: "720px 730px" }}>
               <path className="wc-contour-a" d="M-200,628 Q148,562 378,648 T828,588 T1238,628 T1700,594" opacity="0.22" />
               <path className="wc-contour-b" d="M-200,672 Q188,604 425,692 T878,625 T1285,665 T1700,634" opacity="0.17" />
               <path className="wc-contour-a" d="M-200,718 Q228,648 472,742 T928,661 T1334,708 T1700,675" opacity="0.12" />
            </g>
         </svg>
      </div>
   );
}

function LogoMark({ size = 40 }: { size?: number }) {
   return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
         <rect width="40" height="40" rx="12" fill="url(#wc-logo-gradient)" />
         <path d="M11 25c4-4 13-4 18 0" stroke="rgba(255,255,255,.86)" strokeWidth="2.4" strokeLinecap="round" />
         <path d="M20 25V13" stroke="rgba(255,255,255,.92)" strokeWidth="2.4" strokeLinecap="round" />
         <path d="M20 17c4-4 8-4 10-7-1 5-5 8-10 7Z" fill="rgba(255,255,255,.92)" />
         <path d="M20 21c-4-3-7-2-9-5 3 1 6 2 9 5Z" fill="rgba(255,255,255,.72)" />
         <circle cx="12" cy="29" r="1.25" fill="rgba(255,255,255,.45)" />
         <circle cx="20" cy="31" r="1.25" fill="rgba(255,255,255,.45)" />
         <circle cx="28" cy="29" r="1.25" fill="rgba(255,255,255,.45)" />
         <defs>
            <linearGradient id="wc-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
               <stop stopColor="#0f6b4f" />
               <stop offset="1" stopColor="#22c77e" />
            </linearGradient>
         </defs>
      </svg>
   );
}

function MerchantOperatingDesk() {
   return (
      <div className="relative">
         <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-emerald-400/10 via-transparent to-black/5 blur-2xl" />
         <div className="relative overflow-hidden rounded-[38px] border border-black/[0.07] bg-[#fbfbf8] shadow-[0_30px_100px_rgba(0,0,0,.12)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_.95fr]">
               <div className="border-b border-black/[0.06] p-5 lg:border-b-0 lg:border-r">
                  <div className="mb-5 flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Commerce desk</p>
                        <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Today&apos;s conversations</h3>
                     </div>
                     <div className="rounded-full bg-[#0a0a0a] px-4 py-2 text-xs font-bold text-white">12 active</div>
                  </div>
                  <div className="space-y-2">
                     {workbenchRows.map(([name, product, intent, status, time], index) => (
                        <div
                           key={name}
                           className={`grid grid-cols-[1fr_auto] gap-3 rounded-3xl p-4 transition ${index === 1 ? "bg-[#0f1411] text-white shadow-[0_14px_40px_rgba(0,0,0,.16)]" : "bg-white text-black"}`}>
                           <div>
                              <div className="flex items-center gap-3">
                                 <span className={`grid size-10 place-items-center rounded-2xl text-sm font-bold ${index === 1 ? "bg-emerald-300 text-emerald-950" : "bg-emerald-50 text-emerald-800"}`}>
                                    {name.split(" ").map((part) => part[0]).join("")}
                                 </span>
                                 <div>
                                    <p className="text-sm font-bold">{name}</p>
                                    <p className={`text-xs ${index === 1 ? "text-white/55" : "text-black/45"}`}>{product}</p>
                                 </div>
                              </div>
                              <p className={`mt-3 text-sm ${index === 1 ? "text-white/78" : "text-black/58"}`}>{intent}</p>
                           </div>
                           <div className="text-right">
                              <p className={`text-xs font-bold ${index === 1 ? "text-emerald-300" : "text-emerald-800"}`}>{status}</p>
                              <p className={`mt-1 text-xs ${index === 1 ? "text-white/35" : "text-black/35"}`}>{time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="p-5">
                  <div className="relative mb-5 overflow-hidden rounded-[30px] bg-[#0f1411] p-4 text-white">
                     <Image
                        src={AuthCommerceImage}
                        alt="AI-assisted WhatsApp product conversation"
                        className="absolute inset-0 h-full w-full object-cover opacity-45"
                        sizes="(max-width: 1024px) 100vw, 520px"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0f1411] via-[#0f1411]/35 to-transparent" />
                     <div className="relative min-h-[210px] content-end">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Customer-facing</p>
                        <h3 className="mt-2 max-w-xs text-3xl font-semibold leading-tight tracking-[-0.05em]">
                           Product pictures are part of the answer.
                        </h3>
                     </div>
                  </div>
                  <div className="overflow-hidden rounded-[26px] border border-black/[0.07] bg-white">
                     <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-black/[0.06] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                        <span>Catalogue</span>
                        <span>Stock</span>
                        <span>Price</span>
                     </div>
                     {productVisuals.map((product) => (
                        <div key={product.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-black/[0.06] px-4 py-4 last:border-b-0">
                           <div>
                              <p className="text-sm font-bold tracking-[-0.02em]">{product.name}</p>
                              <p className="mt-0.5 text-[11px] font-semibold text-emerald-800">{product.status}</p>
                           </div>
                           <p className="text-xs text-black/45">{product.stock}</p>
                           <p className="text-sm font-bold tabular-nums text-black">{product.price}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function PaymentJourney() {
   return (
      <div className="relative rounded-[38px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_90px_rgba(0,0,0,.22)]">
         <div className="rounded-[30px] bg-[#f5f1e8] p-4 text-black">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
               <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Live order path</p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.04em]">Kevin · California Set</p>
               </div>
               <div className="rounded-full bg-[#DCF8C6] px-4 py-2 text-xs font-bold text-emerald-900">STK sent</div>
            </div>
            <div className="relative mt-5 space-y-0">
               <div className="absolute bottom-6 left-[17px] top-6 w-px bg-emerald-900/15" />
               {journey.map(([title, desc], index) => (
                  <div key={title} className="relative grid grid-cols-[36px_1fr] gap-4 pb-5 last:pb-0">
                     <div className={`relative z-10 grid size-9 place-items-center rounded-full border ${index < 4 ? "border-emerald-700 bg-emerald-700 text-white" : "border-black/15 bg-white text-black/45"}`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                     </div>
                     <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-sm font-bold tracking-[-0.02em]">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-black/55">{desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export function WhatsappCommerceLanding() {
   return (
      <main className="min-h-screen overflow-hidden bg-[#fcfcfa] text-[#0a0a0a]">
         <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-4">
            <nav className="flex w-full max-w-6xl items-center justify-between rounded-full border border-black/5 bg-[#fcfcfa]/90 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.06)] backdrop-blur-xl">
               <Link href="/" className="flex items-center gap-2">
                  <LogoMark size={32} />
                  <span className="text-[17px] font-bold tracking-[-0.03em]">
                     WhatsApp<span className="text-emerald-700">Base</span>
                  </span>
               </Link>
               <div className="hidden items-center gap-1 rounded-full bg-black/[0.03] p-1 text-sm font-medium text-black/60 md:flex">
                  {[
                     ["Platform", "#platform"],
                     ["Workflow", "#workflow"],
                     ["Payments", "#payments"],
                     ["Dashboard", "/dashboard"],
                  ].map(([label, href]) => (
                     <Link key={label} href={href} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-black">
                        {label}
                     </Link>
                  ))}
               </div>
               <Link
                  href="/signin"
                  className="rounded-full bg-[#0a0a0a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,.12)] transition hover:opacity-80">
                  Log in
               </Link>
            </nav>
         </header>

         <section className="relative flex min-h-screen flex-col items-center justify-center bg-white px-5 pt-24 text-center">
            <ContourBackground />
            <div className="relative z-10 flex w-full flex-col items-center">
               <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 shadow-sm backdrop-blur">
                  <Sparkles className="size-4" />
                  AI commerce for WhatsApp stores
               </div>
               <h1
                  className="max-w-7xl font-normal italic tracking-[-0.055em] text-[#0a0a0a]"
                  style={{
                     fontFamily: "var(--calson-font)",
                     fontSize: "clamp(70px, 13vw, 188px)",
                     lineHeight: 0.88,
                  }}>
                  Sell through chat
               </h1>
               <p className="mx-auto mt-8 max-w-xl text-[17px] leading-8 text-black/60">
                  A WhatsApp business dashboard for product pictures, AI replies, customer questions,
                  orders, and M-Pesa payments — built for small merchants that sell from chat.
               </p>
               <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                     href="/dashboard"
                     className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-8 py-4 text-sm font-semibold text-white transition hover:opacity-80">
                     Open dashboard <ArrowRight className="size-4" />
                  </Link>
                  <Link
                     href="/signin"
                     className="inline-flex items-center gap-2 rounded-full border border-black/15 px-8 py-4 text-sm font-semibold text-black/70 transition hover:border-black/30 hover:text-black">
                     Sign in
                  </Link>
               </div>
            </div>
         </section>

         <section className="overflow-hidden border-y border-black/[0.04] bg-[#fcfcfc] py-8">
            <div className="flex w-max animate-[wc-marquee_42s_linear_infinite] items-center gap-12">
               {[...commerceTicker, ...commerceTicker, ...commerceTicker].map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-12">
                     <div className="flex items-center gap-3 whitespace-nowrap">
                        <span className="grid size-9 place-items-center rounded-full border border-black/[0.04] bg-white shadow-sm">
                           <Zap className="size-4 text-emerald-700" />
                        </span>
                        <span className="text-sm font-semibold text-black/55">{item}</span>
                     </div>
                     <Sparkles className="size-3 text-black/15" />
                  </div>
               ))}
            </div>
            <style>{`@keyframes wc-marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.333333%)}}`}</style>
         </section>

         <section id="platform" className="relative bg-[#f0f0ed] px-5 py-28">
            <div className="mx-auto max-w-6xl">
               <div className="grid items-end gap-8 lg:grid-cols-[.95fr_.75fr]">
                  <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Platform</p>
                  <h2 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] md:text-7xl">
                     Built around the moment a customer is ready to buy.
                  </h2>
                  </div>
                  <p className="max-w-xl text-lg leading-8 text-black/60 lg:pb-2">
                     Most WhatsApp selling breaks because product info, customer intent, and payment status live in different places.
                     This interface keeps those decisions beside the conversation.
                  </p>
               </div>
               <div className="mt-14">
                  <MerchantOperatingDesk />
               </div>
            </div>
         </section>

         <section id="workflow" className="bg-white px-5 py-28">
            <div className="mx-auto max-w-4xl">
               <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">How it works</p>
               <h2 className="mt-4 max-w-2xl text-5xl font-normal italic leading-[1.03] tracking-[-0.04em] md:text-7xl" style={{ fontFamily: "var(--calson-font)" }}>
                  From WhatsApp chaos to operating clarity.
               </h2>
               <div className="mt-14">
                  {steps.map((step) => (
                     <div key={step.num} className="grid gap-6 border-t border-black/[0.07] py-9 md:grid-cols-[80px_1fr]">
                        <span className="text-sm font-bold text-black/20">{step.num}</span>
                        <div>
                           <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-semibold tracking-[-0.035em]">{step.title}</h3>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{step.tag}</span>
                           </div>
                           <p className="mt-3 max-w-2xl leading-7 text-black/58">{step.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section id="payments" className="bg-[#0c0f0e] px-5 py-28 text-white">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.95fr_1.05fr]">
               <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Payments</p>
                  <h2 className="mt-4 text-5xl font-medium leading-[1.03] tracking-[-0.05em] md:text-7xl">
                     Payment is not a separate feature. It is the next state of the conversation.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                     The bot can collect the phone number, initiate STK push, record the transaction,
                     and notify the customer when payment is confirmed.
                  </p>
               </div>
               <PaymentJourney />
            </div>
         </section>

         <footer className="bg-[#fcfcfa] px-5 py-12">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 border-t border-black/[0.08] pt-8 md:flex-row md:items-center md:justify-between">
               <div className="flex items-center gap-2">
                  <LogoMark size={30} />
                  <span className="font-bold tracking-[-0.03em]">WhatsAppBase</span>
               </div>
               <p className="max-w-2xl text-sm leading-6 text-black/50">
                  Built on approved business information. AI can make mistakes, so merchants should review setup,
                  product details, and payment configuration before using it with customers.
               </p>
               <div className="flex gap-4 text-sm font-semibold text-black/60">
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
               </div>
            </div>
         </footer>
      </main>
   );
}
