"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname, useRouter } from "next/navigation"
import { X, Trash2 } from "lucide-react"
import { useHelperChat, helperAssistantReply, type HelperMessage } from "@/lib/helper-chat-store"
import Logo from "@/public/logore.png"
import ParternBg from "@/public/pattern-bg.png"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Image from "next/image"

function Bubble({ message }: { message: HelperMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${isUser ? "bg-[#D7DEDD] animate-chat-in-right" : "bg-card animate-chat-in-left"} max-w-[75%] rounded-sm px-4 py-3 text-sm`}>{message.content}</div>
    </div>
  )
}

export function HelperChat() {
  const { messages, append, clear, setMessages } = useHelperChat()
  const [open, setOpen] = React.useState(false) // logical open/closed
  const [show, setShow] = React.useState(false) // mounted for exit animation
  const [text, setText] = React.useState("")
  const [unread, setUnread] = React.useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const prevPath = React.useRef<string | null>(null)

  React.useEffect(() => {
    // Hide immediately on full chat pages
    if (pathname?.startsWith("/dashboard/chat")) {
      setOpen(false)
      setShow(false)
    }
    // On any route change within the dashboard, close with animation if open
    if (prevPath.current !== null && pathname !== prevPath.current) {
      if (open) closePanel()
    }
    prevPath.current = pathname ?? null
  }, [pathname])

  React.useEffect(() => {
    // Load persisted open preference
    try {
      const saved = localStorage.getItem("disruptor.helper.open.v1")
      if (saved !== null) setOpen(saved === "1")
    } catch {}
  }, [])

  React.useEffect(() => {
    // Keyboard shortcuts: ? to open, Esc to close (avoid when typing in inputs)
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      const typing = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable
      if (!typing && (e.key === "?" || (e.key === "/" && e.shiftKey))) {
        setOpen(true)
      }
      if (open && e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  React.useEffect(() => {
    // Reset unread when opening and scroll to bottom
    if (open) {
      setUnread(0)
      setTimeout(() => {
        viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight })
      }, 0)
    }
    try {
      localStorage.setItem("disruptor.helper.open.v1", open ? "1" : "0")
    } catch {}
  }, [open])

  async function send(forceText?: string) {
    const value = (forceText ?? text).trim()
    if (!value) return
    append("user", value)
    setText("")
    
    // Add thinking message
    const thinkingId = crypto.randomUUID()
    append("assistant", "🤔 Thinking...")
    
    try {
      // Get real AI response
      const response = await helperAssistantReply(value)
      
      // Replace thinking message with actual response
      setMessages((prev) => {
        const newMessages = [...prev]
        const thinkingIndex = newMessages.findIndex((msg, idx) => 
          idx === newMessages.length - 1 && msg.content === "🤔 Thinking..."
        )
        if (thinkingIndex !== -1) {
          newMessages[thinkingIndex] = {
            ...newMessages[thinkingIndex],
            content: response
          }
        }
        return newMessages
      })
      
      if (!open) setUnread((n) => n + 1)
    } catch (error) {
      console.error('Helper chat error:', error)
      // Replace thinking message with error
      setMessages((prev) => {
        const newMessages = [...prev]
        const thinkingIndex = newMessages.findIndex((msg, idx) => 
          idx === newMessages.length - 1 && msg.content === "🤔 Thinking..."
        )
        if (thinkingIndex !== -1) {
          newMessages[thinkingIndex] = {
            ...newMessages[thinkingIndex],
            content: "I'm having trouble connecting right now. Please try again in a moment."
          }
        }
        return newMessages
      })
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function openPanel() {
    setOpen(true)
    setShow(true)
  }

  function closePanel(immediate = false) {
    setOpen(false)
    if (immediate) setShow(false)
    else setTimeout(() => setShow(false), 260)
  }

  return (
    <>
      {/* Toggle button */}
      {!pathname?.startsWith("/dashboard/chat") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="fixed bottom-6 right-6 z-40">
                {/* Animated wave rings */}
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-[#E0B5FF]/30 animate-ping animation-delay-0"></div>
                  <div className="absolute inset-0 rounded-full bg-[#E0B5FF]/20 animate-ping animation-delay-75"></div>
                  <div className="absolute inset-0 rounded-full bg-[#E0B5FF]/10 animate-ping animation-delay-150"></div>
                </div>
                {/* Main button */}
                <button
                  aria-label="Open helper chat"
                  onClick={() => openPanel()}
                  className="relative rounded-full bg-[#E0B5FF] hover:bg-[#C380FF] shadow-lg transition-transform active:scale-95 hover:scale-[1.03] w-14 h-14 flex items-center justify-center overflow-hidden">
                  <Image src={Logo.src} alt="Reon Capital" width={56} height={56} className="h-full w-full rounded-full object-cover" />
                  {unread > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">{unread}</span>
                  ) : null}
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Helper chat — press ? to open</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Slide-over panel */}
      {show && (
        <div className="fixed inset-0 z-50">
          <div className={
            `absolute inset-0 bg-black/30 ${open ? 'animate-overlay-fade-in' : 'animate-overlay-fade-out'}`
          } onClick={() => closePanel()} aria-hidden />
          <aside className={
            `absolute bottom-6 right-6 h-[70vh] w-[92vw] sm:w-[420px] bg-white text-black shadow-2xl flex flex-col ${open ? 'animate-helper-slide-in' : 'animate-helper-slide-out'} rounded-2xl overflow-hidden`
          }>
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <Image src={ParternBg.src} alt="" fill className="object-cover" sizes="(max-width: 640px) 92vw, 420px" />
            </div>
            <header className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <Image src={Logo.src} alt="Reon Capital" width={32} height={32} className="h-full w-full rounded-full object-cover" />
                </div>
                <span className="font-semibold">Reon Capital Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear"
                  onClick={() => clear()}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Close" onClick={() => closePanel()}>
                  <X className="size-4" />
                </Button>
              </div>
            </header>
            <div className="relative flex-1 min-h-0">
              <ScrollArea className="h-full flex-1">
                <div ref={viewportRef} className="relative z-10 flex flex-col gap-4 p-4">
                  <Suggestions onPick={(t) => send(t)} />
                  {messages.map((m) => (
                    <Bubble key={m.id} message={m} />
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="relative z-10 border-t p-2 flex items-center gap-2 bg-white/70 backdrop-blur-sm">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a quick question…"
                className="flex-1"
                autoFocus
              />
              <Button onClick={() => send()} aria-label="Send">Send</Button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

import { Card, CardContent } from "@/components/ui/card"

function Suggestions({ onPick }: { onPick: (text: string) => void }) {
  const pathname = usePathname()
  const base = ["What does Ask Anything do?"]
  const profile = ["How do I update my profile?", "How do I change my password?"]
  const media = ["Where can I find media ecosystem reports?", "Show me spend by channel."]
  const benchmarks = ["Where is benchmark performance by platform?"]
  const investment = ["Open partner spend by month."]
  const consumer = ["Where is Pipeline & Business Planning?"]
  let items: string[] = base
  if (pathname?.startsWith('/dashboard/profile')) items = [...profile, ...base]
  else if (pathname?.startsWith('/dashboard/media')) items = [...media, ...base]
  else if (pathname?.startsWith('/dashboard/benchmarks')) items = [...benchmarks, ...base]
  else if (pathname?.startsWith('/dashboard/investment')) items = [...investment, ...base]
  else if (pathname?.startsWith('/dashboard/consumer')) items = [...consumer, ...base]
  return (
    <div className="mb-2">
      <div className="text-xs uppercase tracking-wide text-emerald-900/80 mb-3 font-semibold">Quick prompts</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((text, i) => (
          <Card key={i} className="border-emerald-600/20 hover:border-emerald-600/40 transition-colors bg-white/90">
            <button className="w-full text-left" onClick={() => onPick(text)}>
              <CardContent className="py-2 px-3 text-[13px] leading-snug">
                {text}
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
