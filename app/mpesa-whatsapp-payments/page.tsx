import type { Metadata } from "next";
import { SearchLandingPage } from "@/components/marketing/search-landing-page";

const description =
   "Start M-Pesa STK Push checkout from a WhatsApp order and wait for verified payment confirmation before creating the paid order and receipt.";

export const metadata: Metadata = {
   title: "M-Pesa Payments for WhatsApp Orders",
   description,
   alternates: { canonical: "/mpesa-whatsapp-payments" },
   openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "AppBase",
      title: "M-Pesa Payments for WhatsApp Orders | AppBase",
      description,
      url: "/mpesa-whatsapp-payments",
   },
   twitter: {
      card: "summary_large_image",
      title: "M-Pesa Payments for WhatsApp Orders | AppBase",
      description,
   },
};

export default function MpesaWhatsAppPaymentsPage() {
   return (
      <SearchLandingPage
         eyebrow="Verified M-Pesa checkout"
         title="A WhatsApp sale is real when the"
         highlight="payment is confirmed."
         introduction="AppBase connects the customer’s WhatsApp cart to an M-Pesa STK Push and records the provider callback, so your team does not have to treat a message saying “sent” as proof of payment."
         proof={[
            "STK Push sent to the customer’s phone",
            "Verified provider callback",
            "Payment linked to the correct cart",
            "Order and receipt created after confirmation",
         ]}
         details={[
            {
               label: "Request",
               title: "Checkout begins from the conversation",
               description: "The customer confirms the combined cart and supplies the M-Pesa number that should receive the payment prompt.",
            },
            {
               label: "Verify",
               title: "Confirmation comes from the payment provider",
               description: "AppBase waits for the callback and records the amount, transaction reference and result instead of guessing from chat text.",
            },
            {
               label: "Fulfil",
               title: "Paid orders move forward with context",
               description: "Your team sees the customer, cart, payment and next fulfilment step together, with a receipt ready to send on WhatsApp.",
            },
         ]}
         processTitle="From cart total to verified payment."
         steps={[
            { title: "Review the cart", description: "The customer sees products, quantities, promotions and the final amount before checkout." },
            { title: "Send the prompt", description: "AppBase requests an M-Pesa STK Push using the customer’s confirmed phone number." },
            { title: "Wait for proof", description: "The order remains unpaid until the official payment callback confirms the transaction." },
            { title: "Release the order", description: "A successful payment unlocks fulfilment, stores the transaction record and creates a branded receipt." },
         ]}
      />
   );
}
