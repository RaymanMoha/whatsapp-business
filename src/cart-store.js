import { getMongoDb, isMongoConfigured } from './mongodb.js'

const memoryCarts = new Map()

export async function getCart(chatId) {
  if (!chatId) return []

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const cart = await db.collection('carts').findOne({ chatId }, { projection: { _id: 0, items: 1 } })
    return Array.isArray(cart?.items) ? cart.items : []
  }

  return memoryCarts.get(chatId) || []
}

export async function saveCart(chatId, items) {
  if (!chatId) throw new Error('A chat is required to save a cart')
  const nextItems = Array.isArray(items) ? items : []

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const now = new Date().toISOString()
    await db.collection('carts').updateOne(
      { chatId },
      {
        $set: { chatId, items: nextItems, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )
  } else {
    memoryCarts.set(chatId, nextItems)
  }

  return nextItems
}

export async function clearCart(chatId) {
  if (!chatId) return

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('carts').deleteOne({ chatId })
  } else {
    memoryCarts.delete(chatId)
  }
}
