"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AI from "@/public/ai-logo.svg";
import Image from "next/image";
import { ASK_ANYTHING_LABEL } from "@/constants";

export function AskAnything() {
   const router = useRouter();
   return (
      <div className="fixed bottom-6 right-6">
         <Button
            className="rounded-full shadow-lg bg-[#E0B5FF] hover:bg-[#C380FF]flex items-center py-4"
            variant="secondary"
            onClick={() => router.push("/dashboard/chat")}>
            <Image src={AI.src} alt="AI" width={20} height={20} />
            {ASK_ANYTHING_LABEL}
         </Button>
      </div>
   );
}
