"use client";

import { Button } from "@/components/ui/button";
import {
   Bot,
   BookOpen,
   CreditCard,
   MessageCircle,
   PackagePlus,
   Sparkles,
   Zap,
} from "lucide-react";
import { HERO_TITLE, HERO_SUBTITLE } from "@/constants";
import Link from "next/link";

const previewProducts = [
   { name: "Organic Honey", price: "KES 249", emoji: "🍯" },
   { name: "Green Tea", price: "KES 149", emoji: "🍵" },
   { name: "Lavender Candle", price: "KES 249", emoji: "🕯️" },
];

export function Hero() {
   return (
      <section className="space-y-8">
         <div className="relative overflow-hidden rounded-[32px] border border-black/5 bg-[#fcfcfa] px-6 py-7 shadow-[0_18px_60px_rgba(0,0,0,.06)] md:px-8 md:py-9">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20px_20px,rgba(15,107,79,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_390px]">
               <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                     <Sparkles className="size-4" />
                     Live WhatsApp operations
                  </div>
                  <h1
                     className="max-w-4xl font-normal italic leading-[0.96] tracking-[-0.055em] text-[#0a0a0a]"
                     style={{
                        fontFamily: "var(--calson-font)",
                        fontSize: "clamp(52px, 8vw, 118px)",
                     }}>
                     {HERO_TITLE}
                  </h1>
                  <p className="mt-5 max-w-2xl text-[17px] leading-8 text-black/60">{HERO_SUBTITLE}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                     <Link href="/dashboard/products">
                        <Button className="rounded-full bg-[#0a0a0a] px-6 py-6 text-white hover:bg-black/80">
                           <PackagePlus className="size-4" />
                           Add products
                        </Button>
                     </Link>
                     <Link href="/dashboard/bot-settings">
                        <Button variant="outline" className="rounded-full border-black/15 bg-white px-6 py-6">
                           <BookOpen className="size-4" />
                           Configure bot
                        </Button>
                     </Link>
                  </div>
               </div>

               <div className="rounded-[28px] border border-black/10 bg-[#0f1411] p-4 text-white shadow-2xl">
                  <div className="flex items-center justify-between rounded-3xl bg-white/[0.06] p-4">
                     <div>
                        <p className="text-sm font-bold">Today&apos;s sales assistant</p>
                        <p className="text-xs font-semibold text-emerald-300">WhatsApp + Private AI + M-Pesa</p>
                     </div>
                     <span className="grid size-10 place-items-center rounded-2xl bg-emerald-400/10">
                        <Bot className="size-5 text-emerald-300" />
                     </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                     {[
                        [MessageCircle, "New question", "Show me what is available"],
                        [Zap, "AI replied", "Sent product pictures and prices"],
                        [CreditCard, "Payment", "STK push ready from chat"],
                     ].map(([Icon, label, value]) => (
                        <div key={label as string} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                           <span className="grid size-10 place-items-center rounded-2xl bg-white/[0.06]">
                              <Icon className="size-5 text-emerald-300" />
                           </span>
                           <div>
                              <p className="text-xs text-white/45">{label as string}</p>
                              <p className="text-sm font-semibold">{value as string}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="relative overflow-hidden rounded-[32px] border border-black/5 bg-[#003F37] animate-chat-in-right shadow-[0_18px_60px_rgba(0,0,0,.10)]">
            <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20px_20px,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_360px] md:p-8">
               <div className="flex flex-col justify-between text-white">
                  <div>
                     <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
                        Live commerce assistant
                     </p>
                     <h2
                        className="mt-4 max-w-2xl text-4xl leading-tight md:text-5xl"
                        style={{ fontFamily: "var(--calson-font)" }}>
                        Product pictures, prices, and availability sent directly in chat.
                     </h2>
                     <p className="mt-4 max-w-xl text-white/75">
                        The bot answers only from approved store data, then sends product cards customers can act on.
                     </p>
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                     {[
                        ["WhatsApp", "Connected"],
                        ["AI engine", "Replies ready"],
                        ["Catalog", "128 products"],
                     ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-white/15 bg-white/10 p-4">
                           <p className="text-xs text-white/60">{label}</p>
                           <strong className="mt-1 block text-lg">{value}</strong>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="rounded-[28px] border border-white/15 bg-[#EFE7D8] p-3 shadow-2xl">
                  <div className="rounded-t-[20px] bg-white p-4">
                     <strong className="block text-black">Neha Sharma</strong>
                     <span className="text-sm font-semibold text-emerald-600">Online</span>
                  </div>
                  <div className="space-y-3 p-4">
                     <div className="ml-auto max-w-[82%] rounded-2xl bg-[#DCF8C6] p-3 text-sm text-black">
                        What is available today?
                     </div>
                     <div className="max-w-[86%] rounded-2xl bg-white p-3 text-sm text-black shadow-sm">
                        Here are products currently available in our store.
                     </div>
                     <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2">
                        {previewProducts.map((product) => (
                           <div key={product.name} className="rounded-xl border bg-white p-2 text-black">
                              <div className="grid h-16 place-items-center rounded-lg bg-emerald-50 text-3xl">
                                 {product.emoji}
                              </div>
                              <strong className="mt-2 block text-xs leading-tight">{product.name}</strong>
                              <span className="text-xs text-zinc-500">{product.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
