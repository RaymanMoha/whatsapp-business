import { getMongoDb, isMongoConfigured } from './mongodb.js'
import { getRuntimeSettings } from './settings-store.js'

export async function getMpesaConfig() {
  const runtime = await getRuntimeSettings()
  const environment = runtime.mpesaEnvironment || 'sandbox'
  const baseUrl =
    process.env.MPESA_BASE_URL ||
    (environment === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke')

  return {
    environment,
    baseUrl,
    consumerKey: runtime.mpesaConsumerKey || '',
    consumerSecret: runtime.mpesaConsumerSecret || '',
    businessShortCode: runtime.mpesaBusinessShortCode || '',
    partyA: runtime.mpesaPartyA || '',
    passKey: runtime.mpesaPassKey || '',
    transactionType: runtime.mpesaTransactionType || 'CustomerPayBillOnline',
    callbackUrl: runtime.mpesaCallbackUrl || '',
  }
}

export async function getMpesaStatus() {
  const config = await getMpesaConfig()
  const missing = []
  if (!config.consumerKey) missing.push('MPESA_CONSUMER_KEY')
  if (!config.consumerSecret) missing.push('MPESA_CONSUMER_SECRET')
  if (!config.businessShortCode) missing.push('MPESA_BUSINESS_SHORT_CODE')
  if (!config.passKey) missing.push('MPESA_PASSKEY')
  if (!config.callbackUrl) missing.push('MPESA_CALLBACK_URL')

  return {
    configured: missing.length === 0,
    missing,
    environment: config.environment,
    shortCode: config.businessShortCode || null,
    partyA: config.partyA || null,
    callbackUrl: config.callbackUrl || null,
  }
}

export async function listPayments() {
  if (!isMongoConfigured()) return []
  const db = await getMongoDb()
  return db
    .collection('payments')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()
}

export async function listRecentPaymentsForChat(chatId) {
  if (!isMongoConfigured() || !chatId) return []
  const db = await getMongoDb()
  return db
    .collection('payments')
    .find({ chatId }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()
}

export async function getPaymentById(id) {
  if (!isMongoConfigured() || !id) return null
  const db = await getMongoDb()
  return db.collection('payments').findOne({ id }, { projection: { _id: 0 } })
}

export async function getPaymentByCheckoutRequestId(checkoutRequestId) {
  if (!isMongoConfigured() || !checkoutRequestId) return null
  const db = await getMongoDb()
  return db.collection('payments').findOne({ checkoutRequestId }, { projection: { _id: 0 } })
}

export async function updatePaymentById(id, updates) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for payments')
  const db = await getMongoDb()
  const now = new Date().toISOString()
  await db.collection('payments').updateOne(
    { id },
    { $set: { ...updates, updatedAt: now } },
  )
  return db.collection('payments').findOne({ id }, { projection: { _id: 0 } })
}

export async function savePayment(payment) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for payments')
  const db = await getMongoDb()
  const now = new Date().toISOString()
  const id = payment.id || `payment-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const nextPayment = {
    id,
    status: payment.status || 'Pending',
    createdAt: payment.createdAt || now,
    updatedAt: now,
    ...payment,
  }
  await db.collection('payments').updateOne({ id }, { $set: nextPayment }, { upsert: true })
  return nextPayment
}

export async function updatePaymentByCheckoutRequestId(checkoutRequestId, updates) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for payments')
  const db = await getMongoDb()
  const now = new Date().toISOString()
  await db.collection('payments').updateOne(
    { checkoutRequestId },
    {
      $set: {
        ...updates,
        updatedAt: now,
      },
    },
  )
  return db.collection('payments').findOne({ checkoutRequestId }, { projection: { _id: 0 } })
}

export async function applyPaymentCallback(checkoutRequestId, updates) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for payments')
  const db = await getMongoDb()
  const now = new Date().toISOString()
  const result = await db.collection('payments').updateOne(
    {
      checkoutRequestId,
      $or: [
        { callbackProcessedAt: { $exists: false } },
        { callbackProcessedAt: null },
      ],
    },
    { $set: { ...updates, callbackProcessedAt: now, updatedAt: now } },
  )
  const payment = await db.collection('payments').findOne({ checkoutRequestId }, { projection: { _id: 0 } })
  return { payment, duplicate: result.modifiedCount === 0 && Boolean(payment) }
}
