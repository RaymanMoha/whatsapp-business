import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import Image from "next/image";
import Iframe from "@/public/iframe.png";

export default function IndustryVsDentsuPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Industry vs Dentsu"
            description="Content coming soon."
         />
         <div className=" w-full relative flex h-full">
            <Image
               src={Iframe.src}
               alt="Disruptor iframe"
               fill
               style={{ objectFit: "contain" }}
            />
         </div>
      </DashboardLayout>
   );
}
