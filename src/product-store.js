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

function productIdFromName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function validateProductInput(input) {
  const name = String(input?.name || '').trim()
  const category = String(input?.category || '').trim()
  const subtitle = String(input?.subtitle || '').trim()
  const emoji = String(input?.emoji || '📦').trim() || '📦'
  const price = Number(input?.price)
  const stock = Number(input?.stock)

  if (!name) throw new Error('Product name is required')
  if (!category) throw new Error('Category is required')
  if (!Number.isFinite(price) || price < 0) throw new Error('Price must be zero or more')
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Stock must be a whole number of zero or more')

  return { name, category, subtitle, emoji, price, stock, available: Boolean(input?.available) && stock > 0 }
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

export async function createProduct(input) {
  const product = validateProductInput(input)
  const id = productIdFromName(product.name)
  if (!id) throw new Error('Product name must include letters or numbers')

  const existingProducts = await readProducts()
  if (existingProducts.some((item) => item.id === id)) {
    throw new Error('A product with this name already exists')
  }

  const now = new Date().toISOString()
  const nextProduct = { id, ...product, image: null, createdAt: now, updatedAt: now }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('products').createIndex({ id: 1 }, { unique: true })
    await db.collection('products').insertOne(nextProduct)
    return serializeProduct(nextProduct)
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const products = Array.isArray(parsed.products) ? parsed.products : []
  products.push(nextProduct)
  await writeFile(productsFile, JSON.stringify({ products }, null, 2))
  return serializeProduct(nextProduct)
}

export async function updateProduct(productId, input) {
  const id = String(productId || '').trim()
  if (!id) throw new Error('Product id is required')

  const existingProducts = await readProducts()
  const existing = existingProducts.find((product) => product.id === id)
  if (!existing) throw new Error('Product not found')

  const product = validateProductInput(input)
  const updatedAt = new Date().toISOString()
  const updates = { ...product, updatedAt }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('products').updateOne({ id }, { $set: updates })
    const updated = await db.collection('products').findOne({ id })
    return serializeProduct(updated)
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const products = Array.isArray(parsed.products) ? parsed.products : []
  const nextProducts = products.map((item) => (item.id === id ? { ...item, ...updates } : item))
  await writeFile(productsFile, JSON.stringify({ products: nextProducts }, null, 2))
  return serializeProduct(nextProducts.find((item) => item.id === id))
}

export async function deleteProduct(productId) {
  const id = String(productId || '').trim()
  if (!id) throw new Error('Product id is required')

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const result = await db.collection('products').deleteOne({ id })
    if (result.deletedCount === 0) throw new Error('Product not found')
    return
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const products = Array.isArray(parsed.products) ? parsed.products : []
  const nextProducts = products.filter((product) => product.id !== id)
  if (nextProducts.length === products.length) throw new Error('Product not found')
  await writeFile(productsFile, JSON.stringify({ products: nextProducts }, null, 2))
}

export async function importProducts(rows) {
  const existingProducts = await readProducts()
  const existingIds = new Set(existingProducts.map((product) => product.id))
  const now = new Date().toISOString()
  const products = rows.map((row) => ({
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    category: row.category,
    price: Number(row.price),
    stock: Number(row.stock),
    available: Boolean(row.available),
    emoji: row.emoji || '📦',
    updatedAt: now,
  }))

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('products').bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { id: product.id },
          update: {
            $set: product,
            $setOnInsert: { image: null, createdAt: now },
          },
          upsert: true,
        },
      })),
    )
  } else {
    await ensureStore()
    const raw = await readFile(productsFile, 'utf8')
    const parsed = JSON.parse(raw)
    const current = Array.isArray(parsed.products) ? parsed.products : []
    const byId = new Map(current.map((product) => [product.id, product]))

    for (const product of products) {
      const previous = byId.get(product.id)
      byId.set(product.id, {
        ...previous,
        ...product,
        image: previous?.image || null,
        createdAt: previous?.createdAt || now,
      })
    }

    await writeFile(productsFile, JSON.stringify({ products: [...byId.values()] }, null, 2))
  }

  return {
    added: products.filter((product) => !existingIds.has(product.id)).length,
    updated: products.filter((product) => existingIds.has(product.id)).length,
    total: products.length,
  }
}

export async function decrementProductInventory(items) {
  if (!Array.isArray(items) || items.length === 0) return

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('products').bulkWrite(
      items.map((item) => {
        const quantity = Math.max(Number(item.quantity || 0), 0)
        return {
          updateOne: {
            filter: { id: item.productId },
            update: [
              {
                $set: {
                  stock: { $max: [{ $subtract: ['$stock', quantity] }, 0] },
                  updatedAt: new Date().toISOString(),
                },
              },
              { $set: { available: { $gt: ['$stock', 0] } } },
            ],
          },
        }
      }),
    )
    return
  }

  await ensureStore()
  const raw = await readFile(productsFile, 'utf8')
  const parsed = JSON.parse(raw)
  const quantities = new Map(items.map((item) => [item.productId, Number(item.quantity || 0)]))
  const products = (Array.isArray(parsed.products) ? parsed.products : []).map((product) => {
    const quantity = quantities.get(product.id)
    if (!quantity) return product
    const stock = Math.max(Number(product.stock || 0) - quantity, 0)
    return { ...product, stock, available: stock > 0, updatedAt: new Date().toISOString() }
  })
  await writeFile(productsFile, JSON.stringify({ products }, null, 2))
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
