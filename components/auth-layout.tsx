import type React from "react";
import Image from "next/image";
import Bg from "@/public/auth-commerce-ai.webp";
import Logo from "@/public/whatsapp-commerce-logo.svg";
import ParternBg from "@/public/pattern-bg.png";

interface AuthLayoutProps {
   children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
   return (
      <div className="relative min-h-screen bg-black flex p-4">
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
            sizes="100vw"
            priority
         />
         {/* Left side - Hero Image */}
         <div className="hidden lg:flex lg:w-1/2 relative">
            <div className="relative w-full h-full rounded-[30px] overflow-hidden">
               <Image
                  src={Bg.src}
                  alt="AI WhatsApp commerce conversation helping a customer choose a product"
                  fill
                  className="object-cover rounded-r-3xl"
                  priority
                  sizes="50vw"
               />
               {/* Overlay content */}
               <div className="absolute inset-0 bg-gradient-to-bl from-black/70 via-transparent to-black/90 rounded-r-3xl" />
               <div className="absolute top-8 left-8">
                  <Image
                     src={Logo.src}
                     alt="WhatsApp Commerce Hub logo"
                     width={150}
                     height={41}
                     className="object-contain"
                     priority
                  />
               </div>
               <div className="absolute bottom-8 left-8 right-8">
                  <h2
                     className="text-white text-[54px] leading-[0.95] mb-3 tracking-[-0.03em]"
                     style={{ fontFamily: "var(--calson-font)" }}>
                     Sell through{" "}
                     <span
                        className="text-emerald-400 "
                        style={{ fontFamily: "var(--secondary-font)" }}>
                        WhatsApp{" "}
                     </span>
                     with
                  </h2>
                  <p
                     className="text-[54px] leading-[0.95] text-white tracking-[-0.03em]"
                     style={{ fontFamily: "var(--calson-font)" }}>
                     <span
                        className="text-emerald-400 "
                        style={{ fontFamily: "var(--secondary-font)" }}>
                        AI
                     </span>{" "}
                     that knows your products.
                  </p>
               </div>
            </div>
         </div>

         {/* Right side - Form */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md z-10 relative">{children}</div>
         </div>
      </div>
   );
}
