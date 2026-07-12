import test from 'node:test'
import assert from 'node:assert/strict'
import { retryDelayMs } from './message-queue.js'

test('uses bounded exponential retry delays', () => {
  assert.equal(retryDelayMs(1), 1000)
  assert.equal(retryDelayMs(2), 2000)
  assert.equal(retryDelayMs(6), 32000)
  assert.equal(retryDelayMs(99), 60000)
})
