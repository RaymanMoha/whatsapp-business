import test from 'node:test'
import assert from 'node:assert/strict'

import { buildDemoReply } from './demo.js'

test('starts a guided merchant demo from the landing-page WhatsApp message', () => {
  const reply = buildDemoReply('Hi AppBase, I would like to see the merchant demo.')

  assert.match(reply, /Welcome to the AppBase merchant demo/)
  assert.match(reply, /Show products/)
  assert.match(reply, /Add 2 \[product name\] to my cart/)
  assert.match(reply, /Book a demo/)
})

test('offers a human walkthrough when a prospect asks to book', () => {
  const reply = buildDemoReply('Can I book a demo?')

  assert.match(reply, /name and business name/)
  assert.match(reply, /preferred day and time/)
})

test('does not intercept ordinary commerce messages', () => {
  assert.equal(buildDemoReply('Show me the products'), null)
  assert.equal(buildDemoReply('Add two jeans to my cart'), null)
})
