import type { Feature, NavGroup } from "@/types";

export const features: Feature[] = [
   {
      title: "Product Catalog",
      description:
         "Add products, prices, stock, availability, and pictures that the WhatsApp AI is allowed to show customers.",
      href: "/dashboard/products",
   },
   {
      title: "WhatsApp Orders",
      description:
         "Track customer requests, delivery details, payment status, and the next action needed before fulfillment.",
      href: "/dashboard/orders",
   },
   {
      title: "Customer Questions",
      description:
         "Review what shoppers asked, which answers were handled by AI, and which questions need better approved info.",
      href: "/dashboard/questions",
   },
   {
      title: "Bot Settings",
      description:
         "Control business profile, handoff message, group replies, catalog sync, and safe AI response rules.",
      href: "/dashboard/bot-settings",
   },
];

export const navGroups: NavGroup[] = [
   { id: "home", label: "Overview", href: "/dashboard" },
   {
      id: "commerce",
      label: "WhatsApp Commerce",
      items: [
         { label: "Product Catalog", href: "/dashboard/products" },
         { label: "Orders", href: "/dashboard/orders" },
         { label: "M-Pesa Payments", href: "/dashboard/payments" },
         { label: "Customer Questions", href: "/dashboard/questions" },
         { label: "Customers", href: "/dashboard/customers" },
      ],
   },
   {
      id: "automation",
      label: "AI Automation",
      items: [
         { label: "Bot Settings", href: "/dashboard/bot-settings" },
         { label: "Approved Knowledge", href: "/dashboard/knowledge" },
         { label: "WAHA Session", href: "/dashboard/session" },
         { label: "Message Templates", href: "/dashboard/templates" },
      ],
   },
   {
      id: "insights",
      label: "Insights",
      items: [
         { label: "Missed Questions", href: "/dashboard/questions" },
         { label: "Popular Products", href: "/dashboard/products" },
         { label: "AI Reply Quality", href: "/dashboard/bot-settings" },
      ],
   },
   {
      id: "account",
      label: "Account",
      items: [
         { label: "Profile", href: "/dashboard/profile" },
         { label: "Settings", href: "/dashboard/settings" },
      ],
   },
   { id: "ask-anything", label: "Ask Commerce AI", href: "/dashboard/chat" },
];

// Convenience re-exports for constants defined in other modules
export { sampleThreads } from "@/lib/chat-samples";

export const HERO_TITLE = "WhatsApp Commerce Hub";
export const HERO_SUBTITLE =
   "Manage product pictures, availability, customer questions, and AI replies for a WhatsApp storefront powered by WAHA and Groq.";

export const CTA_GET_INSIGHTS = "Open section";

export const LABEL_MAIN_MENU = "Commerce Menu";
export const LABEL_COMING_SOON = "Coming soon";
export const LABEL_CHAT_HISTORY = "Chat History";
export const LABEL_NO_CHATS_YET = "No chats yet";
export const BTN_UNDO = "Undo";
export const BTN_NEW_CHAT = "New chat";
export const LINK_BACK_TO_HOME = "Back to Home";
export const ASK_ANYTHING_LABEL = "Ask Commerce AI";
export const CHAT_EMPTY_PROMPT = `Ask about product data,
customer replies, stock,
orders, or bot setup.`;

export const PLACEHOLDER_SEARCH = "Search commerce";
export const ARIA_SEARCH_NAV = "Search commerce navigation";
export const ARIA_SEARCH_CHATS = "Search chats";
