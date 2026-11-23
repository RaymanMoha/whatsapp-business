import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getMongoDb, isMongoConfigured } from './mongodb.js'
import { isPromotionActive } from './promotion-engine.js'

const dataDir = path.join(process.cwd(), 'data')
const promotionsFile = path.join(dataDir, 'promotions.json')
const allowedTypes = new Set(['percentage', 'fixed', 'buy_x_get_y'])
const allowedScopes = new Set(['all', 'products', 'categories'])

function clean(document) {
  if (!document) return document
  const { _id, redemptionPaymentIds, ...promotion } = document
  return promotion
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean))]
}

function optionalDate(value, label) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new Error(`${label} must be a valid date`)
  return date.toISOString()
}

function validatePromotionInput(input, existing = null) {
  const name = String(input?.name || '').trim()
  const description = String(input?.description || '').trim()
  const type = String(input?.type || '')
  const scope = String(input?.scope || 'all')
  const minimumSpend = Number(input?.minimumSpend || 0)
  const startsAt = optionalDate(input?.startsAt, 'Start date')
  const endsAt = optionalDate(input?.endsAt, 'End date')
  const productIds = uniqueStrings(input?.productIds)
  const categories = uniqueStrings(input?.categories)
  const rawLimit = input?.redemptionLimit
  const redemptionLimit = rawLimit === '' || rawLimit === null || rawLimit === undefined ? null : Number(rawLimit)

  if (!name) throw new Error('Promotion name is required')
  if (!description) throw new Error('Customer-facing details are required')
  if (!allowedTypes.has(type)) throw new Error('Choose a valid promotion type')
  if (!allowedScopes.has(scope)) throw new Error('Choose who the promotion applies to')
  if (!Number.isFinite(minimumSpend) || minimumSpend < 0) throw new Error('Minimum spend must be zero or more')
  if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) throw new Error('End date must be after the start date')
  if (scope === 'products' && productIds.length === 0) throw new Error('Select at least one product')
  if (scope === 'categories' && categories.length === 0) throw new Error('Select at least one category')
  if (redemptionLimit !== null && (!Number.isInteger(redemptionLimit) || redemptionLimit < 1)) {
    throw new Error('Redemption limit must be a whole number greater than zero')
  }

  const value = type === 'buy_x_get_y' ? 0 : Number(input?.value)
  const buyQuantity = type === 'buy_x_get_y' ? Number(input?.buyQuantity || 1) : null
  const getQuantity = type === 'buy_x_get_y' ? Number(input?.getQuantity || 1) : null
  if (type !== 'buy_x_get_y' && (!Number.isFinite(value) || value <= 0)) throw new Error('Discount value must be greater than zero')
  if (type === 'percentage' && value > 100) throw new Error('Percentage discount cannot exceed 100')
  if (type === 'buy_x_get_y' && (!Number.isInteger(buyQuantity) || buyQuantity < 1 || !Number.isInteger(getQuantity) || getQuantity < 1)) {
    throw new Error('Buy and free quantities must be whole numbers greater than zero')
  }

  return {
    name,
    description,
    type,
    value,
    buyQuantity,
    getQuantity,
    minimumSpend,
    startsAt,
    endsAt,
    active: input?.active !== false,
    scope,
    productIds: scope === 'products' ? productIds : [],
    categories: scope === 'categories' ? categories : [],
    redemptionLimit,
    redemptionCount: Number(existing?.redemptionCount || 0),
  }
}

async function readFileDocument() {
  await mkdir(dataDir, { recursive: true })
  try {
    const document = JSON.parse(await readFile(promotionsFile, 'utf8'))
    return { promotions: Array.isArray(document.promotions) ? document.promotions : [], redemptions: Array.isArray(document.redemptions) ? document.redemptions : [] }
  } catch {
    const document = { promotions: [], redemptions: [] }
    await writeFile(promotionsFile, JSON.stringify(document, null, 2))
    return document
  }
}

async function writeFileDocument(document) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(promotionsFile, JSON.stringify(document, null, 2))
}

export async function readPromotions() {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const promotions = await db.collection('promotions').find({}).sort({ createdAt: -1 }).toArray()
    return promotions.map(clean)
  }
  const document = await readFileDocument()
  return document.promotions.map(clean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export async function readActivePromotions(at = new Date()) {
  return (await readPromotions()).filter((promotion) => isPromotionActive(promotion, at))
}

export async function createPromotion(input) {
  const now = new Date().toISOString()
  const details = validatePromotionInput(input)
  const promotion = {
    id: `promotion-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...details,
    createdAt: now,
    updatedAt: now,
  }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('promotions').createIndex({ id: 1 }, { unique: true })
    await db.collection('promotions').insertOne(promotion)
    return clean(promotion)
  }
  const document = await readFileDocument()
  document.promotions.unshift(promotion)
  await writeFileDocument(document)
  return clean(promotion)
}

export async function updatePromotion(id, input) {
  const promotionId = String(id || '').trim()
  const promotions = await readPromotions()
  const existing = promotions.find((promotion) => promotion.id === promotionId)
  if (!existing) throw new Error('Promotion not found')
  const next = { ...existing, ...validatePromotionInput(input, existing), updatedAt: new Date().toISOString() }

  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('promotions').updateOne({ id: promotionId }, { $set: next })
    return clean(await db.collection('promotions').findOne({ id: promotionId }))
  }
  const document = await readFileDocument()
  document.promotions = document.promotions.map((promotion) => promotion.id === promotionId ? next : promotion)
  await writeFileDocument(document)
  return clean(next)
}

export async function deletePromotion(id) {
  const promotionId = String(id || '').trim()
  if (!promotionId) throw new Error('Promotion id is required')
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    const result = await db.collection('promotions').deleteOne({ id: promotionId })
    if (!result.deletedCount) throw new Error('Promotion not found')
    return
  }
  const document = await readFileDocument()
  const remaining = document.promotions.filter((promotion) => promotion.id !== promotionId)
  if (remaining.length === document.promotions.length) throw new Error('Promotion not found')
  document.promotions = remaining
  await writeFileDocument(document)
}

export async function recordPromotionRedemption(promotionId, paymentId) {
  if (!promotionId || !paymentId) return false
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    await db.collection('promotionRedemptions').createIndex({ paymentId: 1 }, { unique: true })
    try {
      await db.collection('promotionRedemptions').insertOne({ promotionId, paymentId, createdAt: new Date().toISOString() })
    } catch (error) {
      if (error?.code === 11000) return false
      throw error
    }
    await db.collection('promotions').updateOne({ id: promotionId }, { $inc: { redemptionCount: 1 }, $set: { updatedAt: new Date().toISOString() } })
    return true
  }
  const document = await readFileDocument()
  if (document.redemptions.some((redemption) => redemption.paymentId === paymentId)) return false
  document.redemptions.push({ promotionId, paymentId, createdAt: new Date().toISOString() })
  document.promotions = document.promotions.map((promotion) => promotion.id === promotionId ? { ...promotion, redemptionCount: Number(promotion.redemptionCount || 0) + 1, updatedAt: new Date().toISOString() } : promotion)
  await writeFileDocument(document)
  return true
}
