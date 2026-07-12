import assert from 'node:assert/strict'
import test from 'node:test'

import { signWebhookBody, verifyWebhookSignature } from './webhook-auth.js'

test('accepts only an exact sha512 signature for the raw webhook body', () => {
  const body = Buffer.from('{"event":"message","payload":{"body":"hello"}}')
  const signature = signWebhookBody(body, 'test-secret')
  assert.equal(verifyWebhookSignature(body, signature, 'sha512', 'test-secret'), true)
  assert.equal(verifyWebhookSignature(Buffer.from('{}'), signature, 'sha512', 'test-secret'), false)
  assert.equal(verifyWebhookSignature(body, signature, 'sha256', 'test-secret'), false)
})
