import { getMongoDb, isMongoConfigured } from './mongodb.js'
const memory = new Map()
export async function readShoppingContext(chatId) {
  if (isMongoConfigured()) return (await getMongoDb()).collection('shopping_contexts').findOne({ chatId }, { projection: { _id: 0 } })
  return memory.get(chatId) || null
}
export async function saveShoppingContext(chatId, context) {
  const value = { ...context, chatId, updatedAt: new Date().toISOString() }
  if (isMongoConfigured()) {
    const collection = (await getMongoDb()).collection('shopping_contexts')
    await collection.createIndex({ chatId: 1 }, { unique: true })
    await collection.updateOne({ chatId }, { $set: value }, { upsert: true })
  }
  else { memory.delete(chatId); memory.set(chatId, value); if (memory.size > 1000) memory.delete(memory.keys().next().value) }
}
