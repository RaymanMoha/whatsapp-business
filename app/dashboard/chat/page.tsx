"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useThreads } from "@/lib/chat-store"

export default function ChatIndexPage() {
  const router = useRouter()
  const { hydrated, ensureThread } = useThreads()

  React.useEffect(() => {
    if (!hydrated) return
    const t = ensureThread()
    if (t) router.replace(`/dashboard/chat/${t.id}`)
  }, [hydrated, ensureThread, router])

  return (
    <DashboardLayout sidebar={<ChatSidebar />}>
      <div />
    </DashboardLayout>
  )
}
