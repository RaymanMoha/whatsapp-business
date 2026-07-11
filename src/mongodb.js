import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'whatsapp_business'

let clientPromise

export function isMongoConfigured() {
  return Boolean(uri)
}

export async function getMongoDb() {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }

  if (!clientPromise) {
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  const client = await clientPromise
  return client.db(dbName)
}

export async function getMongoStatus() {
  if (!uri) {
    return { configured: false, connected: false, database: dbName }
  }

  try {
    const db = await getMongoDb()
    await db.command({ ping: 1 })
    return { configured: true, connected: true, database: db.databaseName }
  } catch (error) {
    return {
      configured: true,
      connected: false,
      database: dbName,
      error: error instanceof Error ? error.message : 'MongoDB connection failed',
    }
  }
}
