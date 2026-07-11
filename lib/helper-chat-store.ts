"use client"

import * as React from "react"

export type HelperMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

const STORAGE_KEY = "disruptor.helper.chat.v1"

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
    // Fallback to basic helper responses
    return helperAssistantReplyFallback(userInput)
  }
}

// Keep the old function as a fallback
export function helperAssistantReplyFallback(userInput: string): string {
  const help: Record<string, string> = {
    navigation: "Use the left sidebar to explore Reon Capital projects like ENEVA, ZUBA, BEZZA, and ANSU. Find Getting Started guides, API documentation, and developer resources.",
    chat: "For full conversation threads, click 'Developer Assistant' in the main menu to open the full chat with advanced AI capabilities.",
    profile: "Update your name, email, avatar, and password under Account → Profile. Your settings are saved locally.",
    auth: "Sign in or out via the user menu (top-right). Sessions are maintained for security.",
    projects: "Explore our main projects: ENEVA (Energy Innovation), ZUBA (Full-stack Platform), BEZZA (Lightweight Platform), and ANSU (Enterprise Platform).",
  }
  const lower = userInput.toLowerCase()
  if (lower.includes("profile")) return help.profile
  if (lower.includes("sign") || lower.includes("auth") || lower.includes("login")) return help.auth
  if (lower.includes("chat") || lower.includes("ask")) return help.chat
  if (lower.includes("project") || lower.includes("eneva") || lower.includes("zuba") || lower.includes("bezza") || lower.includes("ansu")) return help.projects
  if (lower.includes("nav") || lower.includes("menu") || lower.includes("where")) return help.navigation
  return `Welcome to Reon Capital Developer Hub! ${help.navigation} ${help.chat}`
}

