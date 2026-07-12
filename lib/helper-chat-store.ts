"use client"

import * as React from "react"

export type HelperMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

const STORAGE_KEY = "whatsapp-commerce.helper.chat.v1"

function readMessages(): HelperMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeMessages(msgs: HelperMessage[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

export function useHelperChat() {
  const [messages, setMessages] = React.useState<HelperMessage[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setMessages(readMessages())
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (hydrated) writeMessages(messages)
  }, [messages, hydrated])

  function append(role: HelperMessage["role"], content: string) {
    const m: HelperMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, m])
  }

  function clear() {
    setMessages([])
  }

  return { hydrated, messages, append, clear, setMessages }
}

export async function helperAssistantReply(userInput: string): Promise<string> {
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
    return "The commerce assistant is temporarily unavailable. Check Bot Settings and try again."
  }
}
