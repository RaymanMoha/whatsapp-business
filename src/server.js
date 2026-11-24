import 'dotenv/config'
import { demoProfile } from './demo-profile.js'
import { demoPaymentTestProduct, isDemoPaymentTest } from './demo-payment-test.js'

import express from 'express'
import { shoppingAction, welcomeMenu, catalogPage, productCard, matchPhotoProducts, matchingCategory, money } from './shopping-ui.js'
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
  groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
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
const shoppingSessions = new Map()
const pendingAddConfirmations = new Map()
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
  const [products, promotions] = await Promise.all([readProducts(), readActivePromotions()])
  const { reply, imageProducts, photoCard } = await buildCustomerReply(incoming, products, promotions)
  const images = imageProducts.filter(product => product.image?.data && product.image?.mimetype)
  if (!photoCard || images.length !== 1) await sendWhatsAppText(incoming.chatId, reply, incoming.session)
  await sendRelevantProductImages(incoming, images, photoCard && images.length === 1 ? reply : undefined)
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
    previewOnly: true,
    chatId,
    session: config.wahaSession,
    text: message,
    fromMe: false,
    quotedText: typeof request.body?.quotedText === 'string' ? request.body.quotedText : '',
  }
  const { reply, imageProducts } = await buildCustomerReply(incoming, products, promotions)

  response.json({
    reply,
    productImages: imageProducts.filter((product) => product.image?.data && product.image?.mimetype).slice(0, 3).length,
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
    quotedText: payload?.replyTo?.body || payload?._data?.quotedMsg?.body || payload?._data?.Message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption || payload?._data?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption || '',
  }
}

function buildProductCardReply(chatId, product) {
  pendingProducts.set(chatId, product)
  pendingAddConfirmations.set(chatId, product.id)
  if (pendingAddConfirmations.size > 1000) pendingAddConfirmations.delete(pendingAddConfirmations.keys().next().value)
  return { reply: productCard(product), imageProducts: [product], photoCard: true }
}

async function buildCustomerReply(incoming, products, promotions = []) {
  // A plain yes confirms only the immediately preceding product-add question.
  const addConfirmation = pendingAddConfirmations.get(incoming.chatId)
  pendingAddConfirmations.delete(incoming.chatId)
  const merchantDemoReply = buildDemoReply(incoming.text)
  if (merchantDemoReply) return { reply: sanitizeWhatsAppReply(merchantDemoReply), imageProducts: [] }
  let session = shoppingSessions.get(incoming.chatId) || { ids: [], page: 0, mode: 'browse', category: '' }
  const saveSession = () => {
    shoppingSessions.delete(incoming.chatId)
    shoppingSessions.set(incoming.chatId, session)
    if (shoppingSessions.size > 1000) shoppingSessions.delete(shoppingSessions.keys().next().value)
  }
  const action = shoppingAction(incoming.text)
  const category = matchingCategory(products, incoming.text)
  if (action?.type === 'menu') {
    pendingProducts.delete(incoming.chatId)
    const runtime = await getRuntimeSettings()
    return { reply: welcomeMenu(runtime.businessName, [...new Set(products.map(product => product.category))]), imageProducts: [] }
  }
  if (action?.type === 'more' && pendingProducts.has(incoming.chatId)) {
    const focus = pendingProducts.get(incoming.chatId)
    const alternatives = products.filter(product => product.id !== focus.id && product.category === focus.category && product.available && Number(product.stock) > 0)
    if (alternatives.length) {
      return buildProductCardReply(incoming.chatId, alternatives[0])
    }
  }
  if (action?.type === 'browse' || category || action?.type === 'more' || action?.type === 'photos') {
    let specificPhotos = null
    if (action?.type === 'photos' && action.query) {
      specificPhotos = matchPhotoProducts(products, action.query)
      if (!specificPhotos.length) return { reply: 'I couldn’t find that product. Tell me its name, or say *browse* to see the collection.', imageProducts: [] }
    }
    const focus = pendingProducts.get(incoming.chatId)
    if (action?.type === 'photos' && !action.query && /(?:pic|photo|picture|image)\b/i.test(incoming.text) && !/\ball\b/i.test(incoming.text) && focus) specificPhotos = products.filter(product => product.id === focus.id)
    if (specificPhotos?.length === 1) {
      return buildProductCardReply(incoming.chatId, specificPhotos[0])
    }
    if (action?.type !== 'more' || !session.ids.length) {
      const entries = specificPhotos || (category ? products.filter(product => product.category === category) : products)
      session = { ids: entries.map(product => product.id), page: 0, mode: action?.type === 'photos' ? 'photos' : 'browse', category: category || '' }
      pendingProducts.delete(incoming.chatId)
    } else if ((session.page + 1) * 3 < session.ids.length) session.page += 1
    else return { reply: 'That’s the full collection. Tell me which item you liked, or choose a different category.', imageProducts: [] }
    saveSession()
    const entries = session.ids.map(id => products.find(product => product.id === id)).filter(Boolean)
    const shown = entries.slice(session.page * 3, session.page * 3 + 3)
    const imageProducts = shown.filter(product => product.image?.data && product.image?.mimetype)
    return { reply: catalogPage(entries, session.page, 3, session.category), imageProducts }
  }
  if (action?.type === 'confirm_add' && (!addConfirmation || addConfirmation !== pendingProducts.get(incoming.chatId)?.id)) {
    return { reply: 'Would you like to *browse* more products, view your *cart*, or *checkout*? Tell me which one.', imageProducts: [] }
  }
  if (action?.type === 'add' || action?.type === 'confirm_add') {
    const quoted = incoming.quotedText ? products.filter(product => incoming.quotedText.toLowerCase().includes(product.name.toLowerCase())) : []
    let matches = action.query ? matchPhotoProducts(products, action.query) : quoted.length === 1 ? quoted : products.filter(product => product.id === pendingProducts.get(incoming.chatId)?.id)
    if (action.query && /\band\b|,/.test(action.query)) matches = matchCartProducts(products, action.query)
    if (!matches.length || (matches.length !== 1 && !/\band\b|,/.test(action.query))) {
      return { reply: matches.length ? `Which one would you like?\n\n${matches.map(product => `${product.name} — ${money(product.price)}`).join('\n')}` : 'Which product would you like to add? Tell me its name, or say *browse* to have a look.', imageProducts: [] }
    }
    incoming = { ...incoming, text: `add ${action.quantity} ${matches.map(product => product.name).join(' and ')} to cart`, selectedProductIds: matches.map(product => product.id) }
  }
  if (action?.type === 'cart') incoming = { ...incoming, text: 'show my cart' }
  if (action?.type === 'track') {
    const records = await buildPaymentContext(incoming.chatId)
    return { reply: `*Your recent order payments*\n\n${records}\n\nYou can ask me about delivery too.`, imageProducts: [] }
  }
  if (action?.type === 'help') {
    const runtime = await getRuntimeSettings()
    return { reply: runtime.handoffMessage, imageProducts: [] }
  }
  if (!action) {
    const matches = matchPhotoProducts(products, incoming.text)
    if (matches.length === 1) {
      return buildProductCardReply(incoming.chatId, matches[0])
    }
  }
  const cartReply = await buildCartReply(incoming, products, promotions)
  const paymentReply = cartReply ? null : await buildPaymentReply(incoming, products, promotions)
  const promotionReply = cartReply || paymentReply ? null : buildPromotionReply(incoming.text, promotions)
  const commerceReply = cartReply || paymentReply || promotionReply
  if (commerceReply) return { reply: sanitizeWhatsAppReply(commerceReply), imageProducts: [] }
  const reply = sanitizeWhatsAppReply(await buildReply(incoming, products, promotions))
  rememberPendingProduct(incoming.chatId, incoming.text, products)
  return { reply, imageProducts: selectWhatsAppProductImages(products, incoming.text) }
}

async function buildCartReply(incoming, products, promotions = []) {
  const chatId = incoming.chatId
  const currentCart = await getCart(chatId)

  if (isClearCartIntent(incoming.text)) {
    await clearCart(chatId)
    pendingPayments.delete(chatId)
    return 'Your cart is now empty. Reply *browse* to keep shopping.'
  }

  if (isRemoveFromCartIntent(incoming.text)) {
    const matched = incoming.selectedProductIds ? products.filter((product) => incoming.selectedProductIds.includes(product.id)) : matchCartProducts(products, incoming.text)
    if (!currentCart.length) return 'Your cart is empty. Reply *browse* to see products.'
    if (!matched.length) {
      return `${formatCartSummary(currentCart, 'Your cart', calculateCartPricing(currentCart, promotions))}\n\nTell me the name of the item you’d like to remove.`
    }

    const nextCart = removeCartItems(currentCart, matched.map((product) => product.id))
    await saveCart(chatId, nextCart)
    return nextCart.length
      ? `Removed ${matched.map((product) => product.name).join(', ')}.\n\n${formatCartSummary(nextCart, 'Your cart', calculateCartPricing(nextCart, promotions))}\n\nReply "pay cart" when ready.`
      : 'Removed. Your cart is now empty.'
  }

  const matchedSelection = incoming.selectedProductIds ? products.filter((product) => incoming.selectedProductIds.includes(product.id)) : matchCartProducts(products, incoming.text)
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
      return 'Which product would you like? Tell me its name, or say *browse* to see the collection.'
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
      messages.push(formatCartSummary(nextCart, 'Your cart', calculateCartPricing(nextCart, promotions)), 'Would you like anything else, or shall we *checkout*?')
    }
    return messages.join('\n\n')
  }

  if (isViewCartIntent(incoming.text)) {
    return currentCart.length
      ? `${formatCartSummary(currentCart, 'Your cart', calculateCartPricing(currentCart, promotions))}\n\nReply *checkout* to request an M-Pesa prompt for this total.\n*clear cart* — Empty cart · *browse* — Keep shopping`
      : 'Your cart is empty. What would you like to shop for? Say *browse* to see the collection.'
  }

  return null
}

async function buildPaymentReply(incoming, products, promotions = []) {
  if (isPaymentConfirmationClaim(incoming.text)) {
    const [latestPayment] = await listRecentPaymentsForChat(incoming.chatId).catch(() => [])
    if (demoProfile && latestPayment?.source !== 'whatsapp-demo-payment-test') return 'Demo purchases are previews. To test a real KES 2 payment, choose *M-Pesa Test*, add one unit, then type *checkout*. Payment is confirmed only by the payment provider.'
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
    return 'Your cart is empty. Tell me what you’d like, or say *browse* to see the collection.'
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
  const paymentTest = Boolean(demoProfile && isDemoPaymentTest(items, pricing))
  if (demoProfile && !paymentTest) {
    if (items.some(item => item.productId === demoPaymentTestProduct.id)) return 'For the KES 2 payment test, your cart must contain exactly *one M-Pesa Test* item and nothing else, with no discount. Clear your cart, add one M-Pesa Test, then type *checkout*.'
    return `${formatCartSummary(items, 'Demo checkout', pricing)}\n\n*This is a demo preview.* No payment request was sent, no money was charged, and no real order was placed.\n\nTo test a real *KES 2* payment, clear your cart and add one *M-Pesa Test* item.`
  }
  if (incoming.previewOnly) return `${formatCartSummary(items, 'Checkout preview', pricing)}\n\nNo payment prompt is sent from this preview. Continue in WhatsApp to request payment.`
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
      description: paymentTest ? 'KES 2 payment test - no delivery' : `${productName} WhatsApp order`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      productId: items.length === 1 ? items[0].productId : null,
      productName,
      lineItems: items,
      itemCount,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      promotion: pricing.promotion,
      source: paymentTest ? 'whatsapp-demo-payment-test' : 'whatsapp',
    })
    await syncOrderFromPayment(payment)
    pendingProducts.delete(incoming.chatId)
    pendingPayments.delete(incoming.chatId)
    return [
      formatCartSummary(items, paymentTest ? 'KES 2 payment test — no physical delivery' : 'Payment request', pricing),
      ...(paymentTest ? [mpesa.environment === 'production' ? 'This is a real KES 2 payment test. Approving the phone prompt will charge KES 2.' : 'Sandbox test only: this does not charge real money.'] : []),
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
- Keep replies short enough for WhatsApp: use short paragraphs, simple language, and one clear next action.\n- Customers can type menu to see options, browse to see products, and cart to see their cart. Do not invent buttons or claim a human has been notified.
- If the user asks for private payment data, OTPs, PINs, passwords, or sensitive information, refuse and give a safe next step.
- If the approved information does not answer the question, say: "${runtime.handoffMessage}"
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- Never treat a customer's words such as "sent", "paid", or "done" as payment confirmation. A payment is successful only when its recorded status is Paid.
- If booking details are needed, ask for the minimum next detail.`
}

async function sendRelevantProductImages(incoming, products, caption) {
  const productsToSend = products
    .filter((product) => product.image?.data && product.image?.mimetype)
    .slice(0, 3)

  if (productsToSend.length === 0) {
    return
  }

  for (const product of productsToSend) {
    console.log(`Sending product image to ${incoming.chatId}: ${product.name}`)
    await sendWhatsAppImage(incoming.chatId, product, incoming.session, caption)
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

async function sendWhatsAppImage(chatId, product, session, caption) {
  await sendWahaImage(chatId, product, session, caption)
}

function rememberConversation(chatId, userText, assistantText) {
  const history = conversations.get(chatId) || []
  history.push({ role: 'user', content: userText.slice(0, 1200) })
  history.push({ role: 'assistant', content: assistantText.slice(0, 1200) })
  conversations.set(chatId, history.slice(-config.maxHistoryMessages))
}
