"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatView } from "@/components/chat/chat-view"
import { useThreads } from "@/lib/chat-store"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"

export default function ChatThreadPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { hydrated, ensureThread, setThreads, removeThread } = useThreads()

  React.useEffect(() => {
    if (!hydrated) return
    // Ensure a valid thread exists; if not, create and redirect
    const t = ensureThread(params?.id)
    if (t && t.id !== params?.id) {
      router.replace(`/dashboard/chat/${t.id}`)
    }
  }, [params?.id, hydrated, ensureThread, router])

  // Listen for sidebar rename/delete broadcast events
  React.useEffect(() => {
    function onRename(e: Event) {
      const detail = (e as CustomEvent<{ id: string; title: string }>).detail
      setThreads((prev) => prev.map((t) => (t.id === detail.id ? { ...t, title: detail.title } : t)))
    }
    function onDelete(e: Event) {
      const detail = (e as CustomEvent<{ id: string }>).detail
      removeThread(detail.id)
      const next = ensureThread()
      if (next) router.replace(`/dashboard/chat/${next.id}`)
    }
    window.addEventListener("chat:rename", onRename as EventListener)
    window.addEventListener("chat:delete", onDelete as EventListener)
    return () => {
      window.removeEventListener("chat:rename", onRename as EventListener)
      window.removeEventListener("chat:delete", onDelete as EventListener)
    }
  }, [ensureThread, removeThread, router, setThreads])

  const threadId = params?.id

  return (
    <DashboardLayout sidebar={<ChatSidebar />}>
      {threadId ? <ChatView threadId={threadId} /> : null}
    </DashboardLayout>
  )
}
