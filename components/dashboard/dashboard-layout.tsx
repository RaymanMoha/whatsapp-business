"use client";

import * as React from "react";
import { Sidebar, type SidebarProps } from "./sidebar/sidebar";
import { UserMenu } from "../dashboard/user-menu";
import Image from "next/image";
import ParternBg from "@/public/pattern-bg.png";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { HelperChat } from "@/components/helper-chat/helper-chat";

export function DashboardLayout({
   children,
   sidebar,
}: {
   children: React.ReactNode;
   sidebar?: React.ReactNode;
}) {
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [collapsed, setCollapsed] = React.useState(false);

   const sidebarNode = React.useMemo(() => {
      const onClose = () => setSidebarOpen(false);
      const onToggleCollapse = () => setCollapsed((v) => !v);
      const injectedProps = { onClose, collapsed, onToggleCollapse };
      if (React.isValidElement(sidebar)) {
         return React.cloneElement(
            sidebar as React.ReactElement<SidebarProps>,
            injectedProps
         );
      }
      return <Sidebar {...injectedProps} />;
   }, [sidebar, collapsed]);

   return (
      <div
         className={
            collapsed
               ? "grid min-h-screen md:grid-cols-[4rem_1fr] bg-primary relative"
               : "grid min-h-screen md:grid-cols-[18rem_1fr] bg-primary relative"
         }>
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
            sizes="100vw"
         />

         {/* Static sidebar on md+ */}
         <div className="hidden md:block">{sidebarNode}</div>

         <div className="p-2">
            <main className="relative flex h-full flex-col gap-4 overflow-y-auto bg-white text-black dark:text-black rounded-[15px] p-8 px-12">
               <Image
                  src={ParternBg.src}
                  alt=""
                  fill
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
                  sizes="(max-width: 768px) 100vw, calc(100vw - 18rem)"
               />
               {/* Mobile menu toggle */}
               <div className="absolute left-6 top-6 md:hidden z-20">
                  <Button
                     variant="secondary"
                     size="icon"
                     aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                     onClick={() => setSidebarOpen((v) => !v)}>
                     {sidebarOpen ? (
                        <PanelRightClose className="size-5" />
                     ) : (
                        <PanelRightOpen className="size-5" />
                     )}
                  </Button>
               </div>
               <div className="absolute right-6 top-6">
                  <UserMenu />
               </div>
               {children}
               <div className="h-4" />
               {/* Helper side chat on all dashboard pages */}
               <HelperChat />
            </main>
         </div>

         {/* Mobile overlay sidebar */}
         {sidebarOpen ? (
            <>
               <div
                  className="fixed inset-0 z-40 bg-black/40 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden
               />
               <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
                  {sidebarNode}
               </div>
            </>
         ) : null}
      </div>
   );
}
