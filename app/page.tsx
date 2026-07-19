import { WhatsappCommerceLanding } from "@/components/marketing/whatsapp-commerce-landing";
import { siteConfig } from "@/lib/site";

const jsonLd = {
   "@context": "https://schema.org",
   "@graph": [
      {
         "@type": "Organization",
         "@id": siteConfig.url + "/#organization",
         name: siteConfig.name,
         url: siteConfig.url,
         logo: siteConfig.url + "/appbase-logo-green.png",
         email: siteConfig.email,
         areaServed: { "@type": "Country", name: "Kenya" },
         contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: siteConfig.whatsappDisplay,
            email: siteConfig.email,
            areaServed: "KE",
            availableLanguage: ["English"],
         },
      },
      {
         "@type": "SoftwareApplication",
         "@id": siteConfig.url + "/#software",
         name: siteConfig.name,
         url: siteConfig.url,
         description: siteConfig.description,
         applicationCategory: "BusinessApplication",
         operatingSystem: "Web",
         provider: { "@id": siteConfig.url + "/#organization" },
         areaServed: { "@type": "Country", name: "Kenya" },
         offers: {
            "@type": "Offer",
            price: "4900",
            priceCurrency: "KES",
            category: "Founding merchant monthly plan",
         },
         featureList: [
            "WhatsApp product catalogue",
            "Approved automated customer replies",
            "Combined shopping carts",
            "M-Pesa STK Push checkout",
            "Verified payment confirmation",
            "Order tracking and branded receipts",
         ],
      },
   ],
};

export default function HomePage() {
   return (
      <>
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
         />
         <WhatsappCommerceLanding />
      </>
   );
}
