"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type Prefs = {
  emailUpdates: boolean
  productNews: boolean
  tipsAndGuides: boolean
  desktopNotifications: boolean
}

const STORAGE_KEY = "disruptor.settings.notifications.v1"

export function NotificationsCard() {
  const [prefs, setPrefs] = React.useState<Prefs>({
    emailUpdates: true,
    productNews: true,
    tipsAndGuides: true,
    desktopNotifications: false,
  })
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPrefs({ ...prefs, ...JSON.parse(raw) })
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)) } catch {}
  }, [prefs])

  function Row({ label, prop }: { label: string; prop: keyof Prefs }) {
    return (
      <div className="flex items-center justify-between rounded-md border px-3 py-2 bg-white/70 dark:bg-white/10">
        <span className="text-sm">{label}</span>
        <Switch checked={prefs[prop]} onCheckedChange={(c) => setPrefs((p) => ({ ...p, [prop]: !!c }))} />
      </div>
    )
  }

  return (
    <Card className="text-black dark:text-black">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Row label="Email updates" prop="emailUpdates" />
        <Row label="Product news" prop="productNews" />
        <Row label="Tips and guides" prop="tipsAndGuides" />
        <Row label="Desktop notifications" prop="desktopNotifications" />
      </CardContent>
    </Card>
  )
}

