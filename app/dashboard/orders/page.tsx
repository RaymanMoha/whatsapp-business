import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LiveOrders } from "@/components/commerce/live-orders";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listOrderIntents } from "@/src/customer-store";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
   const orders = await listOrderIntents();

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="WhatsApp Orders"
               description="Customer purchase requests collected from WhatsApp conversations."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Live order intent</CardTitle>
               </CardHeader>
               <CardContent>
                  <LiveOrders initialOrders={orders} />
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
