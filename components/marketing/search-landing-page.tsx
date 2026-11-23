import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { appBaseWhatsappUrl } from "@/components/marketing/pricing-contact";

type Detail = {
   label: string;
   title: string;
   description: string;
};

type Step = {
   title: string;
   description: string;
};

type SearchLandingPageProps = {
   eyebrow: string;
   title: string;
   highlight: string;
   introduction: string;
   proof: string[];
   details: Detail[];
   processTitle: string;
   steps: Step[];
};

export function SearchLandingPage({
   eyebrow,
   title,
   highlight,
   introduction,
   proof,
   details,
   processTitle,
   steps,
}: SearchLandingPageProps) {
   return (
      <main className="min-h-screen bg-[#f6f4ed] text-[#07120d] selection:bg-[#9dff2f]">
         <header className="border-b border-black/10">
            <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5">
               <Link href="/" aria-label="Return to AppBase home">
                  <BrandLogo variant="green" priority className="h-12 w-auto" sizes="88px" />
               </Link>
               <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-black/58 transition hover:text-black">
                  <ArrowLeft className="size-4" /> Home
               </Link>
            </nav>
         </header>

         <section className="px-5 pb-24 pt-20 md:pb-32 md:pt-28">
            <div className="mx-auto max-w-[1240px]">
               <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#168243]">{eyebrow}</p>
               <h1 className="mt-6 max-w-[1040px] text-[clamp(58px,8vw,116px)] font-semibold leading-[.86] tracking-[-0.075em]">
                  {title} <span className="inline-block bg-[#9dff2f] px-[0.045em]">{highlight}</span>
               </h1>
               <div className="mt-12 grid gap-10 border-t border-black/12 pt-8 lg:grid-cols-[1.15fr_.85fr]">
                  <p className="max-w-2xl text-xl leading-9 text-black/60">{introduction}</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                     {proof.map((item) => (
                        <p key={item} className="flex items-center gap-3 text-sm font-semibold text-black/62">
                           <CheckCircle2 className="size-4 shrink-0 text-[#08742e]" /> {item}
                        </p>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section className="bg-[#07120d] px-5 py-24 text-white md:py-32">
            <div className="mx-auto max-w-[1240px]">
               <div className="grid border-y border-white/12 lg:grid-cols-3">
                  {details.map(({ label, title: detailTitle, description }) => (
                     <article key={label} className="border-b border-white/12 py-9 lg:min-h-[330px] lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0">
                        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9dff2f]">{label}</p>
                        <h2 className="mt-14 max-w-xs text-3xl font-semibold leading-tight tracking-[-0.045em]">{detailTitle}</h2>
                        <p className="mt-5 max-w-sm text-sm leading-7 text-white/52">{description}</p>
                     </article>
                  ))}
               </div>
            </div>
         </section>

         <section className="px-5 py-24 md:py-32">
            <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.7fr_1.3fr]">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#168243]">How it works</p>
                  <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[.93] tracking-[-0.06em] md:text-6xl">{processTitle}</h2>
               </div>
               <ol className="border-t border-black/15">
                  {steps.map(({ title: stepTitle, description }, index) => (
                     <li key={stepTitle} className="grid gap-4 border-b border-black/15 py-7 sm:grid-cols-[48px_.7fr_1.3fr] sm:items-start">
                        <span className="text-sm font-semibold text-[#168243]">{String(index + 1).padStart(2, "0")}</span>
                        <h3 className="text-lg font-semibold tracking-[-0.03em]">{stepTitle}</h3>
                        <p className="text-sm leading-7 text-black/50">{description}</p>
                     </li>
                  ))}
               </ol>
            </div>
         </section>

         <section className="bg-[#9dff2f] px-5 py-20">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-black/52">Founding merchant programme</p>
                  <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.92] tracking-[-0.06em] md:text-7xl">Bring your current sales process. We will help connect it.</h2>
               </div>
               <a
                  href={appBaseWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#07120d] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_38px_rgba(0,0,0,.14)]">
                  Talk to AppBase <ArrowRight className="size-4" />
               </a>
            </div>
         </section>

         <footer className="bg-[#020806] px-5 py-8 text-white">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-3 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
               <p>© 2026 AppBase · Built in Kenya</p>
               <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <Link href="/whatsapp-commerce-kenya">WhatsApp commerce</Link>
                  <Link href="/mpesa-whatsapp-payments">M-Pesa payments</Link>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
               </div>
            </div>
         </footer>
      </main>
   );
}
