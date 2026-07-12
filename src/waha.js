export function getWahaConfig() {
  return {
    baseUrl: process.env.WAHA_BASE_URL || 'http://localhost:3001',
    apiKey: process.env.WAHA_API_KEY || 'change-this-local-api-key',
    session: process.env.WAHA_SESSION || 'default',
  }
}

export async function sendWahaText(chatId, text, session) {
  const config = getWahaConfig()
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
  const config = getWahaConfig()
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
