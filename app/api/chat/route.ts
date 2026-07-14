import { NextRequest, NextResponse } from 'next/server'
import {
  commerceBusinessProfile,
  formatPrice,
} from '@/lib/commerce-data'
import { readApprovedKnowledge } from '@/src/knowledge-store'
import { readProducts } from '@/src/product-store'
import { getRuntimeSettings } from '@/src/settings-store'
import { readMessageTemplates } from '@/src/template-store'
import { listPayments } from '@/src/mpesa-store'
import { listOrders } from '@/src/order-store'
import { readActivePromotions } from '@/src/promotion-store'
import { promotionCustomerDescription } from '@/src/promotion-engine'

type DashboardPromotion = { name: string; description: string; type: string; value?: number; buyQuantity?: number; getQuantity?: number }
type DashboardProduct = { name: string; price: number; stock: number; available: boolean; image?: { data?: string } | null; imageDataUrl?: string; subtitle?: string; category?: string }
type DashboardPayment = { customerName?: string; phone?: string; amount: number; status: string }
type DashboardOrder = { id: string; orderNumber?: string; status: string; amount: number }

function formatMoney(value: unknown) {
  return `KES ${new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(Number(value || 0))}`
}

function withTimeout<T>(promise: Promise<T>, milliseconds = 4500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Commerce data timed out')), milliseconds)),
  ])
}

async function quickReply(message: string) {
  const input = message.trim().toLowerCase()

  if (/\b(promotion|promotions|promo|promos|offer|offers|discount|discounts)\b/.test(input)) {
    let promotions: DashboardPromotion[]
    try { promotions = await withTimeout(readActivePromotions()) }
    catch { return 'I could not load promotions just now. Please try again or open Promotions: /dashboard/promotions' }
    return promotions.length
      ? `Active promotions:\n\n${promotions.map((promotion) => `• ${promotion.name} — ${promotionCustomerDescription(promotion)} · ${promotion.description}`).join('\n')}\n\nCreate, schedule, or edit offers: /dashboard/promotions`
      : 'There are no active promotions right now. Create one with its discount rules, eligible products, schedule, and usage limit in Promotions.\n\nOpen Promotions: /dashboard/promotions'
  }

  const productQuestion = input.includes('what products') || input.includes('products are available') || input === 'show products' || input.includes('low in stock') || input.includes('low stock') || input.includes('no picture') || input.includes('without picture')
  if (productQuestion) {
    let products: DashboardProduct[]
    try { products = await withTimeout(readProducts()) }
    catch { return 'I could not load the catalog just now. Please try again or open Product Catalog: /dashboard/products' }
    const available = products.filter((product) => product.available && Number(product.stock) > 0)

    if (input.includes('what products') || input.includes('products are available') || input === 'show products') {
    if (!available.length) return 'No products are currently marked as available.\n\nManage the catalog: /dashboard/products'
    return `Available now:\n\n${available.map((product) => `• ${product.name} — ${formatMoney(product.price)} · ${product.stock} in stock`).join('\n')}\n\nManage products: /dashboard/products`
    }

    if (input.includes('low in stock') || input.includes('low stock')) {
      const low = available.filter((product) => Number(product.stock) <= 5)
      return low.length
        ? `Low-stock products:\n\n${low.map((product) => `• ${product.name} — ${product.stock} remaining`).join('\n')}\n\nReview inventory: /dashboard/products`
        : 'No available products are currently at five units or fewer.\n\nReview inventory: /dashboard/products'
    }

    const missing = products.filter((product) => !product.image?.data && !product.imageDataUrl)
    return missing.length
      ? `Products missing pictures:\n\n${missing.map((product) => `• ${product.name}`).join('\n')}\n\nUpload pictures: /dashboard/products`
      : 'Every product currently has a picture.\n\nOpen the catalog: /dashboard/products'
  }

  const paymentQuestion = input.includes('payments failed') || input.includes('failed payment') || ((input.includes('recent') && input.includes('payment')) || input.includes('payment status'))
  if (paymentQuestion) {
    let payments: DashboardPayment[]
    try { payments = await withTimeout(listPayments()) }
    catch { return 'I could not load payment history just now. Please try again or open M-Pesa Payments: /dashboard/payments' }

    if (input.includes('payments failed') || input.includes('failed payment')) {
    const failed = payments.filter((payment) => String(payment.status).toLowerCase().includes('fail')).slice(0, 5)
    return failed.length
      ? `Recent failed payments:\n\n${failed.map((payment) => `• ${payment.customerName || payment.phone} — ${formatMoney(payment.amount)} · ${payment.status}`).join('\n')}\n\nReview and retry payments: /dashboard/payments`
      : 'There are no failed payments in the recent payment history.\n\nView payments: /dashboard/payments'
    }

    const recent = payments.slice(0, 5)
    return recent.length
      ? `Recent payment status:\n\n${recent.map((payment) => `• ${payment.customerName || payment.phone} — ${formatMoney(payment.amount)} · ${payment.status}`).join('\n')}\n\nOpen M-Pesa Payments: /dashboard/payments`
      : 'No payment requests have been recorded yet.\n\nOpen M-Pesa Payments: /dashboard/payments'
  }

  if (input.includes('recent orders') || input === 'show orders') {
    let orders: DashboardOrder[]
    try { orders = await withTimeout(listOrders()) }
    catch { return 'I could not load orders just now. Please try again or open Orders: /dashboard/orders' }
    const recent = orders.slice(0, 5)
    return recent.length
      ? `Recent orders:\n\n${recent.map((order) => `• ${order.orderNumber || order.id} — ${order.status} · ${formatMoney(order.amount)}`).join('\n')}\n\nOpen Orders: /dashboard/orders`
      : 'No orders have been recorded yet.\n\nOpen Orders: /dashboard/orders'
  }

  if (input.includes('cart checkout')) {
    return 'Cart checkout combines the customer’s selected products into one order total. After they send their M-Pesa phone number, the assistant starts one STK Push. The order is confirmed only after a verified Paid callback.\n\nTrack checkout payments: /dashboard/payments\nTrack fulfilment: /dashboard/orders'
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const exactReply = await quickReply(message)
    if (exactReply) {
      return NextResponse.json({ message: exactReply, model: 'commerce-data', timestamp: new Date().toISOString() })
    }

    const runtime = await getRuntimeSettings()
    const groqApiKey = runtime.groqApiKey
    if (!groqApiKey) {
      return NextResponse.json({ error: 'AI service is not configured' }, { status: 500 })
    }

    const [knowledgeEntries, products, templates, promotions] = await Promise.all([
      readApprovedKnowledge(),
      readProducts(),
      readMessageTemplates(),
      readActivePromotions(),
    ])
    const approvedKnowledge = knowledgeEntries
      .map((entry, index) => `${index + 1}. ${entry.topic}: ${entry.content}`)
      .join('\n')
    const catalog = products
      .map((product, index) => {
        const status = product.available ? `available, ${product.stock} in stock` : 'not available'
        const imageStatus = product.image?.data ? 'Product picture uploaded.' : 'No product picture uploaded.'
        return `${index + 1}. ${product.name}: ${product.subtitle}. Category: ${product.category}. Price: ${formatPrice(product.price)}. Status: ${status}. ${imageStatus}`
      })
      .join('\n')
    const approvedTemplates = templates
      .map((template, index) => `${index + 1}. ${template.name} (${template.category}): ${template.body}`)
      .join('\n')
    const activePromotions = promotions
      .map((promotion, index) => `${index + 1}. ${promotion.name}: ${promotionCustomerDescription(promotion)}. ${promotion.description}`)
      .join('\n')

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: runtime.groqModel,
        messages: [
          {
            role: 'system',
            content: `You are a helpful WhatsApp commerce dashboard assistant for ${runtime.businessName || commerceBusinessProfile.name}.

Business profile:
${commerceBusinessProfile.description}

Approved business knowledge:
${approvedKnowledge}

Approved product catalog:
${catalog}

Approved reply templates:
${approvedTemplates || 'No saved templates.'}

Active promotions:
${activePromotions || 'No active promotions.'}

Dashboard sections:
- Overview: /dashboard
- Product Catalog: /dashboard/products
- Promotions: /dashboard/promotions
- Orders: /dashboard/orders
- M-Pesa Payments: /dashboard/payments
- Customer Questions: /dashboard/questions
- Customers: /dashboard/customers
- Bot Settings: /dashboard/bot-settings
- WhatsApp Connection: /dashboard/session
- Approved Knowledge: /dashboard/knowledge
- Message Templates: /dashboard/templates
- Settings: /dashboard/settings

Rules:
- Answer only from approved business knowledge and the product catalog.
- Promotion setup belongs in Promotions, not Approved Knowledge. Never invent controls or promotion records that are not listed above.
- The pricing engine applies the single eligible promotion with the greatest customer saving; offers do not stack.
- Use an approved reply template when it fits, replacing variables only with approved information.
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- Never treat a user's words such as "sent", "paid", or "done" as payment confirmation. Only a payment record with status Paid is confirmed.
- If the data is missing, say what is missing and where to add it in the dashboard.
- Never respond with only a raw route. Explain what the owner will find there, then include the correct route.
- Format lists with one item per line. Keep dashboard links on their own final line when practical.
- Keep answers direct and useful for a store owner managing WhatsApp sales.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI provider API error:', errorData)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 500 })
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.'

    return NextResponse.json({ 
      message: assistantMessage,
      model: runtime.groqModel,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
