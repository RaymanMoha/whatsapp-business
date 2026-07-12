import { getMongoDb, isMongoConfigured } from './mongodb.js'

export function getMpesaConfig() {
  const environment = process.env.MPESA_ENV || 'sandbox'
  const baseUrl =
    process.env.MPESA_BASE_URL ||
    (environment === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke')

  return {
    environment,
    baseUrl,
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE || '',
    passKey: process.env.MPESA_PASSKEY || '',
    transactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
    callbackUrl: process.env.MPESA_CALLBACK_URL || '',
  }
}

export function getMpesaStatus() {
  const config = getMpesaConfig()
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
