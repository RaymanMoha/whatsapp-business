import { getRuntimeSettings } from './settings-store.js'

const MANAGEABLE_ACTIONS = new Set(['start', 'restart', 'logout'])

export class WahaSessionError extends Error {
  constructor(message, status = 500, details = null) {
    super(message)
    this.name = 'WahaSessionError'
    this.status = status
    this.details = details
  }
}

function safePathSegment(value) {
  return encodeURIComponent(String(value || '').trim())
}

async function getWahaRuntimeConfig() {
  const runtime = await getRuntimeSettings({ fresh: true })
  return {
    baseUrl: String(runtime.wahaBaseUrl || '').replace(/\/$/, ''),
    apiKey: String(runtime.wahaApiKey || ''),
    session: String(runtime.wahaSession || 'default'),
  }
}

function assertConfigured(config) {
  if (!config.baseUrl || !config.apiKey || !config.session) {
    throw new WahaSessionError('WhatsApp infrastructure is not configured yet', 409)
  }
}

async function readWahaBody(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json().catch(() => null)
  return response.text().catch(() => '')
}

async function wahaRequest(config, path, options = {}) {
  assertConfigured(config)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout || 8000)
  const headers = {
    'X-Api-Key': config.apiKey,
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      method: options.method || 'GET',
      cache: 'no-store',
      headers,
      signal: controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    const body = await readWahaBody(response)
    if (!response.ok) {
      const message = body?.message || body?.error || body || `WAHA request failed (${response.status})`
      throw new WahaSessionError(String(message), response.status, body)
    }
    return body
  } catch (error) {
    if (error instanceof WahaSessionError) throw error
    const message = error?.name === 'AbortError'
      ? 'WhatsApp service timed out'
      : `WhatsApp service is unavailable: ${error?.message || error}`
    throw new WahaSessionError(message, 502)
  } finally {
    clearTimeout(timeout)
  }
}

function summarizeSession(session, fallbackName) {
  return {
    name: session?.name || fallbackName,
    status: session?.status || 'NOT_CONNECTED',
    phone: session?.me?.id || null,
    pushName: session?.me?.pushName || null,
    engine: session?.engine?.engine || null,
  }
}

async function listSessions(config) {
  const sessions = await wahaRequest(config, '/api/sessions?all=true')
  return Array.isArray(sessions) ? sessions : []
}

async function getQrImage(config) {
  try {
    const qr = await wahaRequest(config, `/api/${safePathSegment(config.session)}/auth/qr?format=image`, {
      headers: { Accept: 'application/json' },
      timeout: 6000,
    })
    if (!qr?.data) return { image: null, error: 'QR code is not available yet' }
    return {
      image: `data:${qr.mimetype || 'image/png'};base64,${qr.data}`,
      error: null,
    }
  } catch (error) {
    return {
      image: null,
      error: error instanceof WahaSessionError ? error.message : 'QR code is not available yet',
    }
  }
}

export async function getWhatsappConnectionState({ includeQr = false } = {}) {
  const config = await getWahaRuntimeConfig()
  if (!config.baseUrl || !config.apiKey || !config.session) {
    return {
      configured: false,
      session: summarizeSession({ status: 'NOT_CONFIGURED' }, config.session || 'default'),
      qr: { image: null, error: 'WhatsApp infrastructure is not configured yet' },
      canShowQr: false,
      updatedAt: new Date().toISOString(),
    }
  }

  let sessions = []
  try {
    sessions = await listSessions(config)
  } catch (error) {
    return {
      configured: true,
      session: summarizeSession({ status: 'UNAVAILABLE' }, config.session),
      qr: {
        image: null,
        error: error instanceof WahaSessionError ? error.message : 'WhatsApp service is unavailable',
      },
      canShowQr: false,
      updatedAt: new Date().toISOString(),
    }
  }

  const selected = sessions.find((item) => item.name === config.session) || null
  const session = summarizeSession(selected, config.session)
  const needsQr = ['NOT_CONNECTED', 'STOPPED', 'STARTING', 'SCAN_QR_CODE', 'FAILED'].includes(session.status)
  const qr = includeQr && needsQr ? await getQrImage(config) : { image: null, error: null }

  return {
    configured: true,
    session,
    qr,
    canShowQr: needsQr,
    updatedAt: new Date().toISOString(),
  }
}

async function createSession(config) {
  return wahaRequest(config, '/api/sessions', {
    method: 'POST',
    body: { name: config.session },
  })
}

async function runSessionAction(config, action) {
  try {
    return await wahaRequest(config, `/api/sessions/${safePathSegment(config.session)}/${action}`, {
      method: 'POST',
      body: {},
      timeout: action === 'restart' || action === 'logout' ? 15000 : 9000,
    })
  } catch (error) {
    if (action === 'start' && error instanceof WahaSessionError && error.status === 404) {
      return createSession(config)
    }
    throw error
  }
}

export async function manageWhatsappSession(action) {
  if (!MANAGEABLE_ACTIONS.has(action)) {
    throw new WahaSessionError('Unsupported WhatsApp session action', 400)
  }
  const config = await getWahaRuntimeConfig()
  assertConfigured(config)
  const result = await runSessionAction(config, action)
  const state = await getWhatsappConnectionState({ includeQr: true })
  return { action, result, state }
}
