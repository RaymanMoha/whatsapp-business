import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductCatalogManager } from "@/components/commerce/product-catalog-manager";
import Heading from "@/components/heading";
import { readProducts } from "@/src/product-store";

export default async function ProductsPage() {
   const products = await readProducts();

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Product Catalog"
               description="The approved product list the WhatsApp AI can use when customers ask what is available."
            />
            <ProductCatalogManager initialProducts={products} />
         </div>
      </DashboardLayout>
   );
}
