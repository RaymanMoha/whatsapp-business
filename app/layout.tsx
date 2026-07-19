import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProviderInternal } from "@/components/ui/use-toast";
import { ThemeScript } from "@/components/theme-script";
import { siteConfig, siteUrl } from "@/lib/site";

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
   metadataBase: siteUrl,
   applicationName: siteConfig.name,
   title: {
      default: siteConfig.title,
      template: "%s | AppBase",
   },
   description: siteConfig.description,
   keywords: [
      "WhatsApp commerce Kenya",
      "WhatsApp business automation Kenya",
      "M-Pesa WhatsApp payments",
      "WhatsApp product catalogue Kenya",
      "AI sales assistant Kenya",
      "online selling platform Kenya",
      "WhatsApp order management",
   ],
   authors: [{ name: "AppBase", url: siteConfig.url }],
   creator: "AppBase",
   publisher: "AppBase",
   category: "business",
   alternates: { canonical: "/" },
   openGraph: {
      type: "website",
      locale: "en_KE",
      url: "/",
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
   },
   twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
   },
   robots: {
      index: true,
      follow: true,
      googleBot: {
         index: true,
         follow: true,
         "max-image-preview": "large",
         "max-snippet": -1,
         "max-video-preview": -1,
      },
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en-KE">
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
