"use client"

import * as React from "react"

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "success" | "error" | "default"
}

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (t: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
} | null>(null)

export function ToastProviderInternal({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  function toast(t: Omit<Toast, "id">) {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, ...t }])
    return id
  }
  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }
  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <Toaster />")
  return ctx
}
