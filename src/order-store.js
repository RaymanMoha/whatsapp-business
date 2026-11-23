import { getMongoDb, isMongoConfigured } from './mongodb.js'
import { decrementProductInventory } from './product-store.js'

export const ORDER_STATUSES = [
  'Awaiting payment',
  'Payment failed',
  'Paid',
  'Preparing',
  'Ready',
  'Completed',
  'Cancelled',
]

const allowedTransitions = {
  'Awaiting payment': ['Payment failed', 'Paid', 'Cancelled'],
  'Payment failed': ['Awaiting payment', 'Cancelled'],
  Paid: ['Preparing'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Completed'],
  Completed: [],
  Cancelled: [],
}

export function canTransitionOrder(from, to) {
  return Boolean(allowedTransitions[from]?.includes(to))
}

function statusFromPayment(payment) {
  if (payment.status === 'Paid') return 'Paid'
  if (['Failed', 'Request failed', 'Callback rejected'].includes(payment.status)) return 'Payment failed'
  return 'Awaiting payment'
}

function orderNumber(payment) {
  const source = String(payment.checkoutRequestId || payment.id || Date.now()).replace(/[^a-zA-Z0-9]/g, '')
  return `ORD-${source.slice(-8).toUpperCase()}`
}

export async function syncOrderFromPayment(payment) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for orders')
  if (!payment?.id) throw new Error('A payment is required to create an order')

  const db = await getMongoDb()
  const now = new Date().toISOString()
  const existing = await db.collection('orders').findOne({ paymentId: payment.id })
  const nextStatus = statusFromPayment(payment)
  const statusChanged = existing?.status !== nextStatus
  const order = {
    id: existing?.id || `order-${payment.id}`,
    orderNumber: existing?.orderNumber || orderNumber(payment),
    paymentId: payment.id,
    checkoutRequestId: payment.checkoutRequestId || null,
    chatId: payment.chatId || null,
    customerName: payment.customerName || payment.phone || 'Customer',
    phone: payment.phone || null,
    lineItems: Array.isArray(payment.lineItems) ? payment.lineItems : [],
    itemCount: Number(payment.itemCount || 0),
    subtotal: Number(payment.subtotal ?? payment.amount ?? 0),
    discount: Number(payment.discount || 0),
    promotion: payment.promotion || null,
    amount: Number(payment.amount || 0),
    paymentStatus: payment.status,
    mpesaReceiptNumber: payment.mpesaReceiptNumber || null,
    status: nextStatus,
    source: payment.source || 'dashboard',
    createdAt: existing?.createdAt || payment.createdAt || now,
    updatedAt: now,
  }

  if (!existing) {
    await db.collection('orders').updateOne(
      { paymentId: payment.id },
      {
        $set: order,
        $setOnInsert: {
          statusHistory: [{ status: nextStatus, at: now, actor: 'system' }],
          inventoryCommittedAt: null,
        },
      },
      { upsert: true },
    )
  } else {
    await db.collection('orders').updateOne(
      { paymentId: payment.id },
      {
        $set: order,
        ...(statusChanged
          ? { $push: { statusHistory: { status: nextStatus, at: now, actor: 'payment callback' } } }
          : {}),
      },
    )
  }

  return db.collection('orders').findOne({ paymentId: payment.id }, { projection: { _id: 0 } })
}

export async function commitPaidOrder(orderId) {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for orders')
  const db = await getMongoDb()
  const now = new Date().toISOString()
  const order = await db.collection('orders').findOneAndUpdate(
    { id: orderId, status: 'Paid', inventoryCommittedAt: null },
    { $set: { inventoryCommittedAt: now, updatedAt: now } },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  if (!order) return null
  await decrementProductInventory(order.lineItems || [])
  return order
}

export async function listOrders() {
  if (!isMongoConfigured()) return []
  const db = await getMongoDb()
  return db.collection('orders').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(200).toArray()
}

export async function getOrderById(id) {
  if (!isMongoConfigured() || !id) return null
  const db = await getMongoDb()
  return db.collection('orders').findOne({ id }, { projection: { _id: 0 } })
}

export async function updateOrderStatus(id, status, actor = 'dashboard') {
  if (!isMongoConfigured()) throw new Error('MongoDB is required for orders')
  if (!ORDER_STATUSES.includes(status)) throw new Error('Unknown order status')
  const db = await getMongoDb()
  const current = await db.collection('orders').findOne({ id })
  if (!current) throw new Error('Order not found')
  if (!canTransitionOrder(current.status, status)) {
    throw new Error(`Order cannot move from ${current.status} to ${status}`)
  }

  const now = new Date().toISOString()
  await db.collection('orders').updateOne(
    { id, status: current.status },
    {
      $set: { status, updatedAt: now, completedAt: status === 'Completed' ? now : current.completedAt || null },
      $push: { statusHistory: { status, at: now, actor } },
    },
  )
  return db.collection('orders').findOne({ id }, { projection: { _id: 0 } })
}
