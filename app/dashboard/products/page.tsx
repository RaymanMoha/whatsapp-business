import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductCatalogManager } from "@/components/commerce/product-catalog-manager";
import Heading from "@/components/heading";
import { readProducts } from "@/src/product-store";
import { readPromotions } from "@/src/promotion-store";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
   const [products, promotions] = await Promise.all([readProducts(), readPromotions()]);

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <div className="pl-9 sm:pl-0">
               <Heading
                  title="Product Catalog"
                  description="The approved product list the WhatsApp AI can use when customers ask what is available."
               />
            </div>
            <ProductCatalogManager initialProducts={products} initialPromotions={promotions} />
         </div>
      </DashboardLayout>
   );
}
