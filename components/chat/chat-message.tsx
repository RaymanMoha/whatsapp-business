import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { useThreads } from "@/lib/chat-store";
import { updateMessageMeta } from "@/lib/chat-store";
import { useToast } from "@/components/ui/use-toast";
import {
   TooltipProvider,
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from "@/components/ui/tooltip";
import { ThumbsUp, ThumbsDown, Copy, RefreshCcw } from "lucide-react";
import AI from "@/public/ai-logo.svg";
import Image from "next/image";

export function ChatBubble({
   message,
   threadId,
}: {
   message: ChatMessage;
   threadId: string;
}) {
   const isUser = message.role === "user";
   const { update } = useThreads();
   const liked = message.meta?.liked ?? null;
   const { toast } = useToast();

   async function handleCopy() {
      try {
         await navigator.clipboard.writeText(message.content);
      } catch {}
   }

   return (
      <div
         className={cn(
            "flex w-full gap-3",
            isUser ? "justify-end" : "justify-start"
         )}>
         {!isUser && (
            <Avatar className="mt-1 h-10 w-10">
               <AvatarFallback className="bg-[#E0B5FF] text-emerald-900 font-bold">
                  <Image src={AI.src} alt="AI" width={20} height={20} />
               </AvatarFallback>
            </Avatar>
         )}
         <div
            className={cn(
               "max-w-4xl rounded-sm px-4 py-4 text-sm",
               isUser
                  ? "bg-[#D7DEDD] text-foreground animate-chat-in-right py-2"
                  : "bg-card text-foreground animate-chat-in-left"
            )}>
            {message.content}
            {!isUser && (
               <div className="mt-2 flex items-center gap-3 text-muted-foreground">
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <button
                              aria-label="Like"
                              onClick={() =>
                                 update((prev) =>
                                    updateMessageMeta(
                                       prev,
                                       threadId,
                                       message.id,
                                       { liked: liked === "up" ? null : "up" }
                                    )
                                 )
                              }
                              className={cn(
                                 "transition-colors",
                                 liked === "up" && "text-foreground"
                              )}>
                              <ThumbsUp className="size-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>Like</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <button
                              aria-label="Dislike"
                              onClick={() =>
                                 update((prev) =>
                                    updateMessageMeta(
                                       prev,
                                       threadId,
                                       message.id,
                                       {
                                          liked:
                                             liked === "down" ? null : "down",
                                       }
                                    )
                                 )
                              }
                              className={cn(
                                 "transition-colors",
                                 liked === "down" && "text-foreground"
                              )}>
                              <ThumbsDown className="size-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>Dislike</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <button
                              aria-label="Copy"
                              onClick={async () => {
                                 await handleCopy();
                                 toast({ description: "Copied to clipboard", variant: "success" });
                              }}>
                              <Copy className="size-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <button
                              aria-label="Regenerate"
                              onClick={() => {
                                 /* reserved */
                              }}>
                              <RefreshCcw className="size-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>Regenerate</TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </div>
            )}
         </div>
         {/* {isUser && (
            <Avatar className="mt-1 h-10 w-10">
               <AvatarFallback className="bg-muted text-foreground">
                  You
               </AvatarFallback>
            </Avatar>
         )} */}
      </div>
   );
}
