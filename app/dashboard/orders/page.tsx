import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { commerceQuestions } from "@/lib/commerce-data";

export default function OrdersPage() {
   return (
      <DashboardLayout>
         <div className="space-y-6">
            <Heading
               title="WhatsApp Orders"
               description="Customer purchase requests collected from WhatsApp conversations."
            />
            <Card className="text-black dark:text-black">
               <CardHeader>
                  <CardTitle>Recent order intent</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {commerceQuestions.map((question) => (
                     <div key={question.id} className="grid grid-cols-4 rounded-xl border p-4 text-sm">
                        <strong>{question.customer}</strong>
                        <span>{question.question}</span>
                        <span>{question.status}</span>
                        <span>{question.time}</span>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
}
