"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { navGroups, LABEL_MAIN_MENU, LABEL_COMING_SOON, PLACEHOLDER_SEARCH, ARIA_SEARCH_NAV } from "@/constants";
import {
   Home,
   Plus,
   Minus,
   Search,
   PanelRightOpen,
   PanelRightClose,
   MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/public/whatsapp-commerce-logo.svg";
import ParternBg from "@/public/pattern-bg.png";
import type { NavItem } from "@/types";
import { ThemeToggle } from "@/components/theme-toggle";

export type SidebarProps = {
   onClose?: () => void;
   collapsed?: boolean;
   onToggleCollapse?: () => void;
};

export function Sidebar({
   onClose,
   collapsed,
   onToggleCollapse,
}: SidebarProps) {
   const pathname = usePathname();
   const router = useRouter();
   const [query, setQuery] = React.useState("");

   const filtered = React.useMemo(() => {
      if (!query.trim()) return navGroups;
      const q = query.toLowerCase();

      function filterItems(items: NavItem[]): NavItem[] {
         const result: NavItem[] = [];
         for (const it of items ?? []) {
            const selfMatch = it.label.toLowerCase().includes(q);
            if (it.items && it.items.length) {
               const children = filterItems(it.items);
               if (selfMatch || children.length) result.push({ ...it, items: children });
            } else if (selfMatch) {
               result.push({ ...it });
            }
         }
         return result;
      }

      return navGroups
         .map((g) => {
            const groupMatch = g.label.toLowerCase().includes(q);
            if (g.href) return groupMatch ? g : null;
            const items = filterItems(g.items ?? []);
            if (groupMatch || items.length) return { ...g, items };
            return null;
         })
         .filter(Boolean) as typeof navGroups;
   }, [query]);

   function findFirstHref(items: NonNullable<typeof navGroups[number]["items"]>): string | null {
      for (const it of items ?? []) {
         if (it.href) return it.href
         if (it.items && it.items.length) {
            const found = findFirstHref(it.items)
            if (found) return found
         }
      }
      return null
   }

   return (
      <aside
         className={cn(
            "sticky top-0 h-screen flex shrink-0 flex-col bg-primary text-white relative md:fixed md:inset-y-0 md:left-0 md:top-0",
            collapsed ? "w-16" : "w-72"
         )}>
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
            sizes="18rem"
         />
         <div
            className={`flex items-center justify-between gap-2 ${
               collapsed ? "px-3" : "px-4"
            } py-4`}>
            {collapsed ? null : (
               <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                     src={Logo.src}
                     alt="WhatsApp Commerce Hub logo"
                     width={180}
                     height={49}
                     className="object-contain"
                  />
               </Link>
            )}
            <div className="flex items-center">
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
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           const first = filtered[0];
                           if (!first) return;
                           const target = first.href ?? findFirstHref(first.items ?? []);
                           if (target) router.push(target);
                        }
                     }}
                     placeholder={PLACEHOLDER_SEARCH}
                     className="pl-12 border-none text-white placeholder:text-white focus:ring-0  bg-primary-foreground/10 py-6"
                     aria-label={ARIA_SEARCH_NAV}
                     style={{ background: "rgba(255, 255, 255, 0.10)" }}
                  />
               </div>
            </div>
         )}

         {!collapsed && (
            <ScrollArea className="h-[calc(100vh-120px)]">
               <nav className="px-2 py-6 text-sm">
                  <div className="px-2 text-center text-xs text-white font-semibold grid grid-cols-3 items-center gap-2 mb-8">
                     <Separator />
                     <span className="w-full">{LABEL_MAIN_MENU}</span>
                     <Separator />
                  </div>

                  {filtered.map((group) => {
                     if (group.href) {
                        const isAsk = group.id === "ask-anything";
                        const isActive = isAsk
                           ? pathname.startsWith("/dashboard/chat")
                           : pathname === group.href;
                        return (
                           <div key={group.id} className={cn(isAsk && "mt-6")}> 
                              {isAsk ? (
                                 <div className="mb-3 px-2"><Separator className="bg-white/40" /></div>
                              ) : null}
                              <Link
                                 href={group.href}
                                 className={cn(
                                    isAsk
                                       ? "flex items-center gap-2 rounded-md px-3 py-2 transition-colors text-[15px] bg-[#E0B5FF] text-black hover:bg-[#C380FF] hover:text-white font-bold"
                                       : "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-emerald-700 text-[15px]",
                                    isActive && (isAsk ? "bg-[#C380FF] text-white" : "bg-emerald-600 font-bold ")
                                 )}>
                                 {isAsk ? (
                                    <MessageSquareText className="size-4" />
                                 ) : (
                                    <Home className="size-4" />
                                 )}
                                 <span>{group.label}</span>
                              </Link>
                           </div>
                        );
                     }

                     function RenderItems({ items, parent }: { items: NavItem[]; parent: string }) {
                        if (!items || items.length === 0) {
                           return (
                              <div className="px-3 py-2 text-xs text-white">{LABEL_COMING_SOON}</div>
                           );
                        }
                        return (
                           <div className="mb-2 ml-2 flex flex-col gap-1">
                              {items.map((it, idx) => {
                                 const key = `${parent}-${idx}-${it.label}`
                                 if (it.items && it.items.length) {
                                    return (
                                       <Accordion type="single" collapsible key={key}>
                                          <AccordionItem value={key}>
                                             <AccordionTrigger className="px-3 py-2 hover:text-emerald-500 text-[13px] [&>svg]:hidden [&[data-state=open]_.plus-icon]:hidden [&[data-state=open]_.minus-icon]:block">
                                                <div className="flex w-full items-center justify-between">
                                                   <span>{it.label}</span>
                                                   <Plus className="size-4 plus-icon" />
                                                   <Minus className="size-4 hidden minus-icon" />
                                                </div>
                                             </AccordionTrigger>
                                             <AccordionContent>
                                                <RenderItems items={it.items} parent={key} />
                                             </AccordionContent>
                                          </AccordionItem>
                                       </Accordion>
                                    )
                                 }
                                 const isActive = pathname === it.href
                                 return (
                                    <Link
                                       key={key}
                                       href={it.href!}
                                       className={cn(
                                          "rounded-md px-3 py-1 text-white transition-colors hover:bg-accent hover:text-accent-foreground text-[13px]",
                                          isActive && "bg-accent text-accent-foreground"
                                       )}
                                    >
                                       {it.label}
                                    </Link>
                                 )
                              })}
                           </div>
                        )
                     }

                     return (
                        <Accordion type="single" collapsible key={group.id}>
                           <AccordionItem value={group.id}>
                              <AccordionTrigger className="px-3 py-3 hover:text-emerald-500 text-[15px] [&>svg]:hidden [&[data-state=open]_.plus-icon]:hidden [&[data-state=open]_.minus-icon]:block">
                                 <div className="flex w-full items-center justify-between">
                                    <span>{group.label}</span>
                                    <Plus className="size-4 plus-icon" />
                                    <Minus className="size-4 hidden minus-icon" />
                                 </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                 <RenderItems items={group.items ?? []} parent={group.id} />
                              </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                     );
                  })}
                  <div className="mt-6 px-2">
                     <ThemeToggle />
                  </div>
               </nav>
            </ScrollArea>
         )}
      </aside>
   );
}
