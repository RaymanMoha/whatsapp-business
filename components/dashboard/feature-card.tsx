import Link from "next/link";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CTA_GET_INSIGHTS } from "@/constants";
import type { Feature } from "@/types";

export function FeatureCard({ feature }: { feature: Feature }) {
   const newLocal =
      "h-full border-0 shadow-none border-r border-r-zinc-400 rounded-none last:border-0 animate-chat-in-left bg-transparent";
   return (
      <Card className={newLocal + " text-black dark:text-black"}>
         <CardHeader className="px-0 pr-4 pb-3 pt-0">
            <CardTitle className="pb-4 text-black dark:text-black">{feature.title}</CardTitle>
            <CardDescription className="text-black dark:text-black">
               {feature.description}
            </CardDescription>
         </CardHeader>
         <CardContent className="px-0 pt-0 pb-0">
            <Button
               asChild
               variant="link"
               className="px-0 font-bold text-emerald-800 dark:text-emerald-400">
               <Link href={feature.href} className="!px-0">
                  {CTA_GET_INSIGHTS} <ArrowRight height={18} width={18} />
               </Link>
            </Button>
         </CardContent>
      </Card>
   );
}
