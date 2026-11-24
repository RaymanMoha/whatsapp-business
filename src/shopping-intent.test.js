import test from 'node:test'
import assert from 'node:assert/strict'
import { approximateShoppingCommand, validateShoppingDecision } from './shopping-intent.js'

test('recognizes close command spellings without a typo-specific list', () => {
  for (const text of ['Bros', 'brows', 'browes']) assert.equal(approximateShoppingCommand(text), 'browse')
  for (const text of ['Checkour', 'Chexkou', 'chekout']) assert.equal(approximateShoppingCommand(text), 'checkout')
  for (const text of ['delivery', 'lipstick', 'hours', '254712345678']) assert.equal(approximateShoppingCommand(text), null)
})

test('AI decisions may select only this merchant’s real products and approved facts', () => {
  const products = [{ id: 'merchant-toolbox' }], knowledge = [{ id: 'merchant-hours' }]
  const valid = x => validateShoppingDecision(x, products, knowledge)
  assert.equal(valid({ action: 'add', productIds: ['merchant-toolbox'], quantity: 2 }).action, 'add')
  for (const request of [
    { action: 'add', productIds: ['another-merchant-item'], quantity: 1 },
    { action: 'add', productIds: ['merchant-toolbox'], quantity: -1 },
    { action: 'add', productIds: ['merchant-toolbox'], quantity: 1.5 },
    { action: 'faq', knowledgeIds: ['invented-policy'] },
    { action: 'mark_paid', reply: 'Payment confirmed' },
    { reply: '1 lipstick noted' },
  ]) assert.equal(valid(request).action, 'clarify')
  assert.equal(valid({ action: 'faq', knowledgeIds: ['merchant-hours'] }).action, 'faq')
})
