import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProviderInternal } from "@/components/ui/use-toast";
import { ThemeScript } from "@/components/theme-script";

const bricolageGrotesque = Bricolage_Grotesque({
   variable: "--font-bricolage-grotesque",
   display: "swap",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "AppBase — WhatsApp commerce for growing businesses",
   description: "Dashboard for managing WhatsApp products, orders, customer questions, and AI bot settings.",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${bricolageGrotesque.className} ${bricolageGrotesque.variable} ${geistMono.variable} antialiased`}>
            <ThemeScript />
            <ToastProviderInternal>
               {children}
               <Toaster />
            </ToastProviderInternal>
         </body>
      </html>
   );
}
