import test from 'node:test'
import assert from 'node:assert/strict'
import { clearCart, getCart, saveCart } from './cart-store.js'

test('stores and clears a cart without MongoDB', async () => {
  const chatId = `cart-store-test-${Date.now()}`
  const items = [{ productId: 'honey', name: 'Organic Honey', unitPrice: 1, quantity: 2, lineTotal: 2 }]

  await saveCart(chatId, items)
  assert.deepEqual(await getCart(chatId), items)
  await clearCart(chatId)
  assert.deepEqual(await getCart(chatId), [])
})
