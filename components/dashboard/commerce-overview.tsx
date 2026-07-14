import Link from "next/link"
import {
  ArrowUpRight, Bot, Box, CheckCircle2, ChevronRight, CircleDollarSign,
  Clock3, CreditCard, Database, ImageOff, MessageCircleMore, PackagePlus,
  ShoppingBag, Smartphone, Sparkles, TriangleAlert,
} from "lucide-react"

type ConversationPreview = { id: string; name: string; question: string; time: string; waiting: boolean }
type RecentOrder = { id: string; number: string; customer: string; amount: number; status: string; time: string }
type AttentionItem = { id: "stock" | "images" | "fulfilment"; label: string; detail: string; count: number; href: string }
type HealthItem = { label: string; value: string; healthy: boolean }

type CommerceOverviewProps = {
  greeting: string
  firstName: string
  connected: boolean
  connectionLabel: string
  todayRevenue: number
  activeOrders: number
  availableProducts: number
  totalProducts: number
  conversationCount: number
  conversations: ConversationPreview[]
  attention: AttentionItem[]
  orders: RecentOrder[]
  health: HealthItem[]
}

const statusStyles: Record<string, string> = {
  "Awaiting payment": "border-amber-200 bg-amber-50 text-amber-800",
  "Payment failed": "border-red-200 bg-red-50 text-red-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Preparing: "border-blue-200 bg-blue-50 text-blue-700",
  Ready: "border-violet-200 bg-violet-50 text-violet-700",
  Completed: "border-zinc-200 bg-zinc-50 text-zinc-600",
  Cancelled: "border-zinc-200 bg-zinc-50 text-zinc-500",
}

const attentionIcon = { stock: Box, images: ImageOff, fulfilment: Clock3 }
const attentionTone = {
  stock: "bg-red-50 text-red-600",
  images: "bg-amber-50 text-amber-700",
  fulfilment: "bg-blue-50 text-blue-700",
}
const quickActions = [
  { label: "Products", href: "/dashboard/products", icon: Box },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Bot settings", href: "/dashboard/bot-settings", icon: Bot },
]

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CU"
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 })
    .format(amount)
    .replace("Ksh", "KES")
}

export function CommerceOverview(props: CommerceOverviewProps) {
  const {
    greeting, firstName, connected, connectionLabel, todayRevenue, activeOrders,
    availableProducts, totalProducts, conversationCount, conversations,
    attention, orders, health,
  } = props
  const metrics = [
    { label: "Today’s revenue", value: formatCurrency(todayRevenue), note: todayRevenue > 0 ? "Confirmed payments today" : "No confirmed payments yet", icon: CircleDollarSign },
    { label: "Active orders", value: String(activeOrders), note: activeOrders === 1 ? "Order needs attention" : "Orders in progress", icon: ShoppingBag },
    { label: "Available products", value: `${availableProducts}/${totalProducts}`, note: totalProducts ? "Live catalog availability" : "Add your first product", icon: Box },
    { label: "Customer conversations", value: String(conversationCount), note: conversationCount === 1 ? "Customer thread" : "Customer threads", icon: MessageCircleMore },
  ]
  const activeAttention = attention.filter((item) => item.count > 0)
  const allHealthy = health.every((item) => item.healthy)

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1500px] pb-3">
      <header className="overview-enter mb-5 pr-14 sm:mb-6">
        <h1 className="max-w-4xl text-[2.25rem] leading-[0.98] tracking-[-0.035em] text-[#10231f] sm:text-5xl lg:text-[3.65rem]" style={{ fontFamily: "var(--calson-font)" }}>
          {greeting}, {firstName}.
        </h1>
        <p className="mt-2.5 text-sm font-medium text-zinc-600 sm:text-base">
          Your store is {connected ? "connected and ready to sell" : "waiting for its WhatsApp connection"}.
        </p>
      </header>

      <section className="overview-enter overview-delay-1 relative overflow-hidden rounded-[24px] bg-[#073f36] text-white shadow-[0_22px_60px_-38px_rgba(7,63,54,0.9)]">
        <div className="pointer-events-none absolute -left-24 top-6 h-56 w-56 rounded-full bg-[#c7f36a]/10 blur-3xl" />
        <div className="grid min-h-[270px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex flex-col justify-between border-white/10 p-6 sm:p-8 lg:border-r lg:p-9">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-50">
                <span className="relative flex size-2.5">
                  {connected ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c7f36a] opacity-50" /> : null}
                  <span className={`relative inline-flex size-2.5 rounded-full ${connected ? "bg-[#c7f36a]" : "bg-amber-400"}`} />
                </span>
                {connected ? "WhatsApp connected" : connectionLabel}
              </div>
              <h2 className="mt-5 max-w-md text-[2.65rem] leading-[0.95] tracking-[-0.035em] sm:text-[3.4rem]" style={{ fontFamily: "var(--calson-font)" }}>
                {connected ? "Commerce is moving." : "Reconnect to start selling."}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/70">
                {connected ? "Customers can ask, order, and pay while you stay focused on fulfilment." : "Open the connection page to restore customer messages and automated selling."}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/questions" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#c7f36a] px-5 text-sm font-semibold text-[#10231f] transition hover:-translate-y-0.5 hover:bg-[#d4fa83] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f36a]">
                <MessageCircleMore className="size-4.5" /> View customer questions
              </Link>
              <Link href="/dashboard/products" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-white/35 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <PackagePlus className="size-4.5" /> Add a product
              </Link>
            </div>
          </div>

          <div className="relative p-6 sm:p-8 lg:p-9">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-semibold text-white">Live customer conversations</p><p className="mt-1 text-xs text-emerald-50/55">Most recently active</p></div>
              <Link href="/dashboard/questions" className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#c7f36a]">View all <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            </div>
            {conversations.length ? (
              <div className="mt-5 space-y-2.5">
                {conversations.slice(0, 3).map((conversation, index) => (
                  <Link href="/dashboard/questions" key={conversation.id} className="overview-row group flex items-center gap-3 rounded-xl border border-white/8 bg-white/7 p-3 transition hover:border-white/15 hover:bg-white/11" style={{ animationDelay: `${180 + index * 70}ms` }}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-[#073f36]">{initials(conversation.name)}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{conversation.name}</span><span className="mt-0.5 block truncate text-xs text-emerald-50/65">{conversation.question || "Conversation opened"}</span></span>
                    <span className="flex shrink-0 items-center gap-2 text-[11px] text-emerald-50/55"><span>{conversation.time}</span><span className={`size-1.5 rounded-full ${conversation.waiting ? "bg-amber-300" : "bg-[#c7f36a]"}`} /></span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex min-h-[164px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center">
                <div><MessageCircleMore className="mx-auto size-7 text-[#c7f36a]" /><p className="mt-3 text-sm font-semibold">Your conversation stream is ready</p><p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-emerald-50/60">New customer questions will appear here as they arrive.</p></div>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-50/60"><span className={`size-2 rounded-full ${connected ? "bg-[#c7f36a]" : "bg-amber-400"}`} />{conversationCount} active {conversationCount === 1 ? "conversation" : "conversations"}</div>
          </div>
        </div>
      </section>

      <section className="overview-enter overview-delay-2 mt-4 grid overflow-hidden rounded-[20px] border border-[#dce5e1] bg-white shadow-[0_12px_35px_-32px_rgba(7,63,54,0.7)] sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className={`flex min-h-[132px] items-center gap-4 p-5 sm:p-6 ${index > 0 ? "border-t border-[#e5ebe8] sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t xl:border-l xl:border-t-0" : ""}`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#b7cbc4] bg-[#f6faf8] text-[#073f36]"><Icon className="size-5" strokeWidth={1.8} /></span>
              <div className="min-w-0"><p className="text-xs font-medium text-zinc-600">{metric.label}</p><strong className="mt-1 block truncate text-[1.65rem] leading-none tracking-[-0.035em] text-[#10231f]">{metric.value}</strong><p className="mt-2 truncate text-[11px] text-zinc-500">{metric.note}</p></div>
            </div>
          )
        })}
      </section>

      <div className="overview-enter overview-delay-3 mt-4 grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
        <section className="overflow-hidden rounded-[20px] border border-[#dce5e1] bg-white shadow-[0_12px_35px_-32px_rgba(7,63,54,0.7)]">
          <div className="flex items-end justify-between border-b border-[#e6ece9] px-5 py-5 sm:px-6">
            <div><h2 className="text-lg font-semibold tracking-[-0.02em] text-[#10231f]">What needs attention</h2><p className="mt-1 text-xs text-zinc-500">Priorities that can unblock more sales</p></div>
            <span className="rounded-full bg-[#eff7f3] px-2.5 py-1 text-[11px] font-semibold text-[#073f36]">{activeAttention.reduce((total, item) => total + item.count, 0)} open</span>
          </div>
          {activeAttention.length ? (
            <div className="divide-y divide-[#e6ece9] px-5 sm:px-6">
              {activeAttention.map((item) => {
                const Icon = attentionIcon[item.id]
                return (
                  <Link key={item.id} href={item.href} className="group flex items-center gap-4 py-4">
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${attentionTone[item.id]}`}><Icon className="size-5" strokeWidth={1.8} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#10231f]">{item.label}</span><span className="mt-0.5 block truncate text-xs text-zinc-500">{item.detail}</span></span>
                    <span className="text-xl font-semibold text-[#073f36]">{item.count}</span><ChevronRight className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex min-h-[224px] items-center justify-center px-6 py-10 text-center"><div><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="size-6" /></span><p className="mt-3 text-sm font-semibold text-[#10231f]">Nothing urgent right now</p><p className="mt-1 text-xs text-zinc-500">Your catalog and active orders look healthy.</p></div></div>
          )}
        </section>

        <section className="overflow-hidden rounded-[20px] border border-[#dce5e1] bg-white shadow-[0_12px_35px_-32px_rgba(7,63,54,0.7)]">
          <div className="flex items-end justify-between border-b border-[#e6ece9] px-5 py-5 sm:px-6">
            <div><h2 className="text-lg font-semibold tracking-[-0.02em] text-[#10231f]">Recent orders</h2><p className="mt-1 text-xs text-zinc-500">Latest checkout and fulfilment activity</p></div>
            <Link href="/dashboard/orders" className="group inline-flex items-center gap-1 text-xs font-semibold text-[#073f36]">View all orders <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
          {orders.length ? (
            <div className="divide-y divide-[#e6ece9] px-5 sm:px-6">
              {orders.slice(0, 4).map((order) => (
                <Link key={order.id} href="/dashboard/orders" className="group grid grid-cols-[1fr_auto] items-center gap-3 py-3.5 sm:grid-cols-[0.8fr_1.1fr_auto_auto]">
                  <span className="text-xs font-semibold text-[#073f36]">{order.number}</span><span className="hidden truncate text-xs font-medium text-zinc-700 sm:block">{order.customer}</span><span className="text-right text-xs font-semibold text-[#10231f]">{formatCurrency(order.amount)}</span>
                  <span className="flex items-center justify-end gap-3"><span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${statusStyles[order.status] || "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>{order.status}</span><ChevronRight className="hidden size-4 text-zinc-400 transition-transform group-hover:translate-x-1 sm:block" /></span>
                  <span className="col-span-2 text-[11px] text-zinc-400 sm:hidden">{order.customer} · {order.time}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[224px] items-center justify-center px-6 py-10 text-center"><div><ShoppingBag className="mx-auto size-7 text-[#739088]" strokeWidth={1.6} /><p className="mt-3 text-sm font-semibold text-[#10231f]">Orders will collect here</p><p className="mt-1 text-xs text-zinc-500">A confirmed customer checkout creates the first order.</p></div></div>
          )}
        </section>
      </div>

      <nav aria-label="Quick actions" className="overview-enter overview-delay-4 mt-4 grid overflow-hidden rounded-[18px] border border-[#dce5e1] bg-white sm:grid-cols-[auto_repeat(4,1fr)]">
        <div className="flex items-center gap-2 border-b border-[#e6ece9] px-5 py-4 sm:border-b-0 sm:border-r"><Sparkles className="size-4 text-[#073f36]" /><span className="text-sm font-semibold text-[#10231f]">Quick actions</span></div>
        {quickActions.map(({ label, href, icon: Icon }, index) => (
          <Link aria-label={label} key={label} href={href} className={`group flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-zinc-700 transition hover:bg-[#f3f8f5] hover:text-[#073f36] ${index ? "border-t border-[#e6ece9] sm:border-l sm:border-t-0" : ""}`}><span className="flex items-center gap-2.5"><Icon className="size-4.5 text-[#073f36]" strokeWidth={1.8} />{label}</span><ChevronRight className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1" /></Link>
        ))}
      </nav>

      <section className="overview-enter overview-delay-4 mt-4 flex flex-col gap-3 border-t border-[#dce5e1] px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#10231f]">{allHealthy ? <CheckCircle2 className="size-4 text-emerald-600" /> : <TriangleAlert className="size-4 text-amber-600" />}Connection health</div>
        <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-2 sm:flex sm:justify-end sm:gap-6">
          {health.map((item) => {
            const Icon = item.label === "WhatsApp" ? Smartphone : item.label === "Payments" ? CreditCard : item.label === "Database" ? Database : Sparkles
            return <div key={item.label} className="flex items-center gap-2 text-[11px] text-zinc-500"><Icon className="size-3.5 text-zinc-500" /><span className="font-medium text-zinc-700">{item.label}</span><span className={`size-1.5 rounded-full ${item.healthy ? "bg-emerald-500" : "bg-amber-500"}`} /><span className="truncate">{item.value}</span></div>
          })}
        </div>
      </section>
    </div>
  )
}
