"use client";

import * as React from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { LogOut, SunMoon, UserRound, Settings } from "lucide-react";
import { getProfileAction } from "@/actions/profile";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserMenu() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>("")

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const res = await getProfileAction()
      if (!mounted) return
      if (res.ok) {
        setEmail(res.profile.email)
        const key = `commerce.profile.avatar.${res.profile.email.toLowerCase()}`
        setAvatarSrc(localStorage.getItem(key))
      }
    })()
    function onAvatar(e: Event) {
      const detail = (e as CustomEvent<{ src: string | null }>).detail
      setAvatarSrc(detail?.src ?? null)
    }
    function onStorage(ev: StorageEvent) {
      if (!email) return
      const key = `commerce.profile.avatar.${email.toLowerCase()}`
      if (ev.key === key) setAvatarSrc(ev.newValue)
    }
    window.addEventListener("profile:avatar", onAvatar as EventListener)
    window.addEventListener("storage", onStorage)
    return () => {
      mounted = false
      window.removeEventListener("profile:avatar", onAvatar as EventListener)
      window.removeEventListener("storage", onStorage)
    }
  }, [email])

   function onSignOut() {
      startTransition(async () => {
         try {
            await signOutAction();
         } finally {
            router.replace("/signin");
         }
      });
   }

  return (
     <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open user menu">
            <Avatar className="size-10 ring-1 ring-border border-emerald-700 border-2 cursor-pointer hover:border-emerald-500 transition-colors">
               {avatarSrc ? <AvatarImage src={avatarSrc} alt="Administrator" /> : null}
               <AvatarFallback>AD</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
           align="end"
           className="mt-0 bg-primary text-white px-0 py-0">
           <DropdownMenuLabel className="text-white/40">
              Account
           </DropdownMenuLabel>
           <DropdownMenuSeparator className="m-0 bg-white/50" />
            <DropdownMenuItem
               className="rounded-none cursor-pointer gap-2"
               onSelect={(e) => {
                  e.preventDefault();
                  router.push("/dashboard/profile");
               }}
            >
               <UserRound className="size-4" />
               Profile
            </DropdownMenuItem>
            <DropdownMenuItem
               className="rounded-none cursor-pointer gap-2"
               onSelect={(e) => {
                  e.preventDefault();
                  router.push("/dashboard/settings");
               }}
            >
               <Settings className="size-4" />
               Settings
            </DropdownMenuItem>
           <DropdownMenuSeparator className="m-0 bg-white/50" />
           <DropdownMenuLabel className="text-white/40 flex items-center gap-2">
             <SunMoon className="size-4" /> Theme
           </DropdownMenuLabel>
           <div className="px-2 py-2">
             <ThemeToggle compact />
           </div>
           <DropdownMenuSeparator className="m-0 bg-white/50" />
           <DropdownMenuItem
              onSelect={(e) => {
                 e.preventDefault();
                 onSignOut();
              }}
              className="rounded-none bg-red-600 transition-colors cursor-pointer">
              <LogOut height={15} width={15} />
              {pending ? "Signing out…" : "Sign out"}
           </DropdownMenuItem>
        </DropdownMenuContent>
     </DropdownMenu>
  );
}
