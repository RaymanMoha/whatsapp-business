import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { products as defaultProducts } from './catalog.js'
import { getMongoDb, isMongoConfigured } from './mongodb.js'

const dataDir = path.join(process.cwd(), 'data')
const productsFile = path.join(dataDir, 'products.json')

function cloneDefaultProducts() {
  return defaultProducts.map((product) => ({
    ...product,
    image: product.image || null,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  }))
}

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(productsFile, 'utf8')
  } catch {
    await writeFile(productsFile, JSON.stringify({ products: cloneDefaultProducts() }, null, 2))
  }
}

function serializeProduct(product) {
  const { _id, ...cleanProduct } = product
  if (cleanProduct.image?.data && cleanProduct.image?.mimetype) {
    cleanProduct.imageDataUrl = `data:${cleanProduct.image.mimetype};base64,${cleanProduct.image.data}`
  }
  return cleanProduct
}

export async function readProducts() {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const count = await db.collection('products').countDocuments()

    if (count === 0) {
      await db.collection('products').insertMany(cloneDefaultProducts())
    }

    const products = await db.collection('products').find({}).sort({ name: 1 }).toArray()
    return products.map(serializeProduct)
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const products = Array.isArray(parsed.products) ? parsed.products : []
  return products.map(serializeProduct).sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export async function updateProductImage(productId, image) {
  const products = await readProducts()
  const existing = products.find((product) => product.id === productId)
  if (!existing) throw new Error('Product not found')

  const now = new Date().toISOString()
  const nextImage = image
    ? {
        mimetype: image.mimetype,
        data: image.data,
        filename: image.filename,
        size: image.size,
        updatedAt: now,
      }
    : null

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('products').updateOne(
      { id: productId },
      {
        $set: {
          image: nextImage,
          updatedAt: now,
        },
      },
    )
    const updated = await db.collection('products').findOne({ id: productId })
    return serializeProduct(updated)
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const nextProducts = (Array.isArray(parsed.products) ? parsed.products : []).map((product) =>
    product.id === productId ? { ...product, image: nextImage, updatedAt: now } : product,
  )
  await writeFile(productsFile, JSON.stringify({ products: nextProducts }, null, 2))
  return serializeProduct(nextProducts.find((product) => product.id === productId))
}

export function findProductsForMessage(products, text, limit = 3) {
  const lower = String(text || '').toLowerCase()
  const available = products.filter((product) => product.available)
  const matched = available.filter((product) => {
    const haystack = [product.name, product.subtitle, product.category].filter(Boolean).join(' ').toLowerCase()
    return haystack
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .some((word) => lower.includes(word))
  })

  if (matched.length > 0) return matched.slice(0, limit)

  const asksForCatalog = [
    'available',
    'products',
    'catalog',
    'what do you have',
    'show',
    'price',
    'stock',
  ].some((phrase) => lower.includes(phrase))

  return asksForCatalog ? available.slice(0, limit) : []
}
