"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function applyTheme(next: "light" | "dark") {
  const root = document.documentElement
  if (next === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
  try { localStorage.setItem("disruptor.theme", next) } catch {}
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = React.useState<"light" | "dark">("light")
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("disruptor.theme") as "light" | "dark" | null
      const initial = saved ?? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      setMode(initial)
      applyTheme(initial)
    } catch {}
  }, [])

  function onCheckedChange(checked: boolean) {
    const next = checked ? "dark" : "light"
    setMode(next)
    applyTheme(next)
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-2">
              <Sun className="size-4" />
              <Switch checked={mode === "dark"} onCheckedChange={onCheckedChange} aria-label="Toggle theme" />
              <Moon className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex w-full items-center justify-between rounded-md border px-3 py-2 bg-white/70 dark:bg-white/10 text-foreground">
      <Sun className="size-4" />
      <Switch checked={mode === "dark"} onCheckedChange={onCheckedChange} aria-label="Toggle theme" />
      <Moon className="size-4" />
    </div>
  )
}
