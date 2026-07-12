import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getMongoDb, isMongoConfigured } from './mongodb.js'

const dataDir = path.join(process.cwd(), 'data')
const conversationsFile = path.join(dataDir, 'conversations.json')

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(conversationsFile, 'utf8')
  } catch {
    await writeFile(conversationsFile, JSON.stringify({ threads: [] }, null, 2))
  }
}

export async function readConversationThreads() {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    return db.collection('conversations').find({}).sort({ updatedAt: -1 }).limit(200).toArray()
  }

  await ensureStore()
  const raw = await readFile(conversationsFile, 'utf8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed.threads) ? parsed.threads : []
}

export async function appendConversationEvent(event) {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const now = new Date().toISOString()
    const chatId = String(event.chatId)
    const message = {
      id: String(event.id || `${chatId}-${Date.now()}`),
      direction: event.direction,
      text: String(event.text || '').slice(0, 4000),
      status: event.status || 'received',
      timestamp: event.timestamp || now,
    }

    const duplicate = await db.collection('conversations').findOne(
      { chatId, 'messages.id': message.id },
      { projection: { _id: 1 } },
    )
    if (duplicate) return

    await db.collection('conversations').updateOne(
      { chatId },
      {
        $setOnInsert: {
          id: `thread-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          chatId,
          createdAt: now,
        },
        $set: {
          customerName: event.customerName || chatId,
          updatedAt: now,
        },
        $push: {
          messages: {
            $each: [message],
            $slice: -80,
          },
        },
      },
      { upsert: true },
    )
    return
  }

  await ensureStore()
  const threads = await readConversationThreads()
  const now = new Date().toISOString()
  const chatId = String(event.chatId)
  const existing = threads.find((thread) => thread.chatId === chatId)
  const message = {
    id: String(event.id || `${chatId}-${Date.now()}`),
    direction: event.direction,
    text: String(event.text || '').slice(0, 4000),
    status: event.status || 'received',
    timestamp: event.timestamp || now,
  }

  if (existing) {
    existing.customerName = event.customerName || existing.customerName || chatId
    existing.updatedAt = now
    existing.messages = [...(existing.messages || []), message].slice(-80)
  } else {
    threads.push({
      id: `thread-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      chatId,
      customerName: event.customerName || chatId,
      createdAt: now,
      updatedAt: now,
      messages: [message],
    })
  }

  threads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  await writeFile(conversationsFile, JSON.stringify({ threads: threads.slice(0, 200) }, null, 2))
}

export async function listConversationSummaries() {
  const threads = await readConversationThreads()
  return threads.map((thread) => {
    const messages = thread.messages || []
    const lastMessage = messages[messages.length - 1]
    const lastInbound = [...messages].reverse().find((message) => message.direction === 'inbound')
    const lastAssistant = [...messages].reverse().find((message) => message.direction === 'assistant')
    const lastFailure = [...messages].reverse().find(
      (message) => message.direction === 'system' && message.status === 'failed',
    )

    return {
      id: thread.id,
      chatId: thread.chatId,
      customerName: thread.customerName || thread.chatId,
      updatedAt: thread.updatedAt,
      lastQuestion: lastInbound?.text || lastMessage?.text || '',
      lastReply: lastAssistant?.text || '',
      status: lastFailure ? 'Send failed' : lastAssistant ? 'Reply sent' : 'Waiting for AI reply',
      error: lastFailure?.text || '',
      messageCount: messages.length,
    }
  })
}
