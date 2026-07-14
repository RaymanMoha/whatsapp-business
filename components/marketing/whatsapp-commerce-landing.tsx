"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaFileExcel } from "react-icons/fa6";
import { SiGoogle, SiWhatsapp } from "react-icons/si";
import {
   ArrowRight,
   Bot,
   Box,
   Check,
   CheckCircle2,
   ChevronRight,
   CreditCard,
   ImageIcon,
   MessageCircle,
   PackageCheck,
   ReceiptText,
   Send,
   ShoppingBag,
   ShoppingCart,
   Sparkles,
   WalletCards,
} from "lucide-react";
import CommerceWeekenderImage from "@/public/commerce-weekender-hero.webp";
import { BrandLogo } from "@/components/brand-logo";

const workflow = [
   {
      number: "01",
      icon: ImageIcon,
      title: "Show products",
      description: "Send rich product pictures, prices, stock and details without leaving the conversation.",
   },
   {
      number: "02",
      icon: ShoppingCart,
      title: "Build the cart",
      description: "Turn casual product questions into one clear, combined cart ready for checkout.",
   },
   {
      number: "03",
      icon: WalletCards,
      title: "Confirm payment",
      description: "Start an M-Pesa request and wait for the verified callback—not a customer saying “sent”.",
   },
   {
      number: "04",
      icon: PackageCheck,
      title: "Fulfil the order",
      description: "Move the paid order forward, share the receipt and keep the customer updated.",
   },
];

const paymentTimeline = [
   { title: "Cart created", time: "10:21 AM", icon: ShoppingCart },
   { title: "M-Pesa request sent", time: "10:21 AM", icon: Send },
   { title: "Payment confirmed", time: "10:24 AM", icon: Check, featured: true },
   { title: "Order ready", time: "10:31 AM", icon: Box },
   { title: "Receipt shared", time: "10:31 AM", icon: ReceiptText },
];

const connectedTools = [
   {
      name: "WhatsApp",
      value: "Sell where customers chat",
      icon: SiWhatsapp,
      iconClassName: "text-[#1fa855]",
   },
   {
      name: "M-PESA",
      value: "Collect verified payments",
      wordmark: true,
   },
   {
      name: "Excel",
      value: "Export sales and stock",
      icon: FaFileExcel,
      iconClassName: "text-[#187c45]",
   },
   {
      name: "Google Tools",
      value: "Sync Forms and Sheets",
      icon: SiGoogle,
      iconClassName: "text-[#4285f4]",
   },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
   return (
      <span className="inline-flex items-center">
         <BrandLogo
            variant={inverse ? "color" : "green"}
            priority={!inverse}
            className="h-[48px] w-auto"
            sizes="87px"
         />
      </span>
   );
}

function ConnectedTools() {
   return (
      <div data-landing-reveal className="overflow-x-auto border-y border-black/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
         <div className="grid min-w-[650px] grid-cols-[170px_repeat(2,minmax(0,1fr))]">
            <div className="row-span-2 flex flex-col justify-center border-r border-black/10 py-4 pr-5">
               <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#168243]">Connected by AppBase</p>
               <p className="mt-2 text-[14px] font-semibold leading-5 tracking-[-0.025em] text-black/65">
                  Tools already in your workflow.
               </p>
            </div>
            {connectedTools.map(({ name, value, icon: Icon, iconClassName, wordmark }, index) => (
               <div
                  key={name}
                  className={`flex min-h-[64px] items-center gap-3 border-r border-black/10 px-5 py-4 ${index < 2 ? "border-b" : ""}`}>
                     {wordmark ? (
                        <div>
                           <p className="text-[14px] font-black tracking-[-0.055em]">
                              <span className="text-[#d91f2b]">M</span>
                              <span className="text-[#168243]">-PESA</span>
                           </p>
                           <p className="mt-1 whitespace-nowrap text-[10px] text-black/45">{value}</p>
                        </div>
                     ) : Icon ? (
                        <Icon aria-hidden className={`size-6 shrink-0 ${iconClassName}`} />
                     ) : null}
                     {!wordmark ? (
                        <div>
                           <p className="text-[13px] font-bold tracking-[-0.02em] text-[#07120d]">{name}</p>
                           <p className="mt-1 whitespace-nowrap text-[10px] text-black/45">{value}</p>
                        </div>
                     ) : null}
               </div>
            ))}
         </div>
      </div>
   );
}

function CommerceCanvas() {
   const stages = [
      { label: "Customer message", icon: MessageCircle, content: <div className="mt-9 rounded-[16px_16px_16px_4px] border border-white/8 bg-white/15 p-4 text-[13px] leading-5 text-white">Do you have the canvas bag in olive?</div> },
      { label: "Show products", icon: ShoppingBag, content: <><div className="relative mt-6 h-32 overflow-hidden rounded-xl border border-white/10"><Image src="/brand-catalog-studio.webp" alt="Curated merchant products ready for the WhatsApp catalog" fill className="object-cover object-[62%_55%]" sizes="220px" /></div><p className="mt-4 text-[13px] font-semibold">Curated catalog</p><p className="mt-1 text-[11px] font-medium text-[#9dff2f]">Rich images · Live stock</p></> },
      { label: "Approved reply", icon: Bot, content: <div className="mt-9"><div className="mb-4 flex items-center gap-2 text-[11px] font-semibold text-[#9dff2f]"><Sparkles className="size-3.5" /> Approved answer</div><p className="text-[13px] leading-6 text-white/88">Yes, it is available in olive. I&apos;ve added one to your cart.</p></div> },
      { label: "Payment request", icon: WalletCards, content: <div className="mt-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#9dff2f] text-black shadow-[0_0_28px_rgba(157,255,47,.25)]"><CreditCard className="size-5" /></span><p className="mt-5 text-[11px] text-white/60">M-Pesa total</p><p className="mt-1 text-2xl font-semibold">KES 3,500</p><div className="mt-5 rounded-xl bg-[#9dff2f] py-2.5 text-[11px] font-bold text-black">Send request</div></div> },
      { label: "Order confirmed", icon: CheckCircle2, content: <div className="mt-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full border border-[#9dff2f]/70 bg-[#9dff2f]/8 text-[#9dff2f] shadow-[0_0_24px_rgba(157,255,47,.12)]"><Check className="size-6" /></span><p className="mt-5 text-[15px] font-semibold text-white">Payment received</p><p className="mt-1.5 text-[10px] text-white/55">#WC-2418 · 10:24 AM</p></div> },
      { label: "Receipt", icon: ReceiptText, content: <div className="mt-6 bg-[#fffdf7] p-4 text-black shadow-[0_18px_45px_rgba(0,0,0,.22)]"><p className="text-center text-[9px] font-bold tracking-[.2em]">URBAN SUPPLY</p><div className="my-4 border-t border-dashed border-black/25" /><p className="text-[10px] text-black/55">Receipt #WC-2418</p><div className="mt-5 flex justify-between text-[12px]"><span>Total</span><strong>KES 3,500</strong></div><p className="mt-4 text-[9px] font-semibold text-[#168243]">Paid via M-Pesa</p></div> },
   ];

   return (
      <div data-landing-reveal className="relative mt-16 overflow-hidden border-y border-[#9dff2f]/20 bg-[#06241a] text-white shadow-[0_38px_110px_rgba(2,25,18,.24)] lg:rounded-[30px] lg:border">
         <div className="flex flex-col gap-3 border-b border-white/12 bg-white/[.025] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="relative size-2.5 rounded-full bg-[#9dff2f] shadow-[0_0_18px_#9dff2f]"><span className="absolute inset-[-5px] rounded-full border border-[#9dff2f]/40" /></span><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/82">One conversation · six connected decisions</p></div>
            <p className="text-[11px] font-medium text-white/45">Live commerce path</p>
         </div>
         <div className="landing-signal-line absolute left-[7%] right-[7%] top-[111px] hidden h-px bg-[#9dff2f]/65 lg:block" />
         <div className="grid md:grid-cols-2 lg:grid-cols-6">
            {stages.map(({ label, icon: Icon, content }, index) => (
               <div key={label} className="group/stage relative min-h-[350px] border-b border-white/12 p-5 transition-colors duration-500 last:border-b-0 hover:bg-white/[.055] md:border-r lg:border-b-0 lg:last:border-r-0">
                  <div className="relative z-10 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                     <span className="grid size-8 place-items-center rounded-full border border-[#9dff2f]/75 bg-[#06241a] text-[#9dff2f]"><Icon className="size-3.5" /></span>
                     <span className="lg:hidden xl:inline">{label}</span><span className="ml-auto text-white/32">0{index + 1}</span>
                  </div>
                  {content}
               </div>
            ))}
         </div>
      </div>
   );
}

function PaymentTimeline() {
   return (
      <div data-landing-reveal className="relative">
         <div className="absolute bottom-10 left-5 top-10 w-px bg-gradient-to-b from-[#9dff2f]/20 via-[#9dff2f] to-[#9dff2f]/20" />
         <div className="space-y-7">
            {paymentTimeline.map(({ title, time, icon: Icon, featured }) => (
               <div key={title} className="relative grid grid-cols-[42px_1fr] items-start gap-5">
                  <span className={`relative z-10 grid size-[42px] place-items-center rounded-full border ${featured ? "border-[#9dff2f] bg-[#163d2c] text-[#9dff2f] shadow-[0_0_28px_rgba(157,255,47,.42)]" : "border-[#9dff2f]/45 bg-[#07150f] text-[#9dff2f]"}`}><Icon className="size-4" /></span>
                  <div className={featured ? "-mt-2 rounded-2xl border border-[#9dff2f]/30 bg-[#0a2218] p-5" : "pt-1"}>
                     <div className="flex items-baseline justify-between gap-5"><p className={`font-semibold ${featured ? "text-[#9dff2f]" : "text-white/72"}`}>{title}</p><p className="text-[11px] text-white/35">{time}</p></div>
                     {featured && <div className="mt-5 grid grid-cols-2 gap-y-3 text-[11px]"><span className="text-white/36">Amount</span><strong className="text-right text-base text-[#9dff2f]">KES 3,500</strong><span className="text-white/36">From</span><span className="text-right text-white/72">+254 712 345 678</span><span className="text-white/36">Transaction ID</span><span className="text-right text-white/72">QJK8H7L3M2</span><span className="text-white/36">Completed</span><span className="text-right text-white/72">18 May · 10:24</span></div>}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

function PaidOrderPanel() {
   return (
      <div data-landing-reveal className="overflow-hidden rounded-[26px] border border-white/10 bg-[#081b15] shadow-[0_45px_110px_rgba(0,0,0,.32)]">
         <div className="flex items-center justify-between border-b border-white/8 px-5 py-4"><Logo inverse /><span className="rounded-full border border-[#9dff2f]/30 bg-[#9dff2f]/8 px-3 py-1 text-[10px] font-semibold text-[#9dff2f]">Live dashboard</span></div>
         <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] text-white/35">Order</p><h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">#WC-2418</h3><p className="mt-1 text-[11px] text-white/42">18 May · 10:24 AM via WhatsApp</p></div><span className="inline-flex items-center gap-2 rounded-full bg-[#123d29] px-4 py-2 text-xs font-semibold text-[#7def9a]"><Check className="size-3.5" /> Paid</span></div>
            <div className="mt-7 grid grid-cols-2 border-y border-white/8 py-5 sm:grid-cols-4">
               {[['Customer','John Kamau'],['Total','KES 3,500'],['Method','M-Pesa'],['Channel','WhatsApp']].map(([label,value]) => <div key={label} className="border-white/8 py-2 pr-3 sm:border-r sm:pl-4 sm:first:pl-0 sm:last:border-r-0"><p className="text-[9px] text-white/30">{label}</p><p className="mt-1 text-[11px] font-semibold">{value}</p></div>)}
            </div>
            <div className="mt-6"><p className="text-xs font-semibold">Order items</p><div className="mt-3 flex items-center gap-4 border-b border-white/8 pb-5"><div className="relative size-14 overflow-hidden rounded-xl bg-white/5"><Image src={CommerceWeekenderImage} alt="Olive canvas weekender in the paid order" fill className="object-cover object-[58%_48%]" sizes="56px" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Canvas Weekender · Olive</p><p className="mt-1 text-[10px] text-white/38">Qty 1 · In stock</p></div><p className="text-sm font-semibold">KES 3,500</p></div></div>
            <div className="mt-6 rounded-2xl border border-[#9dff2f]/15 bg-[#9dff2f]/[.035] p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold">M-Pesa payment</p><span className="text-[10px] font-semibold text-[#9dff2f]">Confirmed</span></div><div className="mt-5 grid grid-cols-2 gap-y-3 text-[11px]"><span className="text-white/32">Transaction</span><span className="text-right">QJK8H7L3M2</span><span className="text-white/32">Reference</span><span className="text-right">WC-2418</span><span className="text-white/32">Receipt</span><span className="inline-flex items-center justify-end gap-1.5 text-[#9dff2f]"><ReceiptText className="size-3" /> Ready to share</span></div></div>
         </div>
      </div>
   );
}

export function WhatsappCommerceLanding() {
   const pageRef = useRef<HTMLElement>(null);

   useEffect(() => {
      const page = pageRef.current;
      if (!page) return;

      const revealItems = Array.from(page.querySelectorAll<HTMLElement>("[data-landing-reveal]"));
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (!entry.isIntersecting) return;
               entry.target.classList.add("landing-reveal-visible");
               observer.unobserve(entry.target);
            });
         },
         { threshold: 0.12, rootMargin: "0px 0px -7%" },
      );

      revealItems.forEach((item, index) => {
         item.style.setProperty("--landing-reveal-delay", `${(index % 4) * 70}ms`);
         observer.observe(item);
      });
      page.classList.add("landing-motion-ready");

      return () => observer.disconnect();
   }, []);

   return (
      <main ref={pageRef} className="overflow-hidden bg-[#f6f4ed] text-[#07120d] selection:bg-[#9dff2f] selection:text-black">
         <header className="sticky top-0 z-50 border-b border-black/8 bg-[#f6f4ed]/90 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
               <Link href="#top" aria-label="AppBase home" className="transition hover:opacity-75"><Logo /></Link>
               <div className="hidden items-center gap-8 text-[13px] font-medium text-black/55 md:flex">
                  <Link href="#how-it-works" className="transition hover:text-black">How it works</Link>
                  <Link href="#features" className="transition hover:text-black">Features</Link>
                  <Link href="#payments" className="transition hover:text-black">Payments</Link>
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/signin" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-black/65 transition hover:bg-black/5 hover:text-black">Log in</Link>
                  <Link href="/signin" className="hidden items-center gap-2 rounded-full bg-[#07120d] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black sm:inline-flex">Start selling <ArrowRight className="size-3.5" /></Link>
               </div>
            </nav>
         </header>

         <section id="top" className="relative z-10 overflow-visible bg-transparent">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_77%_43%,rgba(157,255,47,.14),transparent_25%)]" />
            <div className="mx-auto hidden h-[calc(100svh-81px)] min-h-[590px] max-h-[680px] max-w-[1440px] grid-cols-[1.04fr_.96fr] items-center gap-8 px-8 lg:grid xl:px-10">
               <div className="relative z-10 max-w-[720px] py-10">
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#168243]/18 bg-[#dff7e5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#08742e]"><span className="size-1.5 rounded-full bg-[#18a54d] shadow-[0_0_0_4px_rgba(24,165,77,.12)]" /> Commerce that closes the loop</div>
                  <h1 className="text-[clamp(72px,5.9vw,96px)] font-semibold leading-[.86] tracking-[-0.072em]"><span className="block">Turn chats into</span><span className="block text-[#168243]">paid orders.</span></h1>
                  <p className="mt-7 max-w-[550px] text-[18px] leading-8 text-black/58">From product discovery to confirmed M-Pesa payment, every step stays inside the conversation.</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                     <Link href="/signin" className="group inline-flex items-center gap-3 rounded-xl bg-[#07120d] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_38px_rgba(0,0,0,.18)] transition hover:-translate-y-0.5 hover:bg-black">Open your storefront <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                     <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-black/18 bg-white/35 px-7 py-4 text-sm font-semibold backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-black/35 hover:bg-white/70">See how it works <ChevronRight className="size-4" /></Link>
                  </div>
                  <div className="mt-8 flex max-w-[550px] flex-wrap gap-x-7 gap-y-3 border-t border-black/10 pt-5 text-[12px] text-black/48"><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#08742e]" /> No new app for customers</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#08742e]" /> Verified payment status</span></div>
                  <div className="mt-7 max-w-[680px]">
                     <ConnectedTools />
                  </div>
               </div>

               <div className="relative z-20 h-full min-h-0 self-stretch">
                  <Image
                     src="/whatsapp-commerce-community-hero-v3.png"
                     alt="Merchant using WhatsApp Commerce Hub to manage product conversations and payments"
                     fill
                     priority
                     unoptimized
                     className="origin-right translate-x-2 translate-y-8 scale-[1.20] object-contain object-right"
                     sizes="(min-width: 1440px) 700px, (min-width: 1024px) 52vw, 100vw"
                  />
               </div>
            </div>

            <div className="relative min-h-[760px] overflow-hidden text-white lg:hidden">
               <Image
                  src="/whatsapp-commerce-community-hero-v3.png"
                  alt="Merchant using WhatsApp Commerce Hub"
                  fill
                  priority
                  unoptimized
                  className="scale-[1.8] object-cover object-[100%_42%]"
                  sizes="100vw"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#03100a]" />
               <div className="absolute inset-x-0 bottom-0 px-5 pb-12 pt-32">
                  <h1 className="text-[58px] font-semibold leading-[.88] tracking-[-0.07em]">
                     Turn chats into <span className="text-[#5bea78]">paid orders.</span>
                  </h1>
                  <p className="mt-6 max-w-sm text-[16px] leading-7 text-white/72">From product discovery to confirmed M-Pesa payment, every step stays inside the conversation.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                     <Link href="/signin" className="inline-flex items-center gap-3 rounded-xl bg-[#31db70] px-6 py-3.5 text-sm font-bold text-[#031008]">Open your storefront <ArrowRight className="size-4" /></Link>
                     <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-black/20 px-6 py-3.5 text-sm font-semibold backdrop-blur">How it works <ChevronRight className="size-4" /></Link>
                  </div>
               </div>
            </div>
         </section>

         <div className="bg-[#f6f4ed] px-5 py-8 lg:hidden">
            <ConnectedTools />
         </div>

         <section id="features" className="relative z-0 bg-[#f6f4ed] px-5 pb-28 pt-20 md:pb-36 md:pt-20">
            <div className="mx-auto max-w-[1240px]">
               <div data-landing-reveal className="grid items-end gap-8 lg:grid-cols-[1.3fr_.7fr]">
                  <h2 className="max-w-[850px] text-[clamp(52px,7vw,100px)] font-semibold leading-[.9] tracking-[-0.07em]">
                     <span className="box-decoration-clone bg-[#9dff2f] px-[0.055em] [-webkit-box-decoration-break:clone]">
                        Everything you need to sell, all in WhatsApp.
                     </span>
                  </h2>
                  <div className="border-l border-black/15 pl-6 lg:pb-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#168243]">The connected sales desk</p><p className="mt-4 max-w-md text-[17px] leading-8 text-black/55">From product discovery to payment confirmation, the entire sales cycle stays connected for you and effortless for your customer.</p></div>
               </div>
               <figure data-landing-reveal className="relative mt-16 h-[360px] overflow-hidden rounded-[30px] border border-black/10 bg-[#07120d] shadow-[0_32px_90px_rgba(4,18,13,.16)] md:h-[500px]">
                  <Image src="/brand-catalog-studio.webp" alt="Curated products in a premium merchant studio" fill className="object-cover object-center" sizes="(min-width: 1280px) 1240px, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03100b]/85 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-5 p-6 text-white sm:flex-row sm:items-end md:p-9">
                     <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9dff2f]">Product discovery</p><p className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.04em] md:text-4xl">A catalog should feel as considered as the products inside it.</p></div>
                     <p className="max-w-[250px] text-sm leading-6 text-white/60">Rich product imagery gives every conversation a stronger place to begin.</p>
                  </figcaption>
               </figure>
               <CommerceCanvas />
            </div>
         </section>

         <section id="how-it-works" className="border-t border-black/10 bg-[#fffdf7] px-5 py-28 md:py-36">
            <div className="mx-auto max-w-[1240px]">
               <div data-landing-reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#168243]">One connected sales loop</p><h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.95] tracking-[-0.06em] md:text-7xl">From “is it available?” to a paid order.</h2></div><p className="max-w-sm border-l border-black/15 pl-6 text-sm leading-7 text-black/48">The assistant helps with the repetitive work. You keep the visibility and control.</p></div>
               <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4">
                  {workflow.map(({ number, icon: Icon, title, description }, index) => <article data-landing-reveal key={number} className="group relative border-t border-black/15 py-8 transition-colors duration-500 md:min-h-[340px] md:border-r md:px-7 md:hover:bg-[#07120d] md:hover:text-white md:first:pl-7 md:last:border-r-0"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-black/28 transition group-hover:text-white/35">{number}</span><span className="grid size-11 place-items-center rounded-full border border-black/10 transition duration-500 group-hover:border-[#9dff2f]/40 group-hover:bg-[#9dff2f] group-hover:text-black"><Icon className="size-4" /></span></div><h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em]">{title}</h3><p className="mt-4 max-w-[250px] text-sm leading-7 text-black/50 transition group-hover:text-white/55">{description}</p>{index < workflow.length - 1 && <ArrowRight className="absolute -right-3.5 top-[46%] z-10 hidden size-7 rounded-full border border-black/10 bg-[#fffdf7] p-1.5 text-black/40 transition group-hover:border-[#9dff2f] group-hover:bg-[#9dff2f] group-hover:text-black lg:block" />}</article>)}
               </div>
               <div data-landing-reveal className="mt-16 grid overflow-hidden rounded-[30px] bg-[#07120d] text-white shadow-[0_35px_100px_rgba(0,0,0,.14)] lg:grid-cols-[1.38fr_.62fr]">
                  <div className="relative min-h-[360px] lg:min-h-[500px]"><Image src="/brand-order-fulfilment.webp" alt="Merchant carefully preparing a paid customer order" fill className="object-cover object-center" sizes="(min-width: 1024px) 850px, 100vw" /></div>
                  <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9dff2f]">From payment to fulfilment</p><h3 className="mt-6 text-4xl font-semibold leading-[.94] tracking-[-0.055em] lg:text-5xl">Every paid order deserves a careful finish.</h3><p className="mt-6 text-sm leading-7 text-white/52">Once payment is confirmed, the order, customer details and receipt stay connected—so the handoff feels as polished as the sale.</p></div><div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/55"><CheckCircle2 className="size-4 text-[#9dff2f]" /> Receipt ready to share</div></div>
               </div>
            </div>
         </section>

         <section id="payments" className="relative overflow-hidden bg-[#020a07] px-5 py-28 text-white md:py-36">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(24,122,70,.19),transparent_38%)]" />
            <div className="relative mx-auto max-w-[1240px]">
               <div data-landing-reveal className="grid items-end gap-10 lg:grid-cols-[1.02fr_.55fr]"><h2 className="max-w-[820px] text-[clamp(52px,6.6vw,94px)] font-normal leading-[.94] tracking-[-0.055em]" style={{ fontFamily: "var(--calson-font)" }}>A sale is only real when the payment is confirmed.</h2><div className="border-l border-[#9dff2f]/35 pl-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9dff2f]">Verified, not assumed</p><p className="mt-4 max-w-sm text-[16px] leading-8 text-white/48">Your order moves forward only after the verified M-Pesa callback arrives. Every step stays visible.</p></div></div>
               <figure data-landing-reveal className="relative mt-16 h-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[#07120d] md:h-[480px]">
                  <Image src="/brand-payment-confirmation.webp" alt="Merchant confirming a mobile payment beside a prepared customer parcel" fill className="object-cover object-[50%_55%]" sizes="(min-width: 1280px) 1240px, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#03100b]/78 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 max-w-xl p-7 md:p-10"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9dff2f]">Payment confidence</p><p className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] md:text-5xl">Move the order only when the money is confirmed.</p></figcaption>
               </figure>
               <div className="mt-20 grid gap-14 lg:grid-cols-[.63fr_1.37fr] lg:items-center"><PaymentTimeline /><PaidOrderPanel /></div>
            </div>
         </section>

         <section className="bg-[#9dff2f] px-5 py-20 md:py-24">
            <div data-landing-reveal className="mx-auto flex max-w-[1240px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
               <div><p className="mb-6 text-[10px] font-bold uppercase tracking-[.2em]">Your customers are already there</p><h2 className="max-w-[850px] text-[clamp(56px,8vw,112px)] font-normal leading-[.82] tracking-[-0.065em]" style={{ fontFamily: "var(--calson-font)" }}>Turn conversations into orders.</h2></div>
               <div className="lg:max-w-[300px] lg:pb-2"><p className="mb-6 text-sm leading-6 text-black/60">Set up your catalog once. Let every conversation become a clearer path to payment.</p><div className="flex flex-wrap gap-3"><Link href="/signin" className="group inline-flex items-center gap-4 rounded-xl bg-[#06110d] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5">Start selling <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link><Link href="/signin" className="rounded-xl border border-black/30 px-7 py-4 text-sm font-bold transition hover:bg-black/5">Log in</Link></div></div>
            </div>
         </section>

         <footer className="bg-[#020806] px-5 py-14 text-white">
            <div className="mx-auto max-w-[1240px]"><div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_.8fr_.8fr_1fr]"><Logo inverse /><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/28">Product</p><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" href="#how-it-works">How it works</Link><Link className="block hover:text-white" href="#features">Features</Link><Link className="block hover:text-white" href="#payments">Payments</Link></div></div><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/28">Account</p><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" href="/signin">Log in</Link><Link className="block hover:text-white" href="/privacy">Privacy</Link><Link className="block hover:text-white" href="/terms">Terms</Link></div></div><p className="max-w-xs text-sm leading-6 text-white/42">Replies are based on approved business information. AI can make mistakes, so merchants should review their setup and product details.</p></div><div className="flex flex-col gap-3 pt-7 text-[11px] text-white/28 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 AppBase</p><p>Built for businesses that sell through chat.</p></div></div>
         </footer>
      </main>
   );
}
