"use client";

import Link from "next/link";
import {
   ArrowRight,
   Bot,
   CheckCircle2,
   CreditCard,
   Image as ImageIcon,
   MessageCircle,
   Package,
   ReceiptText,
   Send,
   ShieldCheck,
   Sparkles,
   Users,
   Zap,
} from "lucide-react";

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
      desc: "WAHA receives the message, Groq drafts the reply, and the customer sees products, availability, and next steps in chat.",
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

const features = [
   {
      icon: ImageIcon,
      title: "Visual product catalog",
      desc: "Upload product pictures and let shoppers see what is available before they commit.",
   },
   {
      icon: Bot,
      title: "AI replies from approved info",
      desc: "The assistant answers from your configured products, policies, and templates instead of guessing.",
   },
   {
      icon: CreditCard,
      title: "M-Pesa payment flow",
      desc: "Trigger STK push from WhatsApp and store payment status, receipt, product, and customer context.",
   },
   {
      icon: Users,
      title: "Customer visibility",
      desc: "Track who asked what, what they wanted, and whether the conversation needs human follow-up.",
   },
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

function ChatPreview() {
   return (
      <div className="relative mx-auto w-full max-w-[430px] rounded-[32px] border border-black/10 bg-[#f2ede3] p-3 shadow-[0_30px_90px_rgba(0,0,0,.18)]">
         <div className="rounded-t-[24px] bg-white p-4">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-[#0a0a0a]">Amina from WhatsApp</p>
                  <p className="text-xs font-semibold text-emerald-600">Online · wants to buy</p>
               </div>
               <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">AI</span>
            </div>
         </div>
         <div className="space-y-3 p-4">
            <div className="max-w-[82%] rounded-2xl bg-white p-3 text-sm text-black shadow-sm">
               Do you have the California set today?
            </div>
            <div className="ml-auto max-w-[88%] rounded-2xl bg-[#DCF8C6] p-3 text-sm text-black shadow-sm">
               Yes. California Set is available for KES 1,500. I can show pictures or start payment.
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-2 shadow-sm">
               {[
                  ["California Set", "KES 1,500", "In stock"],
                  ["Mini Pathos", "KES 900", "3 left"],
               ].map(([name, price, stock]) => (
                  <div key={name} className="rounded-2xl border border-black/5 bg-[#fbfbf9] p-2">
                     <div className="grid h-24 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-lime-50">
                        <Package className="size-9 text-emerald-700" />
                     </div>
                     <p className="mt-2 text-xs font-bold text-black">{name}</p>
                     <p className="text-xs text-black/55">{price} · {stock}</p>
                  </div>
               ))}
            </div>
            <div className="ml-auto flex max-w-[88%] items-center gap-2 rounded-2xl bg-[#DCF8C6] p-3 text-sm text-black shadow-sm">
               <CreditCard className="size-4 text-emerald-700" />
               STK push sent to 2547•••2501
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
            <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_440px]">
               <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Platform</p>
                  <h2 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] md:text-7xl">
                     Your shop, your inbox, and your payments in one place.
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
                     The dashboard is designed around what a merchant needs during a real conversation:
                     what is available, what the customer wants, whether payment started, and what the AI said.
                  </p>
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                     {features.map((feature) => (
                        <div key={feature.title} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,.04)]">
                           <feature.icon className="size-6 text-emerald-700" />
                           <h3 className="mt-4 text-lg font-bold tracking-[-0.03em]">{feature.title}</h3>
                           <p className="mt-2 text-sm leading-6 text-black/55">{feature.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
               <ChatPreview />
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
                     Customers can move from interest to paid without leaving chat.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                     The bot can collect the phone number, initiate STK push, record the transaction,
                     and notify the customer when payment is confirmed.
                  </p>
               </div>
               <div className="grid gap-4">
                  {[
                     [MessageCircle, "Customer says: I want to pay"],
                     [Send, "Bot asks for the right M-Pesa number"],
                     [CreditCard, "STK push starts from Daraja sandbox/production config"],
                     [ReceiptText, "Receipt and status are stored on the dashboard"],
                     [CheckCircle2, "AI has recent payment context for follow-up"],
                  ].map(([Icon, text]) => (
                     <div key={text as string} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-400/10">
                           <Icon className="size-6 text-emerald-300" />
                        </span>
                        <span className="text-lg font-semibold tracking-[-0.025em]">{text as string}</span>
                     </div>
                  ))}
               </div>
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
