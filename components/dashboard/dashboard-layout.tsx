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
   hideHelperChat = false,
}: {
   children: React.ReactNode;
   sidebar?: React.ReactNode;
   hideHelperChat?: boolean;
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
            hideHelperChat
               ? "session-dashboard-shell block min-h-svh bg-primary relative"
               : collapsed
                 ? "grid min-h-svh md:grid-cols-[4rem_1fr] bg-primary relative"
                 : "grid min-h-svh md:grid-cols-[18rem_1fr] bg-primary relative"
         }>
         <Image
               src={ParternBg.src}
               alt=""
               fill
               priority
               className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
            sizes="100vw"
         />

         {/* Static sidebar on md+ */}
         {hideHelperChat ? null : <div className="hidden md:block">{sidebarNode}</div>}

         <div className={hideHelperChat ? "session-dashboard-main-wrap min-w-0 p-1.5 sm:p-2" : "min-w-0 p-1.5 sm:p-2"}>
            <main
               className={
                  hideHelperChat
                     ? "session-dashboard-main relative flex min-h-[calc(100svh-0.75rem)] min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-xl bg-white p-3 pb-6 pt-16 text-black dark:text-black sm:min-h-[calc(100svh-1rem)] sm:gap-4 sm:rounded-[15px] sm:p-8 sm:px-12 md:pb-8 md:pt-8"
                     : "relative flex min-h-[calc(100svh-0.75rem)] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-xl bg-white p-4 pb-24 pt-20 text-black dark:text-black sm:min-h-[calc(100svh-1rem)] sm:rounded-[15px] sm:p-8 sm:px-12 md:pb-8 md:pt-8"
               }>
               <Image
                  src={ParternBg.src}
                  alt=""
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
                  sizes="(max-width: 768px) 100vw, calc(100vw - 18rem)"
               />
               {/* Mobile menu toggle */}
               <div className={hideHelperChat ? "absolute left-4 top-4 z-20 md:hidden" : "absolute left-6 top-6 md:hidden z-20"}>
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
               <div className={hideHelperChat ? "absolute right-4 top-4" : "absolute right-6 top-6"}>
                  <UserMenu />
               </div>
               {children}
               <div className="h-4" />
               {/* Helper side chat on all dashboard pages */}
               {hideHelperChat ? null : <HelperChat />}
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
