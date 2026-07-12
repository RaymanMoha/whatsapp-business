import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Hero } from "@/components/dashboard/hero"
import { FeatureGrid } from "@/components/dashboard/feature-grid"
import { commerceStats } from "@/lib/commerce-data"
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const stats = commerceStats()
  const runtime = await getCommerceRuntimeStatus()

  return (
    <DashboardLayout>
      <Hero />
      <section className="grid gap-4 pt-6 md:grid-cols-4">
        {[
          ["Available products", `${stats.available}/${stats.total}`, "from shared catalog"],
          ["Stock units", String(stats.stock), "current demo inventory"],
          ["AI reply rate", `${stats.replyRate}%`, `${stats.questions} reviewed questions`],
          ["WhatsApp connection", runtime.messaging.status, runtime.messaging.phone || "phone not connected"],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-xl border border-zinc-300 bg-white/50 p-4 text-black">
            <p className="text-sm text-zinc-600">{label}</p>
            <strong className="mt-1 block text-2xl">{value}</strong>
            <span className="text-xs text-zinc-500">{note}</span>
          </div>
        ))}
      </section>
      <FeatureGrid />
    </DashboardLayout>
  )
}
