import type { Metadata } from "next";
import { SearchLandingPage } from "@/components/marketing/search-landing-page";

const description =
   "Sell through WhatsApp in Kenya with rich product catalogues, approved automated replies, combined carts, M-Pesa checkout, order tracking and receipts.";

export const metadata: Metadata = {
   title: "WhatsApp Commerce for Kenyan Businesses",
   description,
   alternates: { canonical: "/whatsapp-commerce-kenya" },
   openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "AppBase",
      title: "WhatsApp Commerce for Kenyan Businesses | AppBase",
      description,
      url: "/whatsapp-commerce-kenya",
   },
   twitter: {
      card: "summary_large_image",
      title: "WhatsApp Commerce for Kenyan Businesses | AppBase",
      description,
   },
};

export default function WhatsAppCommerceKenyaPage() {
   return (
      <SearchLandingPage
         eyebrow="WhatsApp commerce in Kenya"
         title="Turn customer conversations into"
         highlight="complete sales."
         introduction="AppBase gives Kenyan merchants a structured way to show products, build carts, collect M-Pesa payments and fulfil orders while the customer continues using WhatsApp."
         proof={[
            "No new shopping app for customers",
            "Built around M-Pesa checkout",
            "Designed for growing Kenyan merchants",
            "Merchant-controlled product and reply data",
         ]}
         details={[
            {
               label: "Discover",
               title: "A better product experience inside chat",
               description: "Share real product pictures, prices, descriptions and stock so customers can decide without receiving a messy list of links.",
            },
            {
               label: "Convert",
               title: "One combined cart, even across several messages",
               description: "Keep the customer’s selected products and quantities together, then present a clear total before payment begins.",
            },
            {
               label: "Operate",
               title: "A dashboard your team can actually run",
               description: "Manage questions, products, payments, orders, promotions and receipts from one connected merchant workspace.",
            },
         ]}
         processTitle="One sales flow from message to receipt."
         steps={[
            { title: "Customer asks", description: "A shopper asks about availability, price, size, colour or another approved product detail on WhatsApp." },
            { title: "AppBase assists", description: "The assistant uses the merchant catalogue and approved business information to answer and build the cart." },
            { title: "Customer pays", description: "Checkout starts from the conversation and an M-Pesa STK Push is sent to the customer’s phone." },
            { title: "Merchant fulfils", description: "After verified payment, the order appears in the dashboard and a branded receipt can be shared." },
         ]}
      />
   );
}
