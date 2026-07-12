"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./chat-message";
import { ChatComposer } from "./chat-composer";
import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import {
   useThreads,
   appendMessage,
   getAssistantReply,
} from "@/lib/chat-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { LINK_BACK_TO_HOME, BTN_NEW_CHAT } from "@/constants";

export function ChatView({ threadId }: { threadId: string }) {
   const { threads, update, newThread } = useThreads();
   const router = useRouter();
   const thread = React.useMemo(
      () => threads.find((t) => t.id === threadId),
      [threads, threadId]
   );
   const viewportRef = React.useRef<HTMLDivElement>(null);

   React.useEffect(() => {
      // scroll to bottom on thread change
      viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
   }, [threadId]);

   React.useEffect(() => {
      // autoscroll as messages arrive
      const id = setTimeout(() => {
         viewportRef.current?.scrollTo({
            top: viewportRef.current.scrollHeight,
            behavior: "smooth",
         });
      }, 0);
      return () => clearTimeout(id);
   }, [thread?.messages.length]);

   async function handleSend(text: string) {
      // Add user message immediately
      update((prev) =>
         appendMessage(prev, threadId, { role: "user", content: text })
      );
      
      // Add a temporary "thinking" message
      const thinkingId = crypto.randomUUID();
      update((prev) =>
         appendMessage(prev, threadId, { 
            role: "assistant", 
            content: "🤔 Thinking...",
            meta: { isTemporary: true, tempId: thinkingId }
         })
      );

      try {
         // Get real AI response
         const assistantResponse = await getAssistantReply(text);
         
         // Replace the thinking message with the actual response
         update((prev) => {
            return prev.map((thread) => {
               if (thread.id !== threadId) return thread;
               
               const messages = thread.messages.map((msg) => {
                  if (msg.meta?.tempId === thinkingId) {
                     return {
                        ...msg,
                        content: assistantResponse,
                        meta: { ...msg.meta, isTemporary: false }
                     };
                  }
                  return msg;
               });
               
               return { ...thread, messages, updatedAt: new Date().toISOString() };
            });
         });
      } catch (error) {
         console.error('Error getting AI response:', error);
         // Replace thinking message with error message
         update((prev) => {
            return prev.map((thread) => {
               if (thread.id !== threadId) return thread;
               
               const messages = thread.messages.map((msg) => {
                  if (msg.meta?.tempId === thinkingId) {
                     return {
                        ...msg,
                        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                        meta: { ...msg.meta, isTemporary: false, isError: true }
                     };
                  }
                  return msg;
               });
               
               return { ...thread, messages, updatedAt: new Date().toISOString() };
            });
         });
      }
   }

   if (!thread) return null;

   return (
      <div className="mx-auto w-full">
         <div className="sticky top-0 z-10 -mt-2 mb-2 flex items-center gap-6 rounded-b-xl pb-6">
            <Link
               href="/dashboard"
               className="inline-flex items-center gap-2 text-xl font-bold text-emerald-900">
               <ArrowLeft className="size-6" /> {LINK_BACK_TO_HOME}
            </Link>
            <Button
               variant="secondary"
               onClick={() => {
                  const t = newThread();
                  router.push(`/dashboard/chat/${t.id}`);
               }}
               className="rounded-full bg-primary hover:bg-primary/90 transition-colors text-white px-8 py-4">
               <Plus className="mr-1 size-4" /> {BTN_NEW_CHAT}
            </Button>
         </div>
         <div
            className={`rounded-2xl ${
               thread.messages.length === 0
                  ? "flex flex-col justify-end h-[60vh] max-w-3xl mx-auto"
                  : "h-[75vh]"
            }`}>
            <ScrollArea
               className={`pb-6 ${
                  thread.messages.length === 0 ? "" : "h-[70vh]"
               }`}>
               <div ref={viewportRef} className="flex flex-col gap-6 p-2">
                  {thread.messages.length === 0 ? (
                     <div className="flex flex-col items-center px-4 text-center">
                        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><Bot className="size-7" /></span>
                        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--calson-font)" }}>Ask Commerce AI</h1>
                        <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">Ask about live products, stock, orders, payments, customers, approved knowledge, or dashboard setup.</p>
                     </div>
                  ) : (
                     thread.messages.map((m) => (
                        <ChatBubble
                           key={m.id}
                           message={m}
                           threadId={threadId}
                        />
                     ))
                  )}
               </div>
            </ScrollArea>
            <ChatComposer onSend={handleSend} />
         </div>
      </div>
   );
}
