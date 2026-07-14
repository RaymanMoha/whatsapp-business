import { getMongoDb, isMongoConfigured } from './mongodb.js'
import { createReceiptPdf, RECEIPT_TEMPLATE_VERSION } from './receipt.js'

export async function getReceiptByPaymentId(paymentId) {
  if (!isMongoConfigured() || !paymentId) return null
  const db = await getMongoDb()
  return db.collection('receipts').findOne({ paymentId }, { projection: { _id: 0 } })
}

export async function ensurePaymentReceipt(payment) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for receipts')
  if (!payment?.id) throw new Error('A payment is required to create a receipt')
  if (payment.status !== 'Paid') throw new Error('A receipt can only be created for a paid payment')

  const existing = await getReceiptByPaymentId(payment.id)
  if (existing?.templateVersion === RECEIPT_TEMPLATE_VERSION) return existing

  const pdf = await createReceiptPdf(payment)
  const now = new Date().toISOString()
  const receipt = {
    ...pdf,
    paymentId: payment.id,
    receiptNumber: payment.mpesaReceiptNumber || payment.id,
    customerName: payment.customerName || null,
    chatId: payment.chatId || null,
    phone: payment.phone || null,
    amount: payment.amount,
    productName: payment.productName || payment.accountReference || 'WhatsApp order',
    lineItems: Array.isArray(payment.lineItems) ? payment.lineItems : [],
    itemCount: Number(payment.itemCount || 0),
    subtotal: Number(payment.subtotal ?? payment.amount ?? 0),
    discount: Number(payment.discount || 0),
    promotion: payment.promotion || null,
    templateVersion: RECEIPT_TEMPLATE_VERSION,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    sharedAt: existing?.sharedAt || null,
  }

  const db = await getMongoDb()
  await db.collection('receipts').updateOne(
    { paymentId: payment.id },
    { $set: receipt },
    { upsert: true },
  )
  return getReceiptByPaymentId(payment.id)
}

export async function markReceiptShared(paymentId) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for receipts')
  const db = await getMongoDb()
  const sharedAt = new Date().toISOString()
  await db.collection('receipts').updateOne({ paymentId }, { $set: { sharedAt, updatedAt: sharedAt } })
  return sharedAt
}
