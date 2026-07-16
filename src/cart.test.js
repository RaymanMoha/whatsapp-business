import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addCartItems,
  extractCartQuantity,
  formatCartSummary,
  getCartItemCount,
  getCartTotal,
  isAddToCartIntent,
  isCartQuantityIntent,
  isProductSelectionIntent,
  isRemoveFromCartIntent,
  isViewCartIntent,
  matchCartProducts,
  removeCartItems,
  revalidateCartItems,
  setCartItemQuantity,
} from './cart.js'

const products = [
  { id: 'honey', name: 'Organic Honey', price: 1, stock: 5, available: true },
  { id: 'tea', name: 'Green Tea', price: 1, stock: 3, available: true },
  { id: 'candle', name: 'Lavender Candle', price: 1, stock: 0, available: false },
]

test('matches multiple products and creates a combined cart', () => {
  assert.equal(isAddToCartIntent('add organic honey and green tea to cart'), true)
  assert.equal(isViewCartIntent('show my cart'), true)
  assert.equal(isRemoveFromCartIntent('remove Green Tea from cart'), true)
  const matched = matchCartProducts(products, 'add organic honey and green tea to cart')
  const cart = addCartItems([], matched)

  assert.deepEqual(matched.map((product) => product.id), ['honey', 'tea'])
  assert.equal(getCartItemCount(cart), 2)
  assert.equal(getCartTotal(cart), 2)
  assert.match(formatCartSummary(cart), /Total: KES 2/)
})

test('treats a short multi-product reply as a cart selection', () => {
  const catalog = [
    { id: 'almonds', name: 'California Almonds 500g', price: 1, stock: 5, available: true },
    { id: 'honey', name: 'Organic Honey 500ml', price: 1, stock: 5, available: true },
  ]
  const message = 'California and organic honey'
  const matched = matchCartProducts(catalog, message)

  assert.deepEqual(matched.map((product) => product.id), ['almonds', 'honey'])
  assert.equal(isProductSelectionIntent(message, matched), true)
  assert.equal(isProductSelectionIntent('What is the price of California and organic honey?', matched), false)
})

test('supports quantity, removal, and stock limits', () => {
  assert.equal(extractCartQuantity('add 2 organic honey to cart'), 2)
  const cart = addCartItems([], [products[0]], 2)
  const capped = addCartItems(cart, [products[0]], 9)

  assert.equal(capped[0].quantity, 5)
  assert.deepEqual(removeCartItems(capped, ['honey']), [])
})

test('recognizes natural quantity requests and replaces the saved quantity exactly', () => {
  assert.equal(isCartQuantityIntent('I want to buy 5 pcs'), true)
  assert.equal(isCartQuantityIntent('I said I want 5 pcs and not 1. Can you update my order?'), true)
  assert.equal(isCartQuantityIntent('Is this available?'), false)

  const existing = addCartItems([], [products[0]], 1)
  const updated = setCartItemQuantity(existing, products[0], 5)

  assert.equal(updated[0].quantity, 5)
  assert.equal(updated[0].lineTotal, 5)
})

test('revalidates availability before checkout', () => {
  const cart = addCartItems([], products.slice(0, 2))
  const changedProducts = products.map((product) =>
    product.id === 'tea' ? { ...product, stock: 0, available: false } : product,
  )
  const result = revalidateCartItems(cart, changedProducts)

  assert.deepEqual(result.items.map((item) => item.productId), ['honey'])
  assert.deepEqual(result.issues, ['Green Tea is no longer available'])
})
