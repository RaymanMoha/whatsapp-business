import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LiveOrders } from "@/components/commerce/live-orders";
import Heading from "@/components/heading";
import { listOrders } from "@/src/order-store";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
   const orders = await listOrders();

   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="WhatsApp Orders"
               description="Paid orders moving from confirmation through preparation and completion."
            />
            <LiveOrders initialOrders={orders} />
         </div>
      </DashboardLayout>
   );
}
