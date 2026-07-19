import 'dotenv/config'

import express from 'express'
import {
  addCartItems,
  extractCartQuantity,
  formatCartSummary,
  getCartItemCount,
  isAddToCartIntent,
  isCartQuantityIntent,
  isClearCartIntent,
  isProductSelectionIntent,
  isRemoveFromCartIntent,
  isViewCartIntent,
  matchCartProducts,
  removeCartItems,
  revalidateCartItems,
  setCartItemQuantity,
} from './cart.js'
import { clearCart, getCart, saveCart } from './cart-store.js'
import { businessProfile } from './knowledge.js'
import { readApprovedKnowledge } from './knowledge-store.js'
import { appendConversationEvent } from './message-store.js'
import { claimIncomingMessage, claimPaymentDelivery, completeIncomingMessage, completePaymentDelivery, enqueueIncomingMessage, failIncomingMessage, failPaymentDelivery, getMessageQueueStatus } from './message-queue.js'
import { initiateStkPush } from './mpesa.js'
import { getMpesaStatus, getPaymentById, listRecentPaymentsForChat, updatePaymentById } from './mpesa-store.js'
import { getOrderById, syncOrderFromPayment } from './order-store.js'
import { isPaymentConfirmationClaim, paymentClaimReply } from './payment-status.js'
import { getMongoStatus } from './mongodb.js'
import { findProductsForMessage, readProducts } from './product-store.js'
import { sanitizeWhatsAppReply, selectWhatsAppProductImages } from './whatsapp-product-ux.js'
import { getRuntimeSettings } from './settings-store.js'
import { sendWahaFile, sendWahaImage, sendWahaText } from './waha.js'
import { readMessageTemplates } from './template-store.js'
import { verifyWebhookSignature } from './webhook-auth.js'
import { getReceiptByPaymentId, markReceiptShared } from './receipt-store.js'
import { calculateCartPricing, promotionCustomerDescription } from './promotion-engine.js'
import { readActivePromotions } from './promotion-store.js'
import { writeRuntimeHeartbeat } from './runtime-heartbeat.js'
import { getWahaConfig } from './waha.js'
import { buildDemoReply } from './demo.js'

const app = express()

app.use(express.json({
  limit: '3mb',
  verify: (request, _response, buffer) => {
    request.rawBody = Buffer.from(buffer)
  },
}))

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
const workerId = `bot-${process.pid}`
let workerBusy = false
let heartbeatBusy = false

async function publishRuntimeHeartbeat() {
  if (heartbeatBusy) return
  heartbeatBusy = true
  try {
    const [runtime, waha] = await Promise.all([getRuntimeSettings({ fresh: true }), getWahaConfig()])
    let session = null
    let messagingError = null
    try {
      const response = await fetch(`${waha.baseUrl}/api/sessions?all=true`, {
        headers: { 'X-Api-Key': waha.apiKey },
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) throw new Error(`WhatsApp status request failed (${response.status})`)
      const sessions = await response.json()
      session = Array.isArray(sessions)
        ? sessions.find((item) => item.name === waha.session) || sessions[0] || null
        : null
    } catch (error) {
      messagingError = String(error?.message || error || 'WhatsApp status unavailable').slice(0, 250)
    }

    await writeRuntimeHeartbeat({
      bot: {
        online: true,
        configured: Boolean(runtime.groqApiKey),
        businessName: runtime.businessName,
      },
      messaging: {
        online: session?.status === 'WORKING',
        session: session?.name || waha.session,
        status: session?.status || 'NOT_CONNECTED',
        phone: session?.me?.id || null,
        pushName: session?.me?.pushName || null,
        error: messagingError,
      },
    })
  } catch (error) {
    console.error('Failed to publish commerce heartbeat:', error)
  } finally {
    heartbeatBusy = false
  }
}

app.get('/health', async (_request, response) => {
  const [mongo, runtime, queue] = await Promise.all([getMongoStatus(), getRuntimeSettings({ fresh: true }), getMessageQueueStatus()])
  const ok = Boolean(runtime.groqApiKey) && mongo.connected
  response.status(ok ? 200 : 503).json({
    ok,
    service: 'whatsapp-commerce-bot',
    businessName: runtime.businessName,
    aiConfigured: Boolean(runtime.groqApiKey),
    aiModel: runtime.groqModel,
    mongo,
    queue,
  })
})

app.post('/webhook', async (request, response) => {
  const webhookKey = process.env.WHATSAPP_HOOK_HMAC_KEY || ''
  if (!webhookKey && process.env.NODE_ENV === 'production') {
    response.status(503).json({ error: 'Webhook authentication is not configured' })
    return
  }
  if (webhookKey && !verifyWebhookSignature(
    request.rawBody,
    request.get('x-webhook-hmac'),
    request.get('x-webhook-hmac-algorithm'),
    webhookKey,
  )) {
    response.status(401).json({ error: 'Invalid webhook signature' })
    return
  }

  const incoming = extractIncomingMessage(request.body)
  if (!incoming || incoming.fromMe || (!config.replyToGroups && incoming.chatId.endsWith('@g.us'))) {
    response.sendStatus(204)
    return
  }

  const queued = await enqueueIncomingMessage(incoming)
  response.status(queued.duplicate ? 200 : 202).json(queued)
})

async function processIncomingMessage(incoming) {
  await appendConversationEvent({
    id: incoming.id,
    chatId: incoming.chatId,
    customerName: incoming.customerName,
    direction: 'inbound',
    text: incoming.text,
    status: 'received',
  })
  const demoReply = buildDemoReply(incoming.text)
  const [products, promotions] = demoReply
    ? [[], []]
    : await Promise.all([readProducts(), readActivePromotions()])
  const cartReply = demoReply ? null : await buildCartReply(incoming, products, promotions)
  const paymentReply = cartReply ? null : await buildPaymentReply(incoming, products, promotions)
  const promotionReply = demoReply || cartReply || paymentReply ? null : buildPromotionReply(incoming.text, promotions)
  const commerceReply = demoReply || cartReply || paymentReply || promotionReply
  const reply = sanitizeWhatsAppReply(commerceReply || await buildReply(incoming, products, promotions))
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
}

async function runMessageWorker() {
  if (workerBusy) return
  workerBusy = true

  try {
    const incomingEvent = await claimIncomingMessage(workerId)
    if (incomingEvent) {
      try {
        await processIncomingMessage(incomingEvent.message)
        await completeIncomingMessage(incomingEvent.id)
      } catch (error) {
        console.error('Failed to handle queued WhatsApp message:', error)
        await failIncomingMessage(incomingEvent.id, error, incomingEvent.attempts)
      }
      return
    }

    const delivery = await claimPaymentDelivery(workerId)
    if (delivery) {
      try {
        await processPaymentDelivery(delivery)
        await completePaymentDelivery(delivery.id)
      } catch (error) {
        console.error('Failed to deliver payment confirmation:', error)
        await failPaymentDelivery(delivery.id, error, delivery.attempts)
      }
    }
  } catch (error) {
    console.error('Message worker failed:', error)
  } finally {
    workerBusy = false
  }
}

async function processPaymentDelivery(job) {
  const [payment, order] = await Promise.all([getPaymentById(job.paymentId), getOrderById(job.orderId)])
  if (!payment || payment.status !== 'Paid' || !order) throw new Error('Paid order is unavailable for delivery')
  const targetChatId = payment.chatId || (payment.phone ? `${String(payment.phone).replace(/\D/g, '')}@c.us` : '')
  if (!targetChatId) throw new Error('Payment has no WhatsApp recipient')

  if (!payment.confirmationSentAt) {
    const items = Array.isArray(payment.lineItems) && payment.lineItems.length
      ? payment.lineItems.map((item) => `${item.quantity || 1} x ${item.name || 'item'}`)
      : [payment.productName || payment.accountReference || 'your order']
    const savings = Number(payment.discount || 0) > 0 ? [`Promotion: ${payment.promotion?.name || 'Offer'} (-KES ${payment.discount}).`] : []
    const message = ['Payment received for your order.', ...items, ...savings, `Amount: KES ${payment.amount}.`, `Order: ${order.orderNumber}.`, `Receipt: ${payment.mpesaReceiptNumber}.`, 'Your order is confirmed and waiting for preparation.'].join('\n')
    await sendWahaText(targetChatId, message)
    await updatePaymentById(payment.id, { confirmationSentAt: new Date().toISOString() })
    await appendConversationEvent({ id: `${payment.checkoutRequestId}-payment-confirmed`, chatId: targetChatId, customerName: payment.customerName || targetChatId, direction: 'assistant', text: message, status: 'sent' })
  }

  if (!payment.receiptSharedAt) {
    const receipt = await getReceiptByPaymentId(payment.id)
    if (!receipt) throw new Error('Payment receipt is unavailable')
    await sendWahaFile(targetChatId, receipt, `Receipt for order ${order.orderNumber}. Thank you for your payment.`)
    const receiptSharedAt = await markReceiptShared(payment.id)
    await updatePaymentById(payment.id, { receiptSharedAt })
    await appendConversationEvent({ id: `${payment.checkoutRequestId}-receipt-shared`, chatId: targetChatId, customerName: payment.customerName || targetChatId, direction: 'assistant', text: `Shared payment receipt: ${receipt.receiptNumber}`, status: 'sent' })
  }
}

app.post('/test/reply', async (request, response) => {
  const message = typeof request.body?.message === 'string' ? request.body.message : ''
  const chatId = typeof request.body?.chatId === 'string' ? request.body.chatId : 'test@c.us'

  if (!message.trim()) {
    response.status(400).json({ error: 'message is required' })
    return
  }

  const demoReply = buildDemoReply(message)
  const [products, promotions] = demoReply
    ? [[], []]
    : await Promise.all([readProducts(), readActivePromotions()])
  const incoming = {
    id: `test-${Date.now()}`,
    chatId,
    session: config.wahaSession,
    text: message,
    fromMe: false,
  }
  const cartReply = demoReply ? null : await buildCartReply(incoming, products, promotions)
  const paymentReply = cartReply ? null : await buildPaymentReply(incoming, products, promotions)
  const promotionReply = demoReply || cartReply || paymentReply ? null : buildPromotionReply(incoming.text, promotions)
  const commerceReply = demoReply || cartReply || paymentReply || promotionReply
  const reply = sanitizeWhatsAppReply(commerceReply || await buildReply(incoming, products, promotions))
  if (!commerceReply) rememberPendingProduct(chatId, message, products)

  response.json({
    reply,
    productImages: selectWhatsAppProductImages(products, message).length,
  })
})

app.listen(config.port, () => {
  console.log(`${config.botName} is listening on http://localhost:${config.port}`)
  setInterval(runMessageWorker, 1000).unref()
  setInterval(publishRuntimeHeartbeat, 15_000).unref()
  runMessageWorker().catch((error) => console.error('Initial message worker failed:', error))
  publishRuntimeHeartbeat().catch((error) => console.error('Initial heartbeat failed:', error))
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

async function buildCartReply(incoming, products, promotions) {
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
      return `${formatCartSummary(currentCart, 'Your cart', calculateCartPricing(currentCart, promotions))}\n\nTell me which product to remove, for example: "remove Green Tea from cart".`
    }

    const nextCart = removeCartItems(currentCart, matched.map((product) => product.id))
    await saveCart(chatId, nextCart)
    return nextCart.length
      ? `Removed ${matched.map((product) => product.name).join(', ')}.\n\n${formatCartSummary(nextCart, 'Your cart', calculateCartPricing(nextCart, promotions))}\n\nReply "pay cart" when ready.`
      : 'Removed. Your cart is now empty.'
  }

  const matchedSelection = matchCartProducts(products, incoming.text)
  const explicitAdd = isAddToCartIntent(incoming.text)
  const implicitSelection = !explicitAdd && isProductSelectionIntent(incoming.text, matchedSelection)

  if (!explicitAdd && isCartQuantityIntent(incoming.text)) {
    const targetProduct =
      (matchedSelection.length === 1 ? matchedSelection[0] : null) ||
      pendingProducts.get(chatId) ||
      (currentCart.length === 1
        ? products.find((product) => product.id === currentCart[0].productId)
        : null)

    if (targetProduct) {
      const requestedQuantity = extractCartQuantity(incoming.text)
      const nextCart = setCartItemQuantity(currentCart, targetProduct, requestedQuantity)
      const updatedItem = nextCart.find((item) => item.productId === targetProduct.id)
      await saveCart(chatId, nextCart)
      pendingProducts.set(chatId, targetProduct)
      pendingPayments.delete(chatId)

      if (!updatedItem) {
        return `${targetProduct.name} is currently unavailable. Please choose another product.`
      }

      const stockNote = updatedItem.quantity < requestedQuantity
        ? ` Only ${updatedItem.quantity} are currently in stock.`
        : ''
      return [
        `Updated your cart to ${updatedItem.quantity} x ${targetProduct.name}.${stockNote}`,
        formatCartSummary(nextCart, 'Your cart', calculateCartPricing(nextCart, promotions)),
        'Reply "pay cart" when ready, or keep adding products.',
      ].join('\n\n')
    }
  }

  if (explicitAdd || implicitSelection) {
    const matched = matchedSelection
    if (!matched.length) {
      return 'Which product should I add? Use its product name, for example: "add Organic Honey to cart".'
    }

    const unavailable = matched.filter((product) => !product.available || Number(product.stock || 0) < 1)
    const available = matched.filter((product) => product.available && Number(product.stock || 0) > 0)
    const productsToAdd = implicitSelection
      ? available.filter((product) => !currentCart.some((item) => item.productId === product.id))
      : available
    const quantity = matched.length === 1 ? extractCartQuantity(incoming.text) : 1
    const nextCart = addCartItems(currentCart, productsToAdd, quantity)
    await saveCart(chatId, nextCart)
    pendingPayments.delete(chatId)
    if (productsToAdd.length) pendingProducts.set(chatId, productsToAdd.at(-1))

    const messages = []
    if (productsToAdd.length) {
      messages.push(`Added ${productsToAdd.map((product) => product.name).join(', ')} to your cart.`)
    } else if (available.length) {
      messages.push('Those products are already in your cart.')
    }
    if (unavailable.length) {
      messages.push(`Not added: ${unavailable.map((product) => `${product.name} is sold out`).join(', ')}.`)
    }
    if (nextCart.length) {
      messages.push(formatCartSummary(nextCart, 'Your cart', calculateCartPricing(nextCart, promotions)), 'Reply "pay cart" when ready, or keep adding products.')
    }
    return messages.join('\n\n')
  }

  if (isViewCartIntent(incoming.text)) {
    return currentCart.length
      ? `${formatCartSummary(currentCart, 'Your cart', calculateCartPricing(currentCart, promotions))}\n\nReply "pay cart" to receive one M-Pesa prompt for the total.`
      : 'Your cart is empty. Say "add Organic Honey to cart" to get started.'
  }

  return null
}

async function buildPaymentReply(incoming, products, promotions) {
  if (isPaymentConfirmationClaim(incoming.text)) {
    const [latestPayment] = await listRecentPaymentsForChat(incoming.chatId).catch(() => [])
    if (
      latestPayment &&
      latestPayment.status !== 'Paid' &&
      Array.isArray(latestPayment.lineItems) &&
      latestPayment.lineItems.length
    ) {
      await saveCart(incoming.chatId, latestPayment.lineItems)
    }
    return paymentClaimReply(latestPayment)
  }

  const hasPaymentIntent = isPaymentIntent(incoming.text)
  const pendingPayment = pendingPayments.get(incoming.chatId) || null
  const currentCart = await getCart(incoming.chatId)
  const typedPhone = extractPaymentPhone(incoming.text)
  const shouldContinuePayment = Boolean(
    hasPaymentIntent ||
      (typedPhone && (
        currentCart.length ||
        pendingPayment ||
        pendingProducts.has(incoming.chatId)
      )),
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
  const pricing = calculateCartPricing(items, promotions)
  if (!phone) {
    return `${formatCartSummary(items, 'Your cart', pricing)}\n\nSend the M-Pesa phone number, for example: "2547XXXXXXX".`
  }

  const mpesa = await getMpesaStatus()
  if (!mpesa.configured) {
    return `M-Pesa is not fully configured yet. Missing: ${mpesa.missing.join(', ')}.`
  }

  try {
    const amount = pricing.total
    if (amount < 1) {
      return 'This promotion makes the order free, so an M-Pesa prompt cannot be sent. Please contact the business team to complete the order.'
    }
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
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      promotion: pricing.promotion,
      source: 'whatsapp',
    })
    await syncOrderFromPayment(payment)
    pendingProducts.delete(incoming.chatId)
    pendingPayments.delete(incoming.chatId)
    return [
      formatCartSummary(items, 'Payment request', pricing),
      payment.customerMessage || 'Check your phone and enter your M-Pesa PIN to complete payment.',
    ].join('\n')
  } catch (error) {
    return `I could not start the M-Pesa payment for this cart: ${error.message}`
  }
}

function buildPromotionReply(text, promotions) {
  if (!/\b(promotion|promotions|promo|promos|offer|offers|discount|discounts|deal|deals|sale)\b/i.test(String(text || ''))) {
    return null
  }
  if (!promotions.length) {
    return 'There are no active promotions right now. I can still show you the available products.'
  }

  const lines = promotions.map((promotion, index) => {
    const minimum = promotion.minimumSpend ? ` Minimum order: KES ${promotion.minimumSpend}.` : ''
    const end = promotion.endsAt
      ? ` Ends ${new Date(promotion.endsAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' })}.`
      : ''
    return `${index + 1}. ${promotion.name} — ${promotionCustomerDescription(promotion)}. ${promotion.description}${minimum}${end}`
  })
  return ['Here are the active offers:', ...lines, 'Add eligible products to your cart and the best offer will be applied automatically.'].join('\n')
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

async function buildReply(incoming, products, promotions) {
  const runtime = await getRuntimeSettings()
  if (!runtime.groqApiKey) {
    return 'The AI assistant is not configured yet. Add an AI service key in Bot Settings.'
  }

  const history = conversations.get(incoming.chatId) || []
  const [paymentContext, approvedKnowledge, replyTemplates] = await Promise.all([
    buildPaymentContext(incoming.chatId),
    readApprovedKnowledge(),
    readMessageTemplates(),
  ])
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
        { role: 'system', content: buildSystemPrompt(products, promotions, paymentContext, runtime, approvedKnowledge, replyTemplates) },
        ...history,
        { role: 'user', content: incoming.text.slice(0, 1200) },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`AI provider request failed: ${response.status} ${body}`)
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

function buildSystemPrompt(products, promotions, paymentContext, runtime, approvedKnowledge, replyTemplates) {
  const knowledge = approvedKnowledge
    .map((entry, index) => `${index + 1}. ${entry.topic}: ${entry.content}`)
    .join('\n')
  const catalog = products
    .map((product, index) => {
      const status = product.available ? `available, ${product.stock} in stock` : 'not available'
      const imageStatus = product.image?.data ? 'Product picture stored for direct WhatsApp media delivery.' : 'No product picture uploaded.'
      return `${index + 1}. ${product.name}: ${product.subtitle}. Category: ${product.category}. Price: KES ${product.price}. Status: ${status}. ${imageStatus}`
    })
    .join('\n')
  const templates = replyTemplates
    .map((template, index) => `${index + 1}. ${template.name} (${template.category}): ${template.body}`)
    .join('\n')
  const promotionInformation = promotions
    .map((promotion, index) => `${index + 1}. ${promotion.name}: ${promotionCustomerDescription(promotion)}. ${promotion.description}${promotion.minimumSpend ? ` Minimum cart spend: KES ${promotion.minimumSpend}.` : ''}`)
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

Active promotions:
${promotionInformation || 'No active promotions.'}

Approved reply templates:
${templates || 'No saved templates.'}

Recent payment records for this WhatsApp chat:
${paymentContext}

Rules:
- Answer only from the approved information above.
- For product questions, answer only from the approved product catalog above.
- Never output product image URLs, placeholder links, example links, markdown image links, or data URLs. Product pictures are sent separately as real WhatsApp media.
- When the customer asks generally what is available, give a concise numbered product list and end with: "Reply with a product name to see its photo."
- Do not claim that multiple product photos or image links will follow. At most one relevant product image card is sent after each reply.
- Mention only promotions listed under Active promotions. Pricing rules apply the best eligible offer automatically at checkout.
- When an approved reply template fits the question, follow its wording and replace its variables with approved information.
- Keep replies short enough for WhatsApp.
- If the user asks for private payment data, OTPs, PINs, passwords, or sensitive information, refuse and give a safe next step.
- If the approved information does not answer the question, say: "${runtime.handoffMessage}"
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- Never treat a customer's words such as "sent", "paid", or "done" as payment confirmation. A payment is successful only when its recorded status is Paid.
- If booking details are needed, ask for the minimum next detail.`
}

async function sendRelevantProductImages(incoming, products) {
  const productsToSend = selectWhatsAppProductImages(products, incoming.text)

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
