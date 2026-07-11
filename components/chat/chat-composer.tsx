"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatComposer({
   onSend,
   placeholder = "Ask me a question about your data",
}: {
   onSend: (text: string) => void;
   placeholder?: string;
}) {
   const [text, setText] = React.useState("");

   function handleSend() {
      const value = text.trim();
      if (!value) return;
      onSend(value);
      setText("");
   }

   function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   }

   return (
      <div className="sticky bottom-0 mt-4 flex items-center gap-2 rounded-sm border bg-[#D7DEDD] p-2 shadow-sm justify-center border-emerald-600/50">
         <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none placeholder:font-semibold py-4"
            aria-label="Message"
         />
         <Button variant="ghost" size="icon" aria-label="Voice input">
            <Mic className="size-5" />
         </Button>
         <Button onClick={handleSend} size="icon" aria-label="Send message">
            <Send className="size-5" />
         </Button>
      </div>
   );
}
