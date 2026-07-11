"use client"

import * as React from "react"
import { UserMenu } from "@/components/dashboard/user-menu"

export function ChatLayout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid h-screen grid-cols-[18rem_1fr] bg-background">
      {sidebar}
      <main className="relative flex h-full flex-col gap-6 overflow-y-auto p-6">
        <div className="absolute right-6 top-6">
          <UserMenu />
        </div>
        {children}
        <div className="h-2" />
      </main>
    </div>
  )
}

