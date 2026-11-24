import 'dotenv/config'
import { getMongoDb } from '../src/mongodb.js'
import { products as demoProducts } from '../src/catalog.js'
import { demoKnowledge, demoProfile } from '../src/demo-profile.js'

if (!demoProfile || !/_demo(?:_|$)/.test(process.env.MONGODB_DB || '')) {
  throw new Error('Set DEMO_PROFILE=nia-beauty and use a dedicated MONGODB_DB containing _demo before seeding.')
}
const db = await getMongoDb()
const now = new Date().toISOString()
await db.collection('products').bulkWrite(demoProducts.map(product => ({ updateOne: {
  filter: { id: product.id }, update: { $set: { ...product, updatedAt: now }, $setOnInsert: { createdAt: now } }, upsert: true,
} })))
await db.collection('businessKnowledge').updateOne({ id: 'approved-knowledge' }, { $set: {
  entries: demoKnowledge.map((entry, i) => ({ ...entry, id: `nia-demo-${i}`, createdAt: now, updatedAt: now })), updatedAt: now,
} }, { upsert: true })
console.log(`Seeded ${demoProducts.length} products with photos into ${db.databaseName}. No customer, payment, or order records were created.`)
process.exit(0)
