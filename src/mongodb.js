import { MongoClient } from 'mongodb'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'whatsapp_business'

let clientPromise
const execFileAsync = promisify(execFile)

function isDnsFailure(error) {
  const message = String(error?.message || error || '')
  return ['EBADRESP', 'ENOTFOUND', 'querySrv'].some((token) => message.includes(token))
}

async function atlasDirectUri(srvUri) {
  const parsed = new URL(srvUri)
  if (parsed.protocol !== 'mongodb+srv:') return srvUri
  const [{ stdout: srvOutput }, { stdout: txtOutput }] = await Promise.all([
    execFileAsync('dig', ['+short', 'SRV', `_mongodb._tcp.${parsed.hostname}`]),
    execFileAsync('dig', ['+short', 'TXT', parsed.hostname]),
  ])
  const hosts = srvOutput.trim().split('\n').filter(Boolean).map((line) => {
    const parts = line.trim().split(/\s+/)
    return `${parts[3].replace(/\.$/, '')}:${parts[2]}`
  })
  if (!hosts.length) throw new Error(`Could not resolve MongoDB hosts for ${parsed.hostname}`)
  const params = new URLSearchParams(txtOutput.replaceAll('"', '').trim())
  for (const [key, value] of parsed.searchParams) params.set(key, value)
  params.set('tls', 'true')
  const credentials = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@`
    : ''
  return `mongodb://${credentials}${hosts.join(',')}/${parsed.pathname.replace(/^\//, '')}?${params}`
}

async function connectClient() {
  const primary = new MongoClient(uri)
  try {
    return await primary.connect()
  } catch (error) {
    await primary.close().catch(() => {})
    if (!uri.startsWith('mongodb+srv://') || !isDnsFailure(error)) throw error
    const fallback = new MongoClient(await atlasDirectUri(uri))
    return fallback.connect()
  }
}

export function isMongoConfigured() {
  return Boolean(uri)
}

export async function getMongoDb() {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }

  if (!clientPromise) {
    clientPromise = connectClient().catch((error) => {
      clientPromise = undefined
      throw error
    })
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
