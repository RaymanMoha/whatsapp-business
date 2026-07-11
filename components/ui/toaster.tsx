"use client"

import * as React from "react"
import { ToastProvider as RadixToastProvider } from "@radix-ui/react-toast"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "./toast"
import { useToast } from "./use-toast"

function ToastItems() {
  const { toasts, dismiss } = useToast()
  return (
    <>
      {toasts.map((t) => {
        const variant = t.variant ?? "default"
        const gradient =
          variant === "success"
            ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white border-0"
            : variant === "error"
            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white border-0"
            : ""
        return (
        <Toast key={t.id} onOpenChange={(o) => !o && dismiss(t.id)} className={gradient}>
          {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
          {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
        </Toast>
        )
      })}
    </>
  )
}

export function Toaster() {
  return (
    <RadixToastProvider swipeDirection="right">
      <ToastProvider>
        <ToastItems />
        <ToastViewport />
      </ToastProvider>
    </RadixToastProvider>
  )
}
