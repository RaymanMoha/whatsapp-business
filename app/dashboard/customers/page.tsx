import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LiveCustomers } from "@/components/commerce/live-customers";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="Customers"
               description="Customer profiles and WhatsApp conversation history from live WAHA messages."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Live WhatsApp customers</CardTitle>
               </CardHeader>
               <CardContent>
                  <LiveCustomers />
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
