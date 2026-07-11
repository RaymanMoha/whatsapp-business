import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProviderInternal } from "@/components/ui/use-toast";
import { ThemeScript } from "@/components/theme-script";

const spaceGrotesk = Space_Grotesk({
   variable: "--font-geist-sans",
   weight: "variable",
   display: "swap",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "WhatsApp Commerce Hub",
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
            className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased font-sans`}>
            <ThemeScript />
            <ToastProviderInternal>
               {children}
               <Toaster />
            </ToastProviderInternal>
         </body>
      </html>
   );
}
