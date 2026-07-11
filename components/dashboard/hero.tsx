"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, PackagePlus } from "lucide-react";
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
         <div>
            <h1
               className="font-calson-font text-2xl md:text-4xl font-semibold heading-1 tracking-wider"
               style={{ fontFamily: "var(--calson-font)" }}>
               {HERO_TITLE}
            </h1>
            <p className="mt-2 text-black text-md max-w-3xl">{HERO_SUBTITLE}</p>
         </div>

         <div className="flex gap-4 mb-6">
            <Link href="/dashboard/products">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                  <PackagePlus className="size-4" />
                  Add products
               </Button>
            </Link>
            <Link href="/dashboard/bot-settings">
               <Button variant="outline" className="px-6 py-3 rounded-lg flex items-center gap-2">
                  <BookOpen className="size-4" />
                  Configure bot
               </Button>
            </Link>
         </div>

         <div className="relative overflow-hidden rounded-2xl border bg-[#003F37] animate-chat-in-right">
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
                        ["WAHA", "Connected"],
                        ["Groq", "AI replies ready"],
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
