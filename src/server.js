import 'dotenv/config'

import express from 'express'
import { approvedKnowledge, businessProfile } from './knowledge.js'
import { appendConversationEvent } from './message-store.js'
import { findProductsForMessage, readProducts } from './product-store.js'

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
const seenMessageIds = new Set()

app.get('/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'waha-groq-bot',
    businessName: config.businessName,
    groqConfigured: Boolean(config.groqApiKey),
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
    const reply = await buildReply(incoming, products)
    await sendWhatsAppText(incoming.chatId, reply, incoming.session)
    await sendRelevantProductImages(incoming, products)
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
    await appendConversationEvent({
      id: `${incoming.id}-error`,
      chatId: incoming.chatId,
      customerName: incoming.customerName,
      direction: 'system',
      text: config.humanHandoffMessage,
      status: 'failed',
    }).catch(() => {})
    await sendWhatsAppText(incoming.chatId, config.humanHandoffMessage, incoming.session).catch(
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
  const reply = await buildReply({
    id: `test-${Date.now()}`,
    chatId,
    session: config.wahaSession,
    text: message,
    fromMe: false,
  }, products)

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

function extractText(payload) {
  if (typeof payload?.body === 'string') return payload.body
  if (typeof payload?.text === 'string') return payload.text
  if (typeof payload?.message?.text === 'string') return payload.message.text
  if (typeof payload?._data?.body === 'string') return payload._data.body
  return ''
}

async function buildReply(incoming, products) {
  if (!config.groqApiKey) {
    return 'The AI assistant is not configured yet. Add GROQ_API_KEY to .env and restart the bot.'
  }

  const history = conversations.get(incoming.chatId) || []
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.groqModel,
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        { role: 'system', content: buildSystemPrompt(products) },
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
    config.humanHandoffMessage
  )
}

function buildSystemPrompt(products) {
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

  return `You are ${config.botName}, a WhatsApp FAQ assistant for ${config.businessName}.

Business profile:
${businessProfile.description}

Tone:
${businessProfile.tone}

Approved information:
${knowledge}

Approved product catalog:
${catalog}

Rules:
- Answer only from the approved information above.
- For product questions, answer only from the approved product catalog above.
- Keep replies short enough for WhatsApp.
- If the user asks for private payment data, OTPs, PINs, passwords, or sensitive information, refuse and give a safe next step.
- If the approved information does not answer the question, say: "${config.humanHandoffMessage}"
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- If booking details are needed, ask for the minimum next detail.`
}

async function sendRelevantProductImages(incoming, products) {
  const productsToSend = findProductsForMessage(products, incoming.text)
    .filter((product) => product.image?.data && product.image?.mimetype)
    .slice(0, 3)

  for (const product of productsToSend) {
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
  const response = await fetch(`${config.wahaBaseUrl}/api/sendText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.wahaApiKey,
    },
    body: JSON.stringify({
      chatId,
      text,
      session: session || config.wahaSession,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WAHA sendText failed: ${response.status} ${body}`)
  }
}

async function sendWhatsAppImage(chatId, product, session) {
  const response = await fetch(`${config.wahaBaseUrl}/api/sendImage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.wahaApiKey,
    },
    body: JSON.stringify({
      chatId,
      session: session || config.wahaSession,
      file: {
        mimetype: product.image.mimetype,
        data: product.image.data,
        filename: product.image.filename || `${product.id}.jpg`,
      },
      caption: `${product.name}\nKES ${product.price}\n${product.available ? `${product.stock} in stock` : 'Sold out'}`,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WAHA sendImage failed: ${response.status} ${body}`)
  }
}

function rememberConversation(chatId, userText, assistantText) {
  const history = conversations.get(chatId) || []
  history.push({ role: 'user', content: userText.slice(0, 1200) })
  history.push({ role: 'assistant', content: assistantText.slice(0, 1200) })
  conversations.set(chatId, history.slice(-config.maxHistoryMessages))
}
