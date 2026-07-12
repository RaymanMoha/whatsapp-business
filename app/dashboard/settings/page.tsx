import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import Heading from "@/components/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { LockKeyhole, ServerCog } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Heading title="Settings" description="Appearance and production configuration." />

        <Card className="text-black dark:text-black">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card className="text-black dark:text-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ServerCog className="size-5 text-emerald-700" /> Runtime configuration</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3 text-sm leading-6 text-zinc-600">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-emerald-700" />
            <p>Messaging, payments, and AI credentials are encrypted and managed from Bot Settings. Administrator credentials remain protected in the server environment.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
