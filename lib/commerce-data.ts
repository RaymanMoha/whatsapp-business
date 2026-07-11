import { approvedKnowledge, businessProfile } from "@/src/knowledge";
import { products, recentQuestions } from "@/src/catalog";

export type CommerceProduct = {
   id: string;
   name: string;
   subtitle: string;
   category: string;
   price: number;
   stock: number;
   available: boolean;
   accent: string;
   emoji: string;
};

export type CustomerQuestion = {
   id: string;
   customer: string;
   time: string;
   question: string;
   status: string;
};

export const commerceProducts = products as CommerceProduct[];
export const commerceQuestions = recentQuestions as CustomerQuestion[];
export const commerceBusinessProfile = businessProfile;
export const commerceApprovedKnowledge = approvedKnowledge;

export function formatPrice(price: number) {
   return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
   }).format(price);
}

export function availableProducts() {
   return commerceProducts.filter((product) => product.available);
}

export function commerceStats() {
   const available = availableProducts().length;
   const total = commerceProducts.length;
   const missed = commerceQuestions.filter((question) =>
      question.status.toLowerCase().includes("missed"),
   ).length;

   return {
      available,
      total,
      stock: commerceProducts.reduce((sum, product) => sum + product.stock, 0),
      questions: commerceQuestions.length,
      missed,
      replyRate: commerceQuestions.length
         ? Math.round(((commerceQuestions.length - missed) / commerceQuestions.length) * 100)
         : 100,
   };
}
