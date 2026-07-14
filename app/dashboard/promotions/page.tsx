import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PromotionManager } from "@/components/commerce/promotion-manager";
import Heading from "@/components/heading";
import { readProducts } from "@/src/product-store";
import { readPromotions } from "@/src/promotion-store";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
   const [promotions, products] = await Promise.all([readPromotions(), readProducts()]);

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <div className="pl-9 sm:pl-0">
               <Heading
                  title="Promotions"
                  description="Create offers that are applied automatically to eligible WhatsApp carts and recorded on every payment, order, and receipt."
               />
            </div>
            <PromotionManager initialPromotions={promotions} products={products} />
         </div>
      </DashboardLayout>
   );
}
