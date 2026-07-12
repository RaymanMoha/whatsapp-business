import { approvedKnowledge, businessProfile } from "@/src/knowledge";
import { products } from "@/src/catalog";

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

export const commerceProducts = products as CommerceProduct[];
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
   return {
      available,
      total,
      stock: commerceProducts.reduce((sum, product) => sum + product.stock, 0),
   };
}
