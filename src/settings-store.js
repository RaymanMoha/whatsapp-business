import crypto from 'node:crypto'
import { getMongoDb, isMongoConfigured } from './mongodb.js'

const SETTINGS_ID = 'runtime'
const SETTINGS_COLLECTION = 'system_settings'
const AUDIT_COLLECTION = 'settings_audit'
const CACHE_TTL_MS = 5000

const SECRET_KEYS = [
  'groqApiKey',
  'mpesaConsumerKey',
  'mpesaConsumerSecret',
  'mpesaPassKey',
  'googleIntegrationSecret',
]

const DASHBOARD_PUBLIC_KEYS = {
  businessName: 'businessName',
  botName: 'botName',
  handoffMessage: 'handoffMessage',
  aiModel: 'groqModel',
  mpesaEnvironment: 'mpesaEnvironment',
  mpesaBusinessShortCode: 'mpesaBusinessShortCode',
  mpesaPartyA: 'mpesaPartyA',
  mpesaTransactionType: 'mpesaTransactionType',
  mpesaCallbackUrl: 'mpesaCallbackUrl',
  googleSpreadsheetUrl: 'googleSpreadsheetUrl',
  googleAppsScriptUrl: 'googleAppsScriptUrl',
}

const DASHBOARD_SECRET_KEYS = {
  aiApiKey: 'groqApiKey',
  mpesaConsumerKey: 'mpesaConsumerKey',
  mpesaConsumerSecret: 'mpesaConsumerSecret',
  mpesaPassKey: 'mpesaPassKey',
  googleIntegrationSecret: 'googleIntegrationSecret',
}

let runtimeCache = null
let runtimeCacheExpiresAt = 0

function environmentDefaults() {
  return {
    businessName: process.env.BUSINESS_NAME || 'WhatsApp Store',
    botName: process.env.BOT_NAME || 'Ask Local',
    handoffMessage:
      process.env.HUMAN_HANDOFF_MESSAGE ||
      'I do not have confirmed information for that. Please contact a team member for help.',
    groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    groqApiKey: process.env.GROQ_API_KEY || '',
    wahaBaseUrl: process.env.WAHA_BASE_URL || 'http://localhost:3001',
    wahaApiKey: process.env.WAHA_API_KEY || '',
    wahaSession: process.env.WAHA_SESSION || 'default',
    mpesaEnvironment: process.env.MPESA_ENV || 'sandbox',
    mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY || '',
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    mpesaBusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE || '',
    mpesaPartyA: process.env.MPESA_PARTY_A || '',
    mpesaPassKey: process.env.MPESA_PASSKEY || '',
    mpesaTransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
    mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL || '',
    googleSpreadsheetUrl: process.env.GOOGLE_SPREADSHEET_URL || '',
    googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
    googleIntegrationSecret: process.env.GOOGLE_INTEGRATION_SECRET || '',
  }
}

function encryptionKey() {
  const source = process.env.SETTINGS_ENCRYPTION_KEY || process.env.AUTH_SECRET
  if (!source || source === 'dev-secret') {
    throw new Error('SETTINGS_ENCRYPTION_KEY or a secure AUTH_SECRET is required')
  }
  return crypto.createHash('sha256').update(`whatsapp-commerce-settings:${source}`).digest()
}

function encryptSecret(value) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()])
  return {
    version: 1,
    algorithm: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: encrypted.toString('base64'),
  }
}

function decryptSecret(payload) {
  if (!payload?.ciphertext || !payload?.iv || !payload?.tag) return ''
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    encryptionKey(),
    Buffer.from(payload.iv, 'base64'),
  )
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'))
  return Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8')
}

async function readSettingsDocument() {
  if (!isMongoConfigured()) return null
  const db = await getMongoDb()
  return db.collection(SETTINGS_COLLECTION).findOne({ id: SETTINGS_ID }, { projection: { _id: 0 } })
}

function runtimeFromDocument(defaults, document) {
  const runtime = { ...defaults, ...(document?.public || {}) }
  for (const key of SECRET_KEYS) {
    if (!document?.secrets?.[key]) continue
    try {
      runtime[key] = decryptSecret(document.secrets[key])
    } catch (error) {
      console.error(`[settings] Could not decrypt ${key}:`, error instanceof Error ? error.message : error)
    }
  }
  return runtime
}

export async function getRuntimeSettings({ fresh = false } = {}) {
  if (!fresh && runtimeCache && Date.now() < runtimeCacheExpiresAt) return runtimeCache

  const defaults = environmentDefaults()
  const document = await readSettingsDocument()
  const runtime = runtimeFromDocument(defaults, document)

  runtimeCache = runtime
  runtimeCacheExpiresAt = Date.now() + CACHE_TTL_MS
  return runtime
}

function secretSummary(value, source) {
  const text = String(value || '')
  return {
    configured: Boolean(text),
    ending: text ? text.slice(-4) : null,
    source,
  }
}

export async function getSettingsForDashboard() {
  const defaults = environmentDefaults()
  const document = await readSettingsDocument()
  const runtime = runtimeFromDocument(defaults, document)

  const secrets = {}
  for (const [dashboardKey, runtimeKey] of Object.entries(DASHBOARD_SECRET_KEYS)) {
    secrets[dashboardKey] = secretSummary(
      runtime[runtimeKey],
      document?.secrets?.[runtimeKey] ? 'encrypted database' : defaults[runtimeKey] ? 'environment' : 'missing',
    )
  }

  const values = {}
  for (const [dashboardKey, runtimeKey] of Object.entries(DASHBOARD_PUBLIC_KEYS)) {
    values[dashboardKey] = runtime[runtimeKey] || ''
  }

  return {
    values,
    secrets,
    locked: {
      mongo: Boolean(process.env.MONGODB_URI),
      dashboardAuth: Boolean(process.env.AUTH_SECRET && process.env.DASHBOARD_ADMIN_EMAIL),
      messaging: {
        configured: Boolean(runtime.wahaApiKey),
        baseUrl: runtime.wahaBaseUrl,
        session: runtime.wahaSession,
      },
    },
    updatedAt: document?.updatedAt || null,
    updatedBy: document?.updatedBy || null,
  }
}

export async function saveRuntimeSettings(input, updatedBy = 'dashboard admin') {
  if (!isMongoConfigured()) throw new Error('MongoDB is required to store encrypted settings')
  encryptionKey()

  const publicUpdates = {}
  const secretUpdates = {}
  const changedFields = []
  const publicInput = input?.values || {}
  const secretInput = input?.secrets || {}

  for (const [dashboardKey, runtimeKey] of Object.entries(DASHBOARD_PUBLIC_KEYS)) {
    if (!(dashboardKey in publicInput)) continue
    publicUpdates[runtimeKey] = String(publicInput[dashboardKey] ?? '').trim()
    changedFields.push(dashboardKey)
  }

  if ('mpesaEnvironment' in publicUpdates && !['sandbox', 'production'].includes(publicUpdates.mpesaEnvironment)) {
    throw new Error('M-Pesa environment must be sandbox or production')
  }

  if (publicUpdates.googleSpreadsheetUrl && !/^https:\/\/docs\.google\.com\/spreadsheets\/d\//.test(publicUpdates.googleSpreadsheetUrl)) {
    throw new Error('Use a valid Google Sheets URL')
  }
  if (publicUpdates.googleAppsScriptUrl && !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(publicUpdates.googleAppsScriptUrl)) {
    throw new Error('Use the /exec URL from an Apps Script web app deployment')
  }

  for (const [dashboardKey, runtimeKey] of Object.entries(DASHBOARD_SECRET_KEYS)) {
    const value = String(secretInput[dashboardKey] || '').trim()
    if (!value) continue
    if (dashboardKey === 'googleIntegrationSecret' && value.length < 32) {
      throw new Error('The Google integration secret must be at least 32 characters')
    }
    secretUpdates[runtimeKey] = encryptSecret(value)
    changedFields.push(dashboardKey)
  }

  if (!changedFields.length) throw new Error('No setting changes were provided')

  const db = await getMongoDb()
  const now = new Date().toISOString()
  const set = { updatedAt: now, updatedBy }
  for (const [key, value] of Object.entries(publicUpdates)) set[`public.${key}`] = value
  for (const [key, value] of Object.entries(secretUpdates)) set[`secrets.${key}`] = value

  await db.collection(SETTINGS_COLLECTION).updateOne(
    { id: SETTINGS_ID },
    { $set: set, $setOnInsert: { id: SETTINGS_ID, createdAt: now } },
    { upsert: true },
  )
  await db.collection(AUDIT_COLLECTION).insertOne({
    id: crypto.randomUUID(),
    action: 'settings.updated',
    changedFields,
    updatedBy,
    createdAt: now,
  })

  runtimeCache = null
  runtimeCacheExpiresAt = 0
  return getSettingsForDashboard()
}

export async function testRuntimeProvider(provider, overrides = {}) {
  const runtime = { ...(await getRuntimeSettings({ fresh: true })), ...overrides }

  if (provider === 'ai') {
    if (!runtime.groqApiKey) throw new Error('Add an AI service key first')
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${runtime.groqApiKey}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`AI service rejected the key (${response.status})`)
    return { ok: true, message: 'AI service connection verified' }
  }

  if (provider === 'messaging') {
    if (!runtime.wahaApiKey) throw new Error('WhatsApp connection key is not configured')
    const response = await fetch(`${runtime.wahaBaseUrl}/api/sessions?all=true`, {
      headers: { 'X-Api-Key': runtime.wahaApiKey },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`WhatsApp connection failed (${response.status})`)
    const sessions = await response.json()
    const session = Array.isArray(sessions)
      ? sessions.find((item) => item.name === runtime.wahaSession) || sessions[0]
      : null
    return { ok: true, message: `WhatsApp connection verified · ${session?.status || 'session not connected'}` }
  }

  if (provider === 'mpesa') {
    if (!runtime.mpesaConsumerKey || !runtime.mpesaConsumerSecret) {
      throw new Error('Add the M-Pesa consumer key and secret first')
    }
    const baseUrl = runtime.mpesaEnvironment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke'
    const credentials = Buffer.from(`${runtime.mpesaConsumerKey}:${runtime.mpesaConsumerSecret}`).toString('base64')
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${credentials}` },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`M-Pesa rejected the credentials (${response.status})`)
    const payload = await response.json()
    if (!payload.access_token) throw new Error('M-Pesa did not return an access token')
    return { ok: true, message: `M-Pesa ${runtime.mpesaEnvironment} credentials verified` }
  }

  if (provider === 'google') {
    if (!runtime.googleAppsScriptUrl) throw new Error('Add the Apps Script web app URL first')
    if (!runtime.googleIntegrationSecret) throw new Error('Add the shared integration secret first')
    let url
    try {
      url = new URL(runtime.googleAppsScriptUrl)
    } catch {
      throw new Error('The Apps Script web app URL is invalid')
    }
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com') {
      throw new Error('Use the HTTPS web app URL from script.google.com')
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'ping', secret: runtime.googleIntegrationSecret }),
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) throw new Error(`Google connection failed (${response.status})`)
    const payload = await response.json().catch(() => null)
    if (!payload?.ok) throw new Error(payload?.error || 'The Apps Script endpoint did not confirm the connection')
    return { ok: true, message: 'Google Sheets connection verified' }
  }

  throw new Error('Unknown provider')
}
