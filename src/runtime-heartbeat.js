import { getMongoDb, isMongoConfigured } from './mongodb.js'

const COLLECTION = 'runtime_heartbeats'
const HEARTBEAT_ID = 'commerce-worker'
export const HEARTBEAT_MAX_AGE_MS = 90_000

export function isRuntimeHeartbeatFresh(heartbeat, now = Date.now(), maxAgeMs = HEARTBEAT_MAX_AGE_MS) {
  const updatedAt = new Date(heartbeat?.updatedAt || 0).getTime()
  return Number.isFinite(updatedAt) && updatedAt > 0 && now - updatedAt <= maxAgeMs
}

export async function writeRuntimeHeartbeat(status) {
  if (!isMongoConfigured()) return null
  const db = await getMongoDb()
  const heartbeat = {
    id: HEARTBEAT_ID,
    ...status,
    updatedAt: new Date().toISOString(),
  }
  await db.collection(COLLECTION).updateOne(
    { id: HEARTBEAT_ID },
    { $set: heartbeat },
    { upsert: true },
  )
  return heartbeat
}

export async function readRuntimeHeartbeat() {
  if (!isMongoConfigured()) return null
  const db = await getMongoDb()
  return db.collection(COLLECTION).findOne({ id: HEARTBEAT_ID }, { projection: { _id: 0 } })
}
