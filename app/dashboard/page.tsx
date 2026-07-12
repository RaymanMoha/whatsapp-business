import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Hero } from "@/components/dashboard/hero"
import { FeatureGrid } from "@/components/dashboard/feature-grid"
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime"
import { readProducts } from "@/src/product-store"
import { listConversationSummaries } from "@/src/message-store"
import { listOrders } from "@/src/order-store"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [products, conversations, orders, runtime] = await Promise.all([
    readProducts(),
    listConversationSummaries(),
    listOrders(),
    getCommerceRuntimeStatus(),
  ])
  const available = products.filter((product) => product.available && product.stock > 0).length
  const stock = products.reduce((total, product) => total + Number(product.stock || 0), 0)
  const activeOrders = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status)).length

  return (
    <DashboardLayout>
      <Hero catalogCount={products.length} connectionStatus={runtime.messaging.status} />
      <section className="grid gap-4 pt-6 md:grid-cols-4">
        {[
          ["Available products", `${available}/${products.length}`, "live catalog availability"],
          ["Stock units", String(stock), "units ready to sell"],
          ["Active orders", String(activeOrders), `${conversations.length} customer conversations`],
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
