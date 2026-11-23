import { CommerceOverview } from "@/components/dashboard/commerce-overview"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { getSession } from "@/lib/auth"
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime"
import { listConversationSummaries } from "@/src/message-store"
import { listPayments } from "@/src/mpesa-store"
import { listOrders } from "@/src/order-store"
import { readProducts } from "@/src/product-store"

export const dynamic = "force-dynamic"

function nairobiDayKey(value: string | Date) {
  const compact = String(value).match(/^(\d{4})(\d{2})(\d{2})\d{6}$/)
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value
  return `${part("year")}-${part("month")}-${part("day")}`
}

function nairobiGreeting() {
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date()))
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function formatTime(value: string) {
  if (!value) return "Now"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Now"
  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  }).format(date)
}

export default async function DashboardPage() {
  const [products, conversations, orders, payments, runtime, session] = await Promise.all([
    readProducts(),
    listConversationSummaries(),
    listOrders(),
    listPayments(),
    getCommerceRuntimeStatus(),
    getSession(),
  ])
  const available = products.filter((product) => product.available && product.stock > 0).length
  const activeOrders = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status)).length
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 5)
  const missingImages = products.filter((product) => !product.image && !product.imageDataUrl)
  const awaitingFulfilment = orders.filter((order) => ["Paid", "Preparing", "Ready"].includes(order.status))
  const todayKey = nairobiDayKey(new Date())
  const todayRevenue = payments
    .filter((payment) => {
      if (payment.status !== "Paid") return false
      const paidAt = payment.paidAt || payment.transactionDate || payment.updatedAt || payment.createdAt
      return paidAt && nairobiDayKey(paidAt) === todayKey
    })
    .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  const firstName = session?.name?.trim().split(/\s+/)[0] || "Rayman"

  return (
    <DashboardLayout>
      <CommerceOverview
        greeting={nairobiGreeting()}
        firstName={firstName}
        connected={runtime.messaging.status === "WORKING"}
        connectionLabel={runtime.messaging.status || "Not connected"}
        todayRevenue={todayRevenue}
        activeOrders={activeOrders}
        availableProducts={available}
        totalProducts={products.length}
        conversationCount={conversations.length}
        conversations={conversations.slice(0, 3).map((conversation) => ({
          id: String(conversation.id || conversation.chatId),
          name: String(conversation.customerName || "Customer"),
          question: String(conversation.lastQuestion || conversation.lastReply || ""),
          time: formatTime(conversation.updatedAt),
          waiting: conversation.status === "Waiting for AI reply",
        }))}
        attention={[
          {
            id: "stock",
            label: "Low stock",
            detail: `${lowStock.length} ${lowStock.length === 1 ? "product is" : "products are"} at five units or fewer`,
            count: lowStock.length,
            href: "/dashboard/products",
          },
          {
            id: "images",
            label: "Missing product pictures",
            detail: `${missingImages.length} ${missingImages.length === 1 ? "product needs" : "products need"} a catalog image`,
            count: missingImages.length,
            href: "/dashboard/products",
          },
          {
            id: "fulfilment",
            label: "Awaiting fulfilment",
            detail: `${awaitingFulfilment.length} paid ${awaitingFulfilment.length === 1 ? "order is" : "orders are"} ready for action`,
            count: awaitingFulfilment.length,
            href: "/dashboard/orders",
          },
        ]}
        orders={orders.slice(0, 4).map((order) => ({
          id: String(order.id),
          number: String(order.orderNumber || "Order"),
          customer: String(order.customerName || "Customer"),
          amount: Number(order.amount || 0),
          status: String(order.status || "Awaiting payment"),
          time: formatTime(order.createdAt),
        }))}
        health={[
          { label: "WhatsApp", value: runtime.messaging.status === "WORKING" ? "Connected" : "Attention needed", healthy: runtime.messaging.status === "WORKING" },
          { label: "Payments", value: runtime.mpesa.configured ? "Connected" : "Setup needed", healthy: runtime.mpesa.configured },
          { label: "Database", value: runtime.mongo.connected ? "Healthy" : "Unavailable", healthy: runtime.mongo.connected },
          { label: "AI Automation", value: runtime.ai.configured ? "Active" : "Setup needed", healthy: runtime.ai.configured },
        ]}
      />
    </DashboardLayout>
  )
}
