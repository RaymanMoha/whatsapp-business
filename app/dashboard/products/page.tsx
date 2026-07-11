import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { commerceProducts, formatPrice } from "@/lib/commerce-data";

export default function ProductsPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Product Catalog"
               description="The approved product list the WhatsApp AI can use when customers ask what is available."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Available products</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="overflow-hidden rounded-xl border">
                     <div className="grid grid-cols-5 bg-zinc-50 px-4 py-3 text-sm font-bold">
                        <span>Product</span><span>Category</span><span>Status</span><span>Stock</span><span>Price</span>
                     </div>
                     {commerceProducts.map((product) => (
                        <div key={product.id} className="grid grid-cols-5 border-t px-4 py-4 text-sm">
                           <span>{product.emoji} {product.name}</span>
                           <span>{product.category}</span>
                           <span>{product.available ? "Available" : "Sold out"}</span>
                           <span>{product.stock}</span>
                           <span>{formatPrice(product.price)}</span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
