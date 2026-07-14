import crypto from 'node:crypto'
import { getMongoDb, isMongoConfigured } from './mongodb.js'
import { listOrders } from './order-store.js'
import { listPayments } from './mpesa-store.js'
import { readProducts } from './product-store.js'
import { getRuntimeSettings } from './settings-store.js'

const EVENT_COLLECTION = 'google_integration_events'

function spreadsheetIdFromUrl(value) {
  const match = String(value || '').match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match?.[1] || ''
}

function assertScriptUrl(value) {
  let url
  try {
    url = new URL(String(value || ''))
  } catch {
    throw new Error('The Apps Script web app URL is invalid')
  }
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com') {
    throw new Error('Use the HTTPS web app URL from script.google.com')
  }
  return url.toString()
}

function safeProducts(products) {
  return products.map(({ image, imageDataUrl, ...product }) => ({
    id: product.id,
    name: product.name,
    subtitle: product.subtitle || '',
    category: product.category,
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    available: Boolean(product.available),
    emoji: product.emoji || '📦',
    imageAvailable: Boolean(image || imageDataUrl),
    updatedAt: product.updatedAt || '',
  }))
}

function safeOrders(orders) {
  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    customer: order.customerName,
    phone: order.phone || '',
    items: (order.lineItems || []).map((item) => `${item.quantity} x ${item.name}`).join(', '),
    itemCount: Number(order.itemCount || 0),
    amount: Number(order.amount || 0),
    paymentStatus: order.paymentStatus || '',
    orderStatus: order.status || '',
    receipt: order.mpesaReceiptNumber || '',
    source: order.source || '',
    createdAt: order.createdAt || '',
    updatedAt: order.updatedAt || '',
  }))
}

function safePayments(payments) {
  return payments.map((payment) => ({
    reference: payment.accountReference || '',
    customer: payment.customerName || '',
    phone: payment.phone || '',
    amount: Number(payment.amount || 0),
    status: payment.status || '',
    receipt: payment.mpesaReceiptNumber || '',
    source: payment.source || '',
    createdAt: payment.createdAt || '',
    paidAt: payment.paidAt || '',
  }))
}

export async function buildGoogleSyncPayload() {
  const [products, orders, payments] = await Promise.all([
    readProducts(),
    listOrders(),
    listPayments(),
  ])
  return {
    products: safeProducts(products),
    orders: safeOrders(orders),
    payments: safePayments(payments),
  }
}

export async function syncGoogleWorkspace() {
  const runtime = await getRuntimeSettings({ fresh: true })
  const scriptUrl = assertScriptUrl(runtime.googleAppsScriptUrl)
  if (!runtime.googleIntegrationSecret) throw new Error('Add the shared integration secret first')
  const spreadsheetId = spreadsheetIdFromUrl(runtime.googleSpreadsheetUrl)
  if (!spreadsheetId) throw new Error('Add a valid Google Sheets URL first')

  const data = await buildGoogleSyncPayload()
  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'replace_data',
      secret: runtime.googleIntegrationSecret,
      spreadsheetId,
      eventId: crypto.randomUUID(),
      sentAt: new Date().toISOString(),
      data,
    }),
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  })
  if (!response.ok) throw new Error(`Google sync failed (${response.status})`)
  const payload = await response.json().catch(() => null)
  if (!payload?.ok) throw new Error(payload?.error || 'Google did not confirm the sync')
  return {
    syncedAt: new Date().toISOString(),
    counts: {
      products: data.products.length,
      orders: data.orders.length,
      payments: data.payments.length,
    },
  }
}

export async function verifyGoogleWebhookSecret(provided) {
  const runtime = await getRuntimeSettings({ fresh: true })
  const expected = String(runtime.googleIntegrationSecret || '')
  const received = String(provided || '')
  if (!expected || !received) return false
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(received)
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

export async function reserveGoogleEvent(eventId, action) {
  if (!isMongoConfigured()) return { duplicate: false }
  const db = await getMongoDb()
  const collection = db.collection(EVENT_COLLECTION)
  await collection.createIndex({ eventId: 1 }, { unique: true })
  try {
    await collection.insertOne({ eventId, action, status: 'processing', createdAt: new Date().toISOString() })
    return { duplicate: false }
  } catch (error) {
    if (error?.code === 11000) return { duplicate: true }
    throw error
  }
}

export async function finishGoogleEvent(eventId, status, result) {
  if (!isMongoConfigured()) return
  const db = await getMongoDb()
  await db.collection(EVENT_COLLECTION).updateOne(
    { eventId },
    { $set: { status, result, completedAt: new Date().toISOString() } },
  )
}
