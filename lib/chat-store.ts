"use client"

import * as React from "react"
import { sampleThreads } from "@/lib/chat-samples"
import type { ChatThread, ChatMessage, ChatMessageMeta } from "@/types"

const STORAGE_KEY = "disruptor.chat.threads.v1"

export async function getAssistantReply(userInput: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.message || 'I apologize, but I could not generate a response.'
  } catch (error) {
    console.error('Error getting AI response:', error)
    // Fallback to a more helpful error message
    return "I'm experiencing connectivity issues right now. Please check your internet connection and try again. If the problem persists, the AI service might be temporarily unavailable."
  }
}

// Keep the old function as a fallback for backwards compatibility
export function fakeAssistantReply(userInput: string): string {
  const templates = [
    "Here's a concise take: ",
    "Short answer: ",
    "In summary, ",
    "A helpful starting point: ",
  ]
  const suffix =
    "This is a simulated response. Hook up your AI backend to replace this placeholder with real insights."
  const prefix = templates[userInput.length % templates.length]
  return `${prefix}${userInput} — ${suffix}`
}

function readThreads(): ChatThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatThread[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
}

export function createThread(title = "New Chat"): ChatThread {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), title, messages: [], createdAt: now, updatedAt: now }
}

export function appendMessage(threads: ChatThread[], threadId: string, msg: Omit<ChatMessage, "id" | "createdAt">): ChatThread[] {
  const next = threads.map((t) => {
    if (t.id !== threadId) return t
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: msg.role,
      content: msg.content,
      createdAt: new Date().toISOString(),
      meta: msg.meta ?? {},
    }
    const title = t.messages.length === 0 ? truncateTitle(msg.content) : t.title
    return { ...t, title, messages: [...t.messages, message], updatedAt: message.createdAt }
  })
  return next
}

export function updateMessageMeta(
  threads: ChatThread[],
  threadId: string,
  messageId: string,
  meta: ChatMessageMeta
): ChatThread[] {
  return threads.map((t) => {
    if (t.id !== threadId) return t
    const messages = t.messages.map((m) => (m.id === messageId ? { ...m, meta: { ...m.meta, ...meta } } : m))
    return { ...t, messages, updatedAt: new Date().toISOString() }
  })
}

function truncateTitle(s: string, n = 42) {
  const t = s.trim().replace(/\s+/g, " ")
  return t.length > n ? `${t.slice(0, n - 1)}…` : t || "New Chat"
}

export function useThreads() {
  const [threads, setThreads] = React.useState<ChatThread[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const fromStorage = readThreads()
    if (fromStorage.length === 0) {
      // Seed with samples on first use
      writeThreads(sampleThreads)
      setThreads(sampleThreads)
    } else {
      setThreads(fromStorage)
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (hydrated) writeThreads(threads)
  }, [threads, hydrated])

  const ensureThread = React.useCallback((id?: string): ChatThread | null => {
    if (!hydrated) return null
    if (threads.length === 0) {
      const t = createThread()
      setThreads([t])
      return t
    }
    if (id) {
      const found = threads.find((t) => t.id === id)
      return found ?? threads[0]
    }
    return threads.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  }, [threads, hydrated])

  const update = React.useCallback((mutator: (prev: ChatThread[]) => ChatThread[]) => {
    setThreads((prev) => mutator(prev))
  }, [setThreads])

  const removeThread = React.useCallback((id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id))
  }, [setThreads])

  const newThread = React.useCallback(() => {
    const t = createThread()
    setThreads((prev) => [t, ...prev])
    return t
  }, [setThreads])

  return { hydrated, threads, setThreads, update, ensureThread, removeThread, newThread }
}
