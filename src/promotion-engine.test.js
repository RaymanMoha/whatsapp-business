import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateCartPricing, isPromotionActive } from './promotion-engine.js'

const items = [
  { productId: 'tea', name: 'Green Tea', category: 'Drinks', unitPrice: 100, quantity: 2, lineTotal: 200 },
  { productId: 'honey', name: 'Honey', category: 'Grocery', unitPrice: 300, quantity: 1, lineTotal: 300 },
]

function promotion(overrides = {}) {
  return {
    id: 'summer',
    name: 'Summer offer',
    type: 'percentage',
    value: 10,
    minimumSpend: 0,
    active: true,
    scope: 'all',
    productIds: [],
    categories: [],
    redemptionLimit: null,
    redemptionCount: 0,
    ...overrides,
  }
}

test('applies the best active promotion without stacking', () => {
  const pricing = calculateCartPricing(items, [promotion(), promotion({ id: 'fixed', name: 'Best', type: 'fixed', value: 75 })])
  assert.equal(pricing.subtotal, 500)
  assert.equal(pricing.discount, 75)
  assert.equal(pricing.total, 425)
  assert.equal(pricing.promotion.id, 'fixed')
})

test('targets selected products and honors minimum spend', () => {
  const targeted = promotion({ scope: 'products', productIds: ['tea'], value: 50 })
  assert.equal(calculateCartPricing(items, [targeted]).discount, 100)
  assert.equal(calculateCartPricing(items, [promotion({ minimumSpend: 600 })]).discount, 0)
})

test('calculates buy one get one from eligible quantities', () => {
  const offer = promotion({ type: 'buy_x_get_y', value: 0, buyQuantity: 1, getQuantity: 1, scope: 'products', productIds: ['tea'] })
  const pricing = calculateCartPricing(items, [offer])
  assert.equal(pricing.discount, 100)
  assert.equal(pricing.total, 400)
})

test('rejects expired and exhausted promotions', () => {
  const at = new Date('2026-07-13T10:00:00.000Z')
  assert.equal(isPromotionActive(promotion({ endsAt: '2026-07-12T10:00:00.000Z' }), at), false)
  assert.equal(isPromotionActive(promotion({ redemptionLimit: 2, redemptionCount: 2 }), at), false)
})

test('treats free-delivery copy as a delivery benefit instead of discounting products', () => {
  const freeDelivery = promotion({
    id: 'delivery',
    name: 'Free delivery on Thursday',
    description: 'Delivery fee waived for Thursday orders',
    type: 'fixed',
    value: 500,
  })
  const pricing = calculateCartPricing(items, [freeDelivery])

  assert.equal(pricing.subtotal, 500)
  assert.equal(pricing.discount, 0)
  assert.equal(pricing.total, 500)
  assert.equal(pricing.promotion.type, 'free_delivery')
})
