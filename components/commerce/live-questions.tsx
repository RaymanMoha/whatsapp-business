"use client";

import * as React from "react";

type ConversationSummary = {
   id: string;
   chatId: string;
   customerName: string;
   updatedAt: string;
   lastQuestion: string;
   lastReply: string;
   status: string;
   error?: string;
   messageCount: number;
};

function getStatusClass(status: string) {
   if (status === "Reply sent") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
   }

   if (status === "Send failed") {
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
   }

   return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

export function LiveQuestions({
   fallback,
}: {
   fallback: Array<{ id: string; customer: string; time: string; question: string; status: string }>;
}) {
   const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
   const [loaded, setLoaded] = React.useState(false);

   React.useEffect(() => {
      let cancelled = false;

      async function load() {
         try {
            const response = await fetch("/api/commerce/messages", { cache: "no-store" });
            const data = await response.json();
            if (!cancelled) {
               setConversations(Array.isArray(data.conversations) ? data.conversations : []);
               setLoaded(true);
            }
         } catch {
            if (!cancelled) setLoaded(true);
         }
      }

      load();
      const interval = window.setInterval(load, 3500);
      return () => {
         cancelled = true;
         window.clearInterval(interval);
      };
   }, []);

   if (conversations.length > 0) {
      return (
         <div className="space-y-3">
            {conversations.map((conversation) => (
               <div key={conversation.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                     <strong>{conversation.customerName}</strong>
                     <div className="flex flex-wrap items-center gap-2">
                        <span
                           className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(conversation.status)}`}>
                           {conversation.status}
                        </span>
                        <span className="text-xs text-zinc-500">
                           {new Date(conversation.updatedAt).toLocaleString()}
                        </span>
                     </div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-800">{conversation.lastQuestion}</p>
                  {conversation.lastReply ? (
                     <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                        {conversation.lastReply}
                     </p>
                  ) : null}
                  {conversation.error && !conversation.lastReply ? (
                     <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
                        {conversation.error}
                     </p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500">
                     {conversation.status} · {conversation.messageCount} messages · {conversation.chatId}
                  </p>
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-3">
         {loaded ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-zinc-600">
               No live WhatsApp messages recorded yet. Send a WhatsApp message to the connected number and this list will update automatically.
            </div>
         ) : null}
         {fallback.map((question) => (
            <div key={question.id} className="rounded-xl border p-4">
               <strong className="block">{question.question}</strong>
               <p className="mt-1 text-sm text-zinc-600">
                  {question.customer} · {question.status} · {question.time}
               </p>
            </div>
         ))}
      </div>
   );
}
