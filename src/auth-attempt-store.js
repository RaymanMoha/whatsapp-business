import crypto from 'node:crypto'
import { getMongoDb, isMongoConfigured } from './mongodb.js'

const memoryAttempts = new Map()
const MAX_FAILURES = 5
const LOCK_MS = 15 * 60 * 1000

function attemptKey(email, address = '') {
  return crypto.createHash('sha256').update(`${String(email).toLowerCase()}|${address}`).digest('hex')
}

export async function getLoginLimit(email, address) {
  const key = attemptKey(email, address)
  const record = isMongoConfigured()
    ? await (await getMongoDb()).collection('auth_attempts').findOne({ key })
    : memoryAttempts.get(key)
  const lockedUntil = record?.lockedUntil ? new Date(record.lockedUntil).getTime() : 0

  return {
    allowed: !lockedUntil || lockedUntil <= Date.now(),
    retryAfterSeconds: lockedUntil > Date.now() ? Math.ceil((lockedUntil - Date.now()) / 1000) : 0,
  }
}

export async function recordLoginFailure(email, address) {
  const key = attemptKey(email, address)
  const now = new Date()

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const previous = await db.collection('auth_attempts').findOne({ key })
    const failures = Number(previous?.failures || 0) + 1
    const lockedUntil = failures >= MAX_FAILURES ? new Date(now.getTime() + LOCK_MS) : null
    await db.collection('auth_attempts').updateOne(
      { key },
      { $set: { key, failures, lockedUntil, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    )
    return
  }

  const previous = memoryAttempts.get(key)
  const failures = Number(previous?.failures || 0) + 1
  memoryAttempts.set(key, {
    failures,
    lockedUntil: failures >= MAX_FAILURES ? new Date(now.getTime() + LOCK_MS) : null,
  })
}

export async function clearLoginFailures(email, address) {
  const key = attemptKey(email, address)
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('auth_attempts').deleteOne({ key })
  } else {
    memoryAttempts.delete(key)
  }
}
