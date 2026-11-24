import test from 'node:test'
import assert from 'node:assert/strict'
import { demoPaymentTestProduct, isDemoPaymentTest } from './demo-payment-test.js'
import { addCartItems } from './cart.js'
import { calculateCartPricing } from './promotion-engine.js'

test('only one undiscounted KES 2 test item can enter demo payment', () => {
  const one = addCartItems([], [demoPaymentTestProduct], 1)
  assert.equal(isDemoPaymentTest(one, calculateCartPricing(one, [])), true)
  const two = addCartItems([], [demoPaymentTestProduct], 2)
  assert.equal(isDemoPaymentTest(two, calculateCartPricing(two, [])), false)
  const mixed = addCartItems(one, [{ ...demoPaymentTestProduct, id: 'beauty-item' }])
  assert.equal(isDemoPaymentTest(mixed, calculateCartPricing(mixed, [])), false)
  assert.equal(isDemoPaymentTest(one, { subtotal: 2, total: 1, discount: 1 }), false)
  assert.equal(isDemoPaymentTest([{ ...one[0], unitPrice: 200 }], { subtotal: 2, total: 2, discount: 0 }), false)
  assert.equal(isDemoPaymentTest([], { subtotal: 0, total: 0, discount: 0 }), false)
})
