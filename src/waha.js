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
    throw new Error(`WAHA sendText failed: ${response.status} ${body}`)
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
    throw new Error(`WAHA sendFile failed: ${response.status} ${body}`)
  }
}

export async function sendWahaImage(chatId, product, session) {
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
      file: {
        mimetype: product.image.mimetype,
        data: product.image.data,
        filename: product.image.filename || `${product.id}.jpg`,
      },
      caption: `${product.name}\nKES ${product.price}\n${product.available ? `${product.stock} in stock` : 'Sold out'}`,
    }),
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`WAHA sendImage failed: ${response.status} ${body}`)
  }
}
