import { prepareWhatsAppImage } from './image-media.js'
import { money } from './shopping-ui.js'
import { getRuntimeSettings } from './settings-store.js'

export async function getWahaConfig() {
  const runtime = await getRuntimeSettings()
  return {
    baseUrl: runtime.wahaBaseUrl || 'http://localhost:3001',
    apiKey: runtime.wahaApiKey || 'change-this-local-api-key',
    session: runtime.wahaSession || 'default',
  }
}

export async function sendWahaText(chatId, text, session) {
  const config = await getWahaConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)

  const response = await fetch(`${config.baseUrl}/api/sendText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.apiKey,
    },
    signal: controller.signal,
    body: JSON.stringify({
      chatId,
      text,
      session: session || config.session,
    }),
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WhatsApp message delivery failed: ${response.status} ${body}`)
  }
}

export async function sendWahaFile(chatId, file, caption, session) {
  const config = await getWahaConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  const response = await fetch(`${config.baseUrl}/api/sendFile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.apiKey,
    },
    signal: controller.signal,
    body: JSON.stringify({
      chatId,
      caption,
      session: session || config.session,
      file: {
        mimetype: file.mimetype,
        data: file.data,
        filename: file.filename,
      },
    }),
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WhatsApp file delivery failed: ${response.status} ${body}`)
  }
}

export async function sendWahaImage(chatId, product, session, caption) {
  const file = await prepareWhatsAppImage(product.image, product.id)
  const config = await getWahaConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  const response = await fetch(`${config.baseUrl}/api/sendImage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': config.apiKey,
    },
    signal: controller.signal,
    body: JSON.stringify({
      chatId,
      session: session || config.session,
      file,
      caption: caption || `*${product.name}* · *${money(product.price)}*\n${product.subtitle || ''}\n${product.available && Number(product.stock) > 0 ? 'In stock' : 'Sold out'}\n\nLike this one? Tell me its name or ask a question.`,
    }),
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WhatsApp image delivery failed: ${response.status} ${body}`)
  }
}
