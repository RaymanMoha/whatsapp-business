import {
   ArrowUpRight,
   CheckCircle2,
   CircleDollarSign,
   MessageCircle,
   ShieldCheck,
   Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { appBaseWhatsappUrl } from "@/components/marketing/pricing-contact";

const advantages = [
   {
      icon: MessageCircle,
      number: "01",
      title: "Sell where Kenya already chats",
      description:
         "Turn WhatsApp product questions into clear recommendations and one combined cart without asking customers to install another app.",
   },
   {
      icon: CircleDollarSign,
      number: "02",
      title: "Start M-Pesa checkout with proof",
      description:
         "Send an STK Push to the customer’s phone and move the order forward only after the verified payment callback arrives.",
   },
   {
      icon: ShieldCheck,
      number: "03",
      title: "Keep every sale accountable",
      description:
         "See the customer, cart, payment, order status and branded receipt together so your team always knows what happens next.",
   },
];

const frequentlyAskedQuestions = [
   {
      question: "What is AppBase?",
      answer:
         "AppBase is a WhatsApp commerce platform for Kenyan businesses. It connects a product catalogue, approved automated replies, combined carts, M-Pesa payment requests, order tracking and receipts in one merchant dashboard.",
   },
   {
      question: "Can customers pay with M-Pesa from a WhatsApp order?",
      answer:
         "Yes. A customer can begin checkout in the WhatsApp conversation, provide their M-Pesa number and receive an STK Push on their phone. AppBase waits for the payment provider’s confirmation before marking the order as paid.",
   },
   {
      question: "Which Kenyan businesses can use AppBase?",
      answer:
         "AppBase is designed for small and growing merchants that already sell through chat, including fashion stores, beauty businesses, food sellers, homeware shops and other catalogue-based businesses.",
   },
   {
      question: "Can I upload my product catalogue from Excel?",
      answer:
         "Yes. Merchants can add products manually or import a catalogue from Excel or CSV, then add product pictures, prices and stock for richer customer replies.",
   },
   {
      question: "How much does AppBase cost in Kenya?",
      answer:
         "The founding merchant programme is KES 4,900 per month plus a KES 7,500 one-time guided setup. The first five stores receive hands-on catalogue and launch support.",
   },
];

export function KenyaCommerceSection() {
   return (
      <section id="kenya" className="border-t border-black/10 bg-[#fefbf4] px-5 pb-0 pt-24 md:pt-32">
         <div className="mx-auto max-w-[1240px]">
            <div data-landing-reveal className="grid gap-10 lg:grid-cols-[1.18fr_.82fr] lg:items-end">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#168243]">
                     WhatsApp commerce for Kenya
                  </p>
                  <h2 className="mt-5 max-w-[760px] text-[clamp(40px,6vw,76px)] font-semibold leading-[.88] tracking-[-0.065em]">
                     <span className="block">Built for how</span>
                     <span className="block whitespace-nowrap">Kenyan businesses</span>
                     <span className="mt-[0.08em] inline-block bg-[#9dff2f] px-[0.08em] pb-[0.035em] pt-[0.01em]">
                        sell today.
                     </span>
                  </h2>
               </div>
               <div className="border-l border-black/15 pl-6">
                  <p className="max-w-md text-[17px] leading-8 text-black/58">
                     Your storefront can live inside the conversation customers already trust, while your team gets the structure of a proper commerce system behind it.
                  </p>
                  <a
                     href={appBaseWhatsappUrl}
                     target="_blank"
                     rel="noreferrer"
                     className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#08742e] transition hover:gap-3">
                     Discuss your WhatsApp store <ArrowUpRight className="size-4" />
                  </a>
               </div>
            </div>

            <div className="mt-16 grid border-y border-black/12 lg:grid-cols-3">
               {advantages.map(({ icon: Icon, number, title, description }) => (
                  <article
                     data-landing-reveal
                     key={number}
                     className="group border-b border-black/12 py-8 last:border-b-0 lg:min-h-[340px] lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0">
                     <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-black/32">{number}</span>
                        <span className="grid size-11 place-items-center rounded-full border border-black/10 bg-[#efffe3] text-[#08742e] transition duration-300 group-hover:bg-[#9dff2f]">
                           <Icon className="size-4" />
                        </span>
                     </div>
                     <h3 className="mt-14 max-w-[290px] text-2xl font-semibold leading-tight tracking-[-0.045em]">
                        {title}
                     </h3>
                     <p className="mt-5 max-w-[310px] text-sm leading-7 text-black/50">{description}</p>
                  </article>
               ))}
            </div>

            <div id="questions" className="mt-24 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
               <div data-landing-reveal className="flex min-h-full flex-col">
                  <span className="grid size-12 place-items-center rounded-full bg-[#07120d] text-[#9dff2f]">
                     <Store className="size-5" />
                  </span>
                  <h2 className="mt-7 max-w-md text-5xl font-semibold leading-[.95] tracking-[-0.06em] md:text-6xl">
                     Questions before you start?
                  </h2>
                  <p className="mt-6 max-w-sm text-sm leading-7 text-black/50">
                     Straight answers for merchants evaluating WhatsApp selling, M-Pesa checkout and assisted commerce.
                  </p>
                  <div className="relative z-10 mt-auto w-full max-w-[390px] pt-10 lg:pt-12">
                     <Image
                        src="/appbase-merchant-guide-closeup.png"
                        alt="AppBase merchant holding a phone and a customer order"
                        width={1159}
                        height={1358}
                        sizes="(max-width: 1023px) 86vw, 390px"
                        className="h-auto w-full object-contain"
                     />
                  </div>
               </div>

               <div data-landing-reveal className="border-t border-black/15">
                  {frequentlyAskedQuestions.map(({ question, answer }, index) => (
                     <details name="appbase-faq" key={question} className="group border-b border-black/15 py-2" open={index === 0}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold tracking-[-0.03em] marker:hidden">
                           <span>{question}</span>
                           <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/12 text-[#08742e] transition group-open:rotate-45 group-open:bg-[#9dff2f]">
                              <ArrowUpRight className="size-3.5" />
                           </span>
                        </summary>
                        <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-black/52">{answer}</p>
                     </details>
                  ))}
                  <div className="flex items-start gap-3 pt-6 text-sm leading-6 text-black/48">
                     <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#08742e]" />
                     <p>
                        Need an answer for your business?{" "}
                        <Link href="#contact" className="font-semibold text-[#08742e] underline decoration-[#9dff2f] decoration-2 underline-offset-4">
                           Talk to the AppBase team.
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
