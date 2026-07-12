"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useThreads } from "@/lib/chat-store";
import type { ChatThread } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Plus, MoreHorizontal, Search, MessageSquareText, PanelRightOpen, PanelRightClose, Bot } from "lucide-react";
import ParternBg from "@/public/pattern-bg.png";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { PLACEHOLDER_SEARCH, ARIA_SEARCH_CHATS, LABEL_CHAT_HISTORY, LABEL_NO_CHATS_YET, BTN_UNDO } from "@/constants";

type Group = { label: string; items: ChatThread[] };

function groupThreads(threads: ChatThread[]): Group[] {
   const now = new Date();
   const today: ChatThread[] = [];
   const previous7: ChatThread[] = [];
   const byMonth = new Map<string, ChatThread[]>();

   for (const t of threads
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))) {
      const d = new Date(t.updatedAt);
      const msDiff = now.getTime() - d.getTime();
      const days = msDiff / (1000 * 60 * 60 * 24);
      if (days < 1) today.push(t);
      else if (days < 7) previous7.push(t);
      else {
         const label = d.toLocaleString(undefined, { month: "long" });
         const arr = byMonth.get(label) ?? [];
         arr.push(t);
         byMonth.set(label, arr);
      }
   }

   const groups: Group[] = [];
   if (today.length) groups.push({ label: "Today", items: today });
   if (previous7.length)
      groups.push({ label: "Previous 7 Days", items: previous7 });
   for (const [label, items] of byMonth) groups.push({ label, items });
   return groups;
}

function preview(t: ChatThread): string {
   const last = t.messages.at(-1);
   const content = last?.content ?? "Empty chat";
   const when = last?.createdAt ?? t.updatedAt;
   return `${truncate(content)} • ${relativeTime(when)}`;
}

function truncate(s: string, n = 42) {
   const x = s.trim().replace(/\s+/g, " ");
   return x.length > n ? `${x.slice(0, n - 1)}…` : x;
}

function relativeTime(iso: string): string {
   const d = new Date(iso);
   const diff = Date.now() - d.getTime();
   const sec = Math.floor(diff / 1000);
   if (sec < 60) return `${sec}s ago`;
   const min = Math.floor(sec / 60);
   if (min < 60) return `${min}m ago`;
   const hr = Math.floor(min / 60);
   if (hr < 24) return `${hr}h ago`;
   const day = Math.floor(hr / 24);
   if (day === 1) return "Yesterday";
   if (day < 7) return `${day}d ago`;
   return d.toLocaleDateString();
}

export function ChatSidebar({
   onClose,
   collapsed,
   onToggleCollapse,
}: {
   onClose?: () => void;
   collapsed?: boolean;
   onToggleCollapse?: () => void;
}) {
   const { threads, newThread, setThreads, removeThread, ensureThread } =
      useThreads();
   const pathname = usePathname();
   const router = useRouter();
   const [query, setQuery] = React.useState("");
   const [editingId, setEditingId] = React.useState<string | null>(null);
   const [titleDraft, setTitleDraft] = React.useState("");
   const { toast } = useToast();

   const groups = React.useMemo(() => {
      const list = query
         ? threads.filter((t) =>
              t.title.toLowerCase().includes(query.toLowerCase())
           )
         : threads;
      return groupThreads(list);
   }, [threads, query]);

   function handleNew() {
      const t = newThread();
      router.push(`/dashboard/chat/${t.id}`);
   }

   function commitRename(id: string) {
      const name = titleDraft.trim();
      if (!name) return setEditingId(null);
      setThreads((prev) =>
         prev.map((t) => (t.id === id ? { ...t, title: name } : t))
      );
      setEditingId(null);
   }

   function handleDelete(id: string) {
      const deletingCurrent = pathname.endsWith(id);
      const deleted = threads.find((t) => t.id === id);
      removeThread(id);
      if (deletingCurrent) {
         const next = ensureThread();
         if (next) router.replace(`/dashboard/chat/${next.id}`);
      }
      toast({
         description: (
            <div className="flex items-center gap-3">
               <span>Chat deleted.</span>
               {deleted ? (
                  <button
                     className="underline"
                     onClick={() => {
                        setThreads((prev) => [deleted, ...prev]);
                        router.replace(`/dashboard/chat/${deleted.id}`);
                     }}>
                     {BTN_UNDO}
                  </button>
               ) : null}
            </div>
         ),
         variant: "error",
      });
   }

   return (
      <aside
         className={cn(
            "sticky top-0 h-screen flex shrink-0 flex-col bg-primary text-white relative",
            collapsed ? "w-16" : "w-72"
         )}>
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
         />
         <div
            className={`flex items-center justify-between gap-2 ${
               collapsed ? "px-0" : "px-4"
            } py-4`}>
            <Link href="/dashboard" className="flex items-center gap-2">
               <span className="grid size-8 place-items-center rounded-full bg-emerald-400 text-emerald-950"><Bot className="size-4" /></span>
               <span className="font-semibold text-white">Commerce AI</span>
            </Link>
            <div className="flex items-center">
               <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleNew}
                  aria-label="New chat">
                  <Plus className="size-4" />
               </Button>
               <Button
                  size="icon"
                  variant="ghost"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={onToggleCollapse}>
                  {collapsed ? (
                     <PanelRightOpen className="size-4" />
                  ) : (
                     <PanelRightClose className="size-4" />
                  )}
               </Button>
               {onClose ? (
                  <Button
                     size="icon"
                     variant="ghost"
                     aria-label="Close sidebar"
                     className="md:hidden"
                     onClick={onClose}>
                     <PanelRightClose className="size-4" />
                  </Button>
               ) : null}
            </div>
         </div>
         {!collapsed && (
            <div className="px-4 pb-3">
               <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-6 -translate-y-1/2 text-white" />
               <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={PLACEHOLDER_SEARCH}
                  className="pl-12 border-none text-white placeholder:text-white focus:ring-0 bg-primary-foreground/10 py-6"
                  aria-label={ARIA_SEARCH_CHATS}
                  style={{ background: "rgba(255, 255, 255, 0.10)" }}
               />
               </div>
            </div>
         )}

         {!collapsed && (
            <div className="px-3 py-4 text-sm">
            <div className="px-2 text-center text-xs text-white font-semibold grid grid-cols-3 items-center gap-2 mb-4">
               <Separator />
               <span className="w-full">{LABEL_CHAT_HISTORY}</span>
               <Separator />
            </div>
            {groups.length === 0 && (
               <div className="px-2 text-xs text-white/70">{LABEL_NO_CHATS_YET}</div>
            )}
               {groups.map((g) => (
                  <div key={g.label} className="mb-4">
                     <div className="mb-2 px-2 text-xs text-white/70">
                        {g.label}
                     </div>
                     <ul className="space-y-1">
                        {g.items.map((t) => {
                           const active = pathname.endsWith(t.id);
                           return (
                              <li key={t.id}>
                                 <div
                                    className={cn(
                                       "flex items-center justify-between gap-2 rounded-md px-2 py-2 text-white/80 transition-colors hover:bg-emerald-700 hover:text-white",
                                       active && "bg-emerald-600 text-white"
                                    )}>
                                    {editingId === t.id ? (
                                       <input
                                          autoFocus
                                          className="flex-1 truncate bg-transparent outline-none"
                                          value={titleDraft}
                                          onChange={(e) =>
                                             setTitleDraft(e.target.value)
                                          }
                                          onBlur={() => commitRename(t.id)}
                                          onKeyDown={(e) => {
                                             if (e.key === "Enter")
                                                commitRename(t.id);
                                             if (e.key === "Escape")
                                                setEditingId(null);
                                          }}
                                       />
                                    ) : (
                                       <Link
                                          href={`/dashboard/chat/${t.id}`}
                                          className="flex flex-1 items-center gap-4 truncate">
                                          <MessageSquareText />
                                          <span className="truncate">
                                             <div className="truncate font-medium leading-tight">
                                                {t.title}
                                             </div>
                                             <div className="truncate text-xs text-white/70">
                                                {preview(t)}
                                             </div>
                                          </span>
                                       </Link>
                                    )}
                                    <DropdownMenu>
                                       <DropdownMenuTrigger
                                          aria-label="Open chat actions"
                                          className="rounded p-1 hover:bg-muted/40">
                                          <MoreHorizontal className="size-4" />
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                             onSelect={(e) => {
                                                e.preventDefault();
                                                setEditingId(t.id);
                                                setTitleDraft(t.title);
                                             }}>
                                             Rename
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                             onSelect={(e) => {
                                                e.preventDefault();
                                                handleDelete(t.id);
                                             }}>
                                             Delete
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </li>
                           );
                        })}
                     </ul>
                  </div>
               ))}
            </div>
         )}
      </aside>
   );
}
