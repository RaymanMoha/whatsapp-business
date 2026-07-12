import test from 'node:test'
import assert from 'node:assert/strict'
import { canTransitionOrder } from './order-store.js'

test('enforces the paid order fulfilment lifecycle', () => {
  assert.equal(canTransitionOrder('Paid', 'Preparing'), true)
  assert.equal(canTransitionOrder('Preparing', 'Ready'), true)
  assert.equal(canTransitionOrder('Ready', 'Completed'), true)
  assert.equal(canTransitionOrder('Completed', 'Preparing'), false)
  assert.equal(canTransitionOrder('Awaiting payment', 'Completed'), false)
})
