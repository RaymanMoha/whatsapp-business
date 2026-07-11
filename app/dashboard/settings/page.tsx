import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import Heading from "@/components/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsCard } from "@/components/settings/notifications-card"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Heading title="Settings" description="Manage your preferences and appearance." />

        <Card className="text-black dark:text-black">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ThemeToggle />
          </CardContent>
        </Card>

        <NotificationsCard />
      </div>
    </DashboardLayout>
  )
}
