import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { approvedKnowledge as defaultKnowledge } from './knowledge.js'
import { getMongoDb, isMongoConfigured } from './mongodb.js'

const STORE_ID = 'approved-knowledge'
const dataDir = path.join(process.cwd(), 'data')
const knowledgeFile = path.join(dataDir, 'approved-knowledge.json')

function slugify(value) {
  return String(value || 'knowledge')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createDefaultEntries() {
  const timestamp = new Date().toISOString()
  return defaultKnowledge.map((entry, index) => ({
    id: `${slugify(entry.topic)}-${index + 1}`,
    topic: entry.topic,
    content: entry.content,
    createdAt: timestamp,
    updatedAt: timestamp,
  }))
}

async function readFileDocument() {
  await mkdir(dataDir, { recursive: true })

  try {
    return JSON.parse(await readFile(knowledgeFile, 'utf8'))
  } catch {
    const document = { id: STORE_ID, entries: createDefaultEntries(), updatedAt: new Date().toISOString() }
    await writeFile(knowledgeFile, JSON.stringify(document, null, 2))
    return document
  }
}

async function readDocument() {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const collection = db.collection('businessKnowledge')
    let document = await collection.findOne({ id: STORE_ID })

    if (!document) {
      document = { id: STORE_ID, entries: createDefaultEntries(), updatedAt: new Date().toISOString() }
      await collection.insertOne(document)
    }

    return document
  }

  return readFileDocument()
}

async function writeDocument(document) {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('businessKnowledge').updateOne(
      { id: STORE_ID },
      { $set: document },
      { upsert: true },
    )
    return
  }

  await mkdir(dataDir, { recursive: true })
  await writeFile(knowledgeFile, JSON.stringify(document, null, 2))
}

function cleanEntry(entry) {
  const { _id, ...clean } = entry
  return clean
}

export async function readApprovedKnowledge() {
  const document = await readDocument()
  return Array.isArray(document.entries) ? document.entries.map(cleanEntry) : []
}

export async function upsertApprovedKnowledge(input) {
  const topic = String(input?.topic || '').trim()
  const content = String(input?.content || '').trim()

  if (!topic) throw new Error('A topic is required')
  if (!content) throw new Error('Approved information is required')

  const document = await readDocument()
  const entries = Array.isArray(document.entries) ? document.entries.map(cleanEntry) : []
  const now = new Date().toISOString()
  const id = String(input?.id || `knowledge-${Date.now()}-${Math.random().toString(16).slice(2)}`)
  const existingIndex = entries.findIndex((entry) => entry.id === id)
  const entry = {
    id,
    topic,
    content,
    createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
    updatedAt: now,
  }

  if (existingIndex >= 0) entries[existingIndex] = entry
  else entries.push(entry)

  await writeDocument({ id: STORE_ID, entries, updatedAt: now })
  return entry
}

export async function deleteApprovedKnowledge(id) {
  const document = await readDocument()
  const entries = (Array.isArray(document.entries) ? document.entries : []).filter(
    (entry) => entry.id !== id,
  )
  await writeDocument({ id: STORE_ID, entries, updatedAt: new Date().toISOString() })
}
