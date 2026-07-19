import {
   ArrowRight,
   Check,
   Mail,
   MessageCircle,
   ReceiptText,
   ShieldCheck,
   ShoppingBag,
   Sparkles,
   WalletCards,
} from "lucide-react";
import Image from "next/image";

const whatsappNumber = "254703757813";
const whatsappMessage = encodeURIComponent(
   "Hi AppBase, I would like to see the merchant demo.",
);

export const appBaseWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
export const appBaseEmailUrl =
   "mailto:abdulmoharayman@gmail.com?subject=AppBase%20founding%20merchant%20programme";

const planFeatures = [
   { icon: ShoppingBag, label: "One WhatsApp storefront with up to 100 products" },
   { icon: Sparkles, label: "300 automated customer conversations each month" },
   { icon: WalletCards, label: "Combined carts, promotions and M-Pesa checkout" },
   { icon: ReceiptText, label: "Verified payments, orders and branded receipts" },
   { icon: ShieldCheck, label: "Guided setup, catalogue support and monthly check-in" },
];

export function PricingSection() {
   return (
      <section id="pricing" className="border-t border-black/10 bg-[#f6f4ed] px-5 pb-0 pt-24 md:pt-32">
         <div className="mx-auto max-w-[1240px]">
            <div data-landing-reveal className="grid gap-8 border-b border-black/12 pb-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
               <h2 className="max-w-[800px] text-[clamp(52px,7vw,96px)] font-semibold leading-[.9] tracking-[-0.07em]">
                  Start small.<br />Prove the sales.<br />
                  <span className="inline-block bg-[#9dff2f] px-[0.045em] text-[#07120d]">Then scale.</span>
               </h2>
               <div className="max-w-lg border-l border-black/15 pl-6 lg:justify-self-end">
                  <p className="text-[17px] leading-8 text-black/58">
                     We are onboarding a small first group of Kenyan merchants personally, so every store launches with a working catalogue, payment flow and order process.
                  </p>
               </div>
            </div>

            <div data-landing-reveal className="grid border-b border-black/12 lg:grid-cols-[.72fr_1.28fr]">
               <div className="relative flex min-h-[720px] flex-col justify-between overflow-hidden border-b border-black/12 bg-[#fbf2e3] px-5 py-10 lg:min-h-[800px] lg:border-b-0 lg:border-r lg:px-8 lg:py-14">
                  <div className="relative z-10">
                     <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#168243]">Founding merchant programme</p>
                     <p className="mt-7 max-w-sm text-2xl font-semibold leading-tight tracking-[-0.04em]">
                        A managed launch for the first five stores—not a dashboard you are left to configure alone.
                     </p>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[155px] lg:top-[150px]">
                     <Image
                        src="/appbase-founding-merchant.png"
                        alt="AppBase merchant holding a phone and a prepared customer parcel"
                        fill
                        className="object-cover object-[50%_70%]"
                        sizes="(min-width: 1024px) 470px, 100vw"
                     />
                  </div>

                  <div className="relative z-10 mt-12 flex w-fit items-center gap-3 rounded-full bg-[#fbf2e3]/90 py-2 pr-4 text-sm font-semibold text-black/58 backdrop-blur-sm">
                     <span className="grid size-9 place-items-center rounded-full bg-[#dff7e5] text-[#168243]"><Check className="size-4" /></span>
                     Five onboarding places available
                  </div>
               </div>

               <div className="py-10 lg:py-14 lg:pl-12">
                  <div className="flex flex-col gap-8 border-b border-black/12 pb-10 sm:flex-row sm:items-end sm:justify-between">
                     <div>
                        <p className="text-sm font-semibold text-black/45">Launch price</p>
                        <div className="mt-2 flex items-end gap-3">
                           <span className="text-[clamp(64px,8vw,104px)] font-semibold leading-none tracking-[-0.075em]">4,900</span>
                           <span className="pb-2 text-sm font-semibold text-black/45">KES / month</span>
                        </div>
                        <p className="mt-3 text-sm text-black/48">Plus KES 7,500 one-time guided setup</p>
                     </div>
                     <a
                        href={appBaseWhatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#07120d] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_38px_rgba(0,0,0,.14)] transition hover:-translate-y-0.5 hover:bg-black">
                        Reserve a pilot place
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                     </a>
                  </div>

                  <div className="divide-y divide-black/10">
                     {planFeatures.map(({ icon: Icon, label }) => (
                        <div key={label} className="grid grid-cols-[42px_1fr] items-center gap-4 py-5">
                           <span className="grid size-[42px] place-items-center rounded-full border border-black/10 bg-white/45 text-[#168243]">
                              <Icon className="size-4" />
                           </span>
                           <p className="text-[15px] font-semibold leading-6 tracking-[-0.02em] text-black/72">{label}</p>
                        </div>
                     ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 text-[12px] leading-5 text-black/42 sm:flex-row sm:items-center sm:justify-between">
                     <p>Founding rate is locked for your first six months.</p>
                     <p>Higher-volume usage is agreed before billing—no surprise charges.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export function ContactSection() {
   return (
      <section id="contact" className="relative overflow-hidden bg-[#9dff2f] px-5 py-20 md:py-28">
         <div className="pointer-events-none absolute -right-32 -top-44 size-[520px] rounded-full border border-black/10" />
         <div className="pointer-events-none absolute -right-16 -top-24 size-[340px] rounded-full border border-black/10" />
         <div data-landing-reveal className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
               <h2 className="max-w-[780px] text-[clamp(58px,8vw,112px)] font-semibold leading-[.84] tracking-[-0.075em]">
                  Let&apos;s turn your next chat into an order.
               </h2>
               <p className="mt-8 max-w-xl text-[17px] leading-8 text-black/62">
                  Tell us what you sell and how customers currently order. We will show you the shortest path to a working AppBase pilot.
               </p>
            </div>

            <div className="border-t border-black/25 lg:border-l lg:border-t-0 lg:pl-10">
               <a
                  href={appBaseWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 border-b border-black/20 py-7 transition hover:pl-2">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#07120d] text-white"><MessageCircle className="size-5" /></span>
                  <span className="min-w-0 flex-1">
                     <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-black/48">Chat on WhatsApp</span>
                     <span className="mt-1 block text-xl font-semibold tracking-[-0.035em]">+254 703 757 813</span>
                  </span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
               </a>
               <a
                  href={appBaseEmailUrl}
                  className="group flex items-center gap-5 border-b border-black/20 py-7 transition hover:pl-2">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-black/25 text-black"><Mail className="size-5" /></span>
                  <span className="min-w-0 flex-1">
                     <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-black/48">Send an email</span>
                     <span className="mt-1 block break-all text-lg font-semibold tracking-[-0.03em] sm:text-xl">abdulmoharayman@gmail.com</span>
                  </span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
               </a>
               <div className="flex items-start gap-3 pt-6 text-sm leading-6 text-black/58">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <p>No card required. We first confirm that AppBase fits your business and current order process.</p>
               </div>
            </div>
         </div>
      </section>
   );
}
