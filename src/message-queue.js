import { getMongoDb, isMongoConfigured } from './mongodb.js'

const memoryQueue = new Map()
const memoryDeliveryQueue = new Map()
const MAX_ATTEMPTS = 6

export function retryDelayMs(attempts) {
  return Math.min(1000 * 2 ** Math.max(Number(attempts || 1) - 1, 0), 60_000)
}

export async function enqueueIncomingMessage(message) {
  const now = new Date()
  const event = {
    id: String(message.id),
    message,
    status: 'pending',
    attempts: 0,
    nextAttemptAt: now,
    createdAt: now,
    updatedAt: now,
  }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('message_queue').createIndex({ id: 1 }, { unique: true })
    const result = await db.collection('message_queue').updateOne(
      { id: event.id },
      { $setOnInsert: event },
      { upsert: true },
    )
    return { queued: result.upsertedCount === 1, duplicate: result.upsertedCount === 0 }
  }

  if (memoryQueue.has(event.id)) return { queued: false, duplicate: true }
  memoryQueue.set(event.id, event)
  return { queued: true, duplicate: false }
}

export async function claimIncomingMessage(workerId) {
  const now = new Date()
  const lockExpired = new Date(now.getTime() - 2 * 60 * 1000)

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    return db.collection('message_queue').findOneAndUpdate(
      {
        attempts: { $lt: MAX_ATTEMPTS },
        $or: [
          { status: { $in: ['pending', 'failed'] }, nextAttemptAt: { $lte: now } },
          { status: 'processing', lockedAt: { $lte: lockExpired } },
        ],
      },
      {
        $set: { status: 'processing', lockedAt: now, workerId, updatedAt: now },
        $inc: { attempts: 1 },
      },
      { sort: { createdAt: 1 }, returnDocument: 'after', projection: { _id: 0 } },
    )
  }

  const event = [...memoryQueue.values()].find(
    (item) => ['pending', 'failed'].includes(item.status) && new Date(item.nextAttemptAt) <= now,
  )
  if (!event) return null
  event.status = 'processing'
  event.attempts += 1
  event.lockedAt = now
  return event
}

export async function completeIncomingMessage(id) {
  const now = new Date()
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('message_queue').updateOne(
      { id },
      { $set: { status: 'completed', completedAt: now, updatedAt: now }, $unset: { lockedAt: '', workerId: '' } },
    )
  } else if (memoryQueue.has(id)) {
    Object.assign(memoryQueue.get(id), { status: 'completed', completedAt: now, updatedAt: now })
  }
}

export async function failIncomingMessage(id, error, attempts) {
  const now = new Date()
  const exhausted = Number(attempts || 0) >= MAX_ATTEMPTS
  const updates = {
    status: exhausted ? 'dead' : 'failed',
    error: String(error?.message || error || 'Message processing failed').slice(0, 1000),
    nextAttemptAt: new Date(now.getTime() + retryDelayMs(attempts)),
    updatedAt: now,
  }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('message_queue').updateOne(
      { id },
      { $set: updates, $unset: { lockedAt: '', workerId: '' } },
    )
  } else if (memoryQueue.has(id)) {
    Object.assign(memoryQueue.get(id), updates)
  }
}

export async function getMessageQueueStatus() {
  if (!isMongoConfigured()) {
    return {
      incoming: [...memoryQueue.values()].reduce((counts, item) => ({ ...counts, [item.status]: (counts[item.status] || 0) + 1 }), {}),
      delivery: [...memoryDeliveryQueue.values()].reduce((counts, item) => ({ ...counts, [item.status]: (counts[item.status] || 0) + 1 }), {}),
    }
  }
  const db = await getMongoDb()
  const [incomingRows, deliveryRows] = await Promise.all([
    db.collection('message_queue').aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
    db.collection('delivery_queue').aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
  ])
  return {
    incoming: Object.fromEntries(incomingRows.map((row) => [row._id, row.count])),
    delivery: Object.fromEntries(deliveryRows.map((row) => [row._id, row.count])),
  }
}

export async function enqueuePaymentDelivery(job) {
  const now = new Date()
  const event = { ...job, id: String(job.id), status: 'pending', attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('delivery_queue').createIndex({ id: 1 }, { unique: true })
    const result = await db.collection('delivery_queue').updateOne({ id: event.id }, { $setOnInsert: event }, { upsert: true })
    return { queued: result.upsertedCount === 1, duplicate: result.upsertedCount === 0 }
  }
  if (memoryDeliveryQueue.has(event.id)) return { queued: false, duplicate: true }
  memoryDeliveryQueue.set(event.id, event)
  return { queued: true, duplicate: false }
}

export async function claimPaymentDelivery(workerId) {
  const now = new Date()
  const lockExpired = new Date(now.getTime() - 2 * 60 * 1000)
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    return db.collection('delivery_queue').findOneAndUpdate(
      {
        attempts: { $lt: MAX_ATTEMPTS },
        $or: [
          { status: { $in: ['pending', 'failed'] }, nextAttemptAt: { $lte: now } },
          { status: 'processing', lockedAt: { $lte: lockExpired } },
        ],
      },
      { $set: { status: 'processing', lockedAt: now, workerId, updatedAt: now }, $inc: { attempts: 1 } },
      { sort: { createdAt: 1 }, returnDocument: 'after', projection: { _id: 0 } },
    )
  }
  const event = [...memoryDeliveryQueue.values()].find((item) => ['pending', 'failed'].includes(item.status) && new Date(item.nextAttemptAt) <= now)
  if (!event) return null
  Object.assign(event, { status: 'processing', attempts: event.attempts + 1, lockedAt: now, workerId, updatedAt: now })
  return event
}

export async function completePaymentDelivery(id) {
  const now = new Date()
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('delivery_queue').updateOne({ id }, { $set: { status: 'completed', completedAt: now, updatedAt: now }, $unset: { lockedAt: '', workerId: '' } })
  } else if (memoryDeliveryQueue.has(id)) {
    Object.assign(memoryDeliveryQueue.get(id), { status: 'completed', completedAt: now, updatedAt: now })
  }
}

export async function failPaymentDelivery(id, error, attempts) {
  const now = new Date()
  const updates = {
    status: Number(attempts || 0) >= MAX_ATTEMPTS ? 'dead' : 'failed',
    error: String(error?.message || error || 'Delivery failed').slice(0, 1000),
    nextAttemptAt: new Date(now.getTime() + retryDelayMs(attempts)),
    updatedAt: now,
  }
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('delivery_queue').updateOne({ id }, { $set: updates, $unset: { lockedAt: '', workerId: '' } })
  } else if (memoryDeliveryQueue.has(id)) {
    Object.assign(memoryDeliveryQueue.get(id), updates)
  }
}
