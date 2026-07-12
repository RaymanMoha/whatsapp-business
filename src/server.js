import 'dotenv/config'

import express from 'express'
import {
  addCartItems,
  extractCartQuantity,
  formatCartSummary,
  getCartItemCount,
  getCartTotal,
  isAddToCartIntent,
  isClearCartIntent,
  isRemoveFromCartIntent,
  isViewCartIntent,
  matchCartProducts,
  removeCartItems,
  revalidateCartItems,
} from './cart.js'
import { clearCart, getCart, saveCart } from './cart-store.js'
import { approvedKnowledge, businessProfile } from './knowledge.js'
import { appendConversationEvent } from './message-store.js'
import { initiateStkPush } from './mpesa.js'
import { getMpesaStatus, listRecentPaymentsForChat } from './mpesa-store.js'
import { getMongoStatus } from './mongodb.js'
import { findProductsForMessage, readProducts } from './product-store.js'
import { getRuntimeSettings } from './settings-store.js'
import { sendWahaImage, sendWahaText } from './waha.js'

const app = express()

app.use(express.json({ limit: '3mb' }))

const config = {
  port: Number(process.env.PORT || 8080),
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  wahaBaseUrl: process.env.WAHA_BASE_URL || 'http://localhost:3001',
  wahaApiKey: process.env.WAHA_API_KEY || 'change-this-local-api-key',
  wahaSession: process.env.WAHA_SESSION || 'default',
  botName: process.env.BOT_NAME || 'Ask Local',
  businessName: process.env.BUSINESS_NAME || businessProfile.name,
  humanHandoffMessage:
    process.env.HUMAN_HANDOFF_MESSAGE ||
    'I do not have confirmed information for that. Please contact a team member for help.',
  maxHistoryMessages: Number(process.env.MAX_HISTORY_MESSAGES || 8),
  replyToGroups: process.env.WAHA_REPLY_TO_GROUPS === 'true',
}

const conversations = new Map()
const pendingProducts = new Map()
const pendingPayments = new Map()
const seenMessageIds = new Set()

app.get('/health', async (_request, response) => {
  const [mongo, runtime] = await Promise.all([getMongoStatus(), getRuntimeSettings({ fresh: true })])
  const ok = Boolean(runtime.groqApiKey) && mongo.connected
  response.status(ok ? 200 : 503).json({
    ok,
    service: 'waha-groq-bot',
    businessName: runtime.businessName,
    groqConfigured: Boolean(runtime.groqApiKey),
    groqModel: runtime.groqModel,
    mongo,
  })
})

app.post('/webhook', async (request, response) => {
  response.sendStatus(200)

  const incoming = extractIncomingMessage(request.body)
  if (!incoming) return

  if (seenMessageIds.has(incoming.id)) return
  seenMessageIds.add(incoming.id)

  if (incoming.fromMe) return
  if (!config.replyToGroups && incoming.chatId.endsWith('@g.us')) return

  try {
    await appendConversationEvent({
      id: incoming.id,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      direction: 'inbound',
      text: incoming.text,
      status: 'received',
    })
    const products = await readProducts()
    const cartReply = await buildCartReply(incoming, products)
    const paymentReply = cartReply ? null : await buildPaymentReply(incoming, products)
    const commerceReply = cartReply || paymentReply
    const reply = commerceReply || await buildReply(incoming, products)
    await sendWhatsAppText(incoming.chatId, reply, incoming.session)
    if (!commerceReply) {
      await sendRelevantProductImages(incoming, products)
      rememberPendingProduct(incoming.chatId, incoming.text, products)
    }
    await appendConversationEvent({
      id: `${incoming.id}-reply`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      direction: 'assistant',
      text: reply,
      status: 'sent',
    })
    rememberConversation(incoming.chatId, incoming.text, reply)
  } catch (error) {
    console.error('Failed to handle WhatsApp message:', error)
    const runtime = await getRuntimeSettings().catch(() => null)
    const handoffMessage = runtime?.handoffMessage || config.humanHandoffMessage
    await appendConversationEvent({
      id: `${incoming.id}-error`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      direction: 'system',
      text: handoffMessage,
      status: 'failed',
    }).catch(() => {})
    await sendWhatsAppText(incoming.chatId, handoffMessage, incoming.session).catch(
      (sendError) => {
        console.error('Failed to send handoff message:', sendError)
      },
    )
  }
})

app.post('/test/reply', async (request, response) => {
  const message = typeof request.body?.message === 'string' ? request.body.message : ''
  const chatId = typeof request.body?.chatId === 'string' ? request.body.chatId : 'test@c.us'

  if (!message.trim()) {
    response.status(400).json({ error: 'message is required' })
    return
  }

  const products = await readProducts()
  const incoming = {
    id: `test-${Date.now()}`,
    chatId,
    session: config.wahaSession,
    text: message,
    fromMe: false,
  }
  const cartReply = await buildCartReply(incoming, products)
  const paymentReply = cartReply ? null : await buildPaymentReply(incoming, products)
  const commerceReply = cartReply || paymentReply
  const reply = commerceReply || await buildReply(incoming, products)
  if (!commerceReply) rememberPendingProduct(chatId, message, products)

  response.json({
    reply,
    productImages: findProductsForMessage(products, message).filter((product) => product.image?.data).length,
  })
})

app.listen(config.port, () => {
  console.log(`${config.botName} is listening on http://localhost:${config.port}`)
})

function extractIncomingMessage(body) {
  const event = typeof body?.event === 'string' ? body.event : 'message'
  if (!event.startsWith('message')) return null

  const payload = body?.payload ?? body
  const text = extractText(payload)
  const chatId = payload?.chatId || payload?.from || payload?.id?.remote || payload?._data?.from
  const id = payload?.id?._serialized || payload?.id || payload?._data?.id?.id || `${chatId}-${Date.now()}`
  const fromMe = Boolean(payload?.fromMe || payload?.id?.fromMe || payload?._data?.id?.fromMe)
  const session = payload?.session || body?.session || config.wahaSession
  const customerName =
    payload?.notifyName ||
    payload?.pushName ||
    payload?.contact?.pushName ||
    payload?._data?.notifyName ||
    chatId

  if (!chatId || !text) return null

  return {
    id: String(id),
    chatId: String(chatId),
    session: String(session),
    text: String(text).trim(),
    fromMe,
    customerName: String(customerName),
  }
}

async function buildCartReply(incoming, products) {
  const chatId = incoming.chatId
  const currentCart = await getCart(chatId)

  if (isClearCartIntent(incoming.text)) {
    await clearCart(chatId)
    pendingPayments.delete(chatId)
    return 'Your cart is now empty. Ask me to show the available products whenever you are ready.'
  }

  if (isRemoveFromCartIntent(incoming.text)) {
    const matched = matchCartProducts(products, incoming.text)
    if (!currentCart.length) return 'Your cart is empty.'
    if (!matched.length) {
      return `${formatCartSummary(currentCart)}\n\nTell me which product to remove, for example: "remove Green Tea from cart".`
    }

    const nextCart = removeCartItems(currentCart, matched.map((product) => product.id))
    await saveCart(chatId, nextCart)
    return nextCart.length
      ? `Removed ${matched.map((product) => product.name).join(', ')}.\n\n${formatCartSummary(nextCart)}\n\nReply "pay cart" when ready.`
      : 'Removed. Your cart is now empty.'
  }

  if (isAddToCartIntent(incoming.text)) {
    const matched = matchCartProducts(products, incoming.text)
    if (!matched.length) {
      return 'Which product should I add? Use its product name, for example: "add Organic Honey to cart".'
    }

    const unavailable = matched.filter((product) => !product.available || Number(product.stock || 0) < 1)
    const available = matched.filter((product) => product.available && Number(product.stock || 0) > 0)
    const quantity = matched.length === 1 ? extractCartQuantity(incoming.text) : 1
    const nextCart = addCartItems(currentCart, available, quantity)
    await saveCart(chatId, nextCart)
    if (available.length) pendingProducts.set(chatId, available.at(-1))

    const messages = []
    if (available.length) {
      messages.push(`Added ${available.map((product) => product.name).join(', ')} to your cart.`)
    }
    if (unavailable.length) {
      messages.push(`Not added: ${unavailable.map((product) => `${product.name} is sold out`).join(', ')}.`)
    }
    if (nextCart.length) {
      messages.push(formatCartSummary(nextCart), 'Reply "pay cart" when ready, or keep adding products.')
    }
    return messages.join('\n\n')
  }

  if (isViewCartIntent(incoming.text)) {
    return currentCart.length
      ? `${formatCartSummary(currentCart)}\n\nReply "pay cart" to receive one M-Pesa prompt for the total.`
      : 'Your cart is empty. Say "add Organic Honey to cart" to get started.'
  }

  return null
}

async function buildPaymentReply(incoming, products) {
  const hasPaymentIntent = isPaymentIntent(incoming.text)
  const pendingPayment = pendingPayments.get(incoming.chatId) || null
  const currentCart = await getCart(incoming.chatId)
  const typedPhone = extractPaymentPhone(incoming.text)
  const shouldContinuePayment = Boolean(
    hasPaymentIntent ||
      pendingPayment ||
      (currentCart.length && typedPhone) ||
      (pendingProducts.has(incoming.chatId) && typedPhone),
  )

  if (!shouldContinuePayment) return null

  let requestedItems = currentCart
  if (!requestedItems.length) {
    const product = resolvePaymentProduct(incoming.chatId, incoming.text, products)
    if (product) {
      requestedItems = addCartItems([], [product], 1)
    }
  }

  if (!requestedItems.length) {
    pendingPayments.set(incoming.chatId, { requestedAt: new Date().toISOString() })
    return 'Your cart is empty. Add products first, for example: "add Organic Honey and Green Tea to cart".'
  }

  const { items, issues } = revalidateCartItems(requestedItems, products)
  if (issues.length) {
    return `I could not check out this cart:\n- ${issues.join('\n- ')}\n\nUpdate your cart and try again.`
  }

  pendingPayments.set(incoming.chatId, {
    requestedAt: pendingPayment?.requestedAt || new Date().toISOString(),
    productId: items.length === 1 ? items[0].productId : null,
    lineItems: items,
  })

  const phone = typedPhone || extractPhoneFromChatId(incoming.chatId)
  if (!phone) {
    return `${formatCartSummary(items)}\n\nSend the M-Pesa phone number, for example: "2547XXXXXXX".`
  }

  const mpesa = await getMpesaStatus()
  if (!mpesa.configured) {
    return `M-Pesa is not fully configured yet. Missing: ${mpesa.missing.join(', ')}.`
  }

  try {
    const amount = getCartTotal(items)
    const itemCount = getCartItemCount(items)
    const productName = items.length === 1 ? items[0].name : `${itemCount}-item cart`
    const payment = await initiateStkPush({
      phone,
      amount,
      accountReference: items.length === 1 ? items[0].productId : `CART${Date.now().toString(36)}`,
      description: `${productName} WhatsApp order`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      productId: items.length === 1 ? items[0].productId : null,
      productName,
      lineItems: items,
      itemCount,
      source: 'whatsapp',
    })
    pendingProducts.delete(incoming.chatId)
    pendingPayments.delete(incoming.chatId)
    await clearCart(incoming.chatId)
    return [
      formatCartSummary(items, 'Payment request'),
      payment.customerMessage || 'Check your phone and enter your M-Pesa PIN to complete payment.',
    ].join('\n')
  } catch (error) {
    return `I could not start the M-Pesa payment for this cart: ${error.message}`
  }
}

function extractText(payload) {
  if (typeof payload?.body === 'string') return payload.body
  if (typeof payload?.text === 'string') return payload.text
  if (typeof payload?.message?.text === 'string') return payload.message.text
  if (typeof payload?._data?.body === 'string') return payload._data.body
  return ''
}

function isPaymentIntent(text) {
  const lower = String(text || '').toLowerCase()
  return [
    'pay',
    'payment',
    'checkout',
    'check out',
    'buy now',
    'place order',
    'take one',
    'i will take',
    "i'll take",
    'mpesa',
    'm-pesa',
    'stk',
  ].some((phrase) => lower.includes(phrase))
}

function resolvePaymentProduct(chatId, text, products) {
  const [matchedProduct] = findProductsForMessage(products, text, 1)
  if (matchedProduct) {
    pendingProducts.set(chatId, matchedProduct)
    return matchedProduct
  }

  const pendingPayment = pendingPayments.get(chatId)
  if (pendingPayment?.productId) {
    const product = products.find((item) => item.id === pendingPayment.productId)
    if (product) return product
  }

  return pendingProducts.get(chatId) || null
}

function rememberPendingProduct(chatId, text, products) {
  const [matchedProduct] = findProductsForMessage(products, text, 1)
  if (matchedProduct) {
    pendingProducts.set(chatId, matchedProduct)
  }
}

function extractPaymentPhone(text) {
  const match = String(text || '').match(/(?:\+?254|0)?7\d{8}/)
  return match ? normalizePaymentPhone(match[0]) : ''
}

function extractPhoneFromChatId(chatId) {
  const digits = String(chatId || '').split('@')[0]?.replace(/\D/g, '') || ''
  return normalizePaymentPhone(digits)
}

function normalizePaymentPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.startsWith('254') && digits.length === 12) return digits
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.startsWith('7') && digits.length === 9) return `254${digits}`
  return ''
}

async function buildReply(incoming, products) {
  const runtime = await getRuntimeSettings()
  if (!runtime.groqApiKey) {
    return 'The AI assistant is not configured yet. Add GROQ_API_KEY to .env and restart the bot.'
  }

  const history = conversations.get(incoming.chatId) || []
  const paymentContext = await buildPaymentContext(incoming.chatId)
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${runtime.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: runtime.groqModel,
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        { role: 'system', content: buildSystemPrompt(products, paymentContext, runtime) },
        ...history,
        { role: 'user', content: incoming.text.slice(0, 1200) },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Groq request failed: ${response.status} ${body}`)
  }

  const data = await response.json()
  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    runtime.handoffMessage
  )
}

async function buildPaymentContext(chatId) {
  const payments = await listRecentPaymentsForChat(chatId).catch(() => [])
  if (payments.length === 0) return 'No recent payment records for this chat.'

  return payments
    .slice(0, 5)
    .map((payment, index) => {
      const product = Array.isArray(payment.lineItems) && payment.lineItems.length
        ? payment.lineItems.map((item) => `${item.quantity} x ${item.name}`).join(', ')
        : payment.productName || payment.accountReference || 'order'
      const receipt = payment.mpesaReceiptNumber ? ` Receipt: ${payment.mpesaReceiptNumber}.` : ''
      return `${index + 1}. ${product}: KES ${payment.amount}, status ${payment.status}.${receipt}`
    })
    .join('\n')
}

function buildSystemPrompt(products, paymentContext, runtime) {
  const knowledge = approvedKnowledge
    .map((entry, index) => `${index + 1}. ${entry.topic}: ${entry.content}`)
    .join('\n')
  const catalog = products
    .map((product, index) => {
      const status = product.available ? `available, ${product.stock} in stock` : 'not available'
      const imageStatus = product.image?.data ? 'Product picture available and can be sent after the text reply.' : 'No product picture uploaded.'
      return `${index + 1}. ${product.name}: ${product.subtitle}. Category: ${product.category}. Price: KES ${product.price}. Status: ${status}. ${imageStatus}`
    })
    .join('\n')

  return `You are ${runtime.botName}, a WhatsApp FAQ assistant for ${runtime.businessName}.

Business profile:
${businessProfile.description}

Tone:
${businessProfile.tone}

Approved information:
${knowledge}

Approved product catalog:
${catalog}

Recent payment records for this WhatsApp chat:
${paymentContext}

Rules:
- Answer only from the approved information above.
- For product questions, answer only from the approved product catalog above.
- Keep replies short enough for WhatsApp.
- If the user asks for private payment data, OTPs, PINs, passwords, or sensitive information, refuse and give a safe next step.
- If the approved information does not answer the question, say: "${runtime.handoffMessage}"
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- If booking details are needed, ask for the minimum next detail.`
}

async function sendRelevantProductImages(incoming, products) {
  const productsToSend = findProductsForMessage(products, incoming.text)
    .filter((product) => product.image?.data && product.image?.mimetype)
    .slice(0, 3)

  if (productsToSend.length === 0) {
    return
  }

  for (const product of productsToSend) {
    console.log(`Sending product image to ${incoming.chatId}: ${product.name}`)
    await sendWhatsAppImage(incoming.chatId, product, incoming.session)
    await appendConversationEvent({
      id: `${incoming.id}-image-${product.id}`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      direction: 'assistant',
      text: `Sent product image: ${product.name}`,
      status: 'sent',
    })
  }
}

async function sendWhatsAppText(chatId, text, session) {
  await sendWahaText(chatId, text, session || config.wahaSession)
}

async function sendWhatsAppImage(chatId, product, session) {
  await sendWahaImage(chatId, product, session)
}

function rememberConversation(chatId, userText, assistantText) {
  const history = conversations.get(chatId) || []
  history.push({ role: 'user', content: userText.slice(0, 1200) })
  history.push({ role: 'assistant', content: assistantText.slice(0, 1200) })
  conversations.set(chatId, history.slice(-config.maxHistoryMessages))
}
