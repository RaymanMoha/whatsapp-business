const fallbackUrl = "https://whatsapp-business-psi.vercel.app";

export const siteConfig = {
   name: "AppBase",
   title: "AppBase Kenya | WhatsApp Commerce with M-Pesa",
   description:
      "AppBase helps Kenyan businesses sell on WhatsApp with product catalogues, approved AI replies, combined carts, M-Pesa checkout, verified payments, orders and branded receipts.",
   url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, ""),
   email: "abdulmoharayman@gmail.com",
   whatsappDisplay: "+254 703 757 813",
   whatsappNumber: "254703757813",
} as const;

export const siteUrl = new URL(siteConfig.url);
