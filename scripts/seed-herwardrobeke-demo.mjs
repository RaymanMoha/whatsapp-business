import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { MongoClient } from 'mongodb'
import { products } from '../src/catalog.js'

const execFileAsync = promisify(execFile)

const root = process.cwd()
const imageDirectory = path.join(root, 'public', 'demo', 'herwardrobeke')
const backupDirectory = path.join(root, 'output', 'demo-data')
const localProductsFile = path.join(root, 'data', 'products.json')
const imageFiles = [
  '01-olive-midi-dress.jpg',
  '02-ribbed-knit-set.jpg',
  '03-wide-leg-trousers.jpg',
  '04-linen-shirt.jpg',
  '05-structured-blazer.jpg',
  '06-black-bodycon-dress.jpg',
  '07-pleated-maxi-skirt.jpg',
  '08-straight-leg-jeans.jpg',
  '09-shoulder-bag.jpg',
  '10-block-heel-sandals.jpg',
]

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required')

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

  const txtParams = txtOutput.replaceAll('"', '').trim()
  const params = new URLSearchParams(txtParams)
  for (const [key, value] of parsed.searchParams) params.set(key, value)
  params.set('tls', 'true')

  const credentials = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@`
    : ''
  return `mongodb://${credentials}${hosts.join(',')}/${parsed.pathname.replace(/^\//, '')}?${params}`
}

async function connectMongo(uri) {
  const primary = new MongoClient(uri)
  try {
    await primary.connect()
    return primary
  } catch (error) {
    await primary.close().catch(() => {})
    if (!String(error?.message || '').includes('EBADRESP') || !uri.startsWith('mongodb+srv://')) throw error
    const fallback = new MongoClient(await atlasDirectUri(uri))
    await fallback.connect()
    return fallback
  }
}

await fs.mkdir(backupDirectory, { recursive: true })
await fs.mkdir(path.dirname(localProductsFile), { recursive: true })

const now = new Date().toISOString()
const records = await Promise.all(products.map(async (product, index) => {
  const filename = imageFiles[index]
  const image = await fs.readFile(path.join(imageDirectory, filename))
  return {
    ...product,
    image: {
      mimetype: 'image/jpeg',
      data: image.toString('base64'),
      filename,
      size: image.byteLength,
      updatedAt: now,
    },
    createdAt: now,
    updatedAt: now,
  }
}))

const client = await connectMongo(process.env.MONGODB_URI)

try {
  const db = client.db(process.env.MONGODB_DB || 'whatsapp_business')
  const currentProducts = await db.collection('products').find({}).toArray()
  const backupStamp = now.replaceAll(':', '-').replaceAll('.', '-')
  const backupFile = path.join(backupDirectory, `catalog-before-herwardrobeke-${backupStamp}.json`)
  await fs.writeFile(backupFile, JSON.stringify({ createdAt: now, products: currentProducts }, null, 2))

  await db.collection('products').deleteMany({})
  await db.collection('products').insertMany(records)
  await db.collection('products').createIndex({ id: 1 }, { unique: true })
  await db.collection('carts').deleteMany({})

  await fs.writeFile(localProductsFile, JSON.stringify({ products: records }, null, 2))
  console.log(JSON.stringify({ database: db.databaseName, products: records.length, cartsCleared: true, backupFile }, null, 2))
} finally {
  await client.close()
}
