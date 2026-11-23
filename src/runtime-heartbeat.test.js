import test from 'node:test'
import assert from 'node:assert/strict'
import { HEARTBEAT_MAX_AGE_MS, isRuntimeHeartbeatFresh } from './runtime-heartbeat.js'

test('accepts only recent worker heartbeats', () => {
  const now = Date.parse('2026-07-14T18:00:00.000Z')
  assert.equal(isRuntimeHeartbeatFresh({ updatedAt: new Date(now - 10_000).toISOString() }, now), true)
  assert.equal(isRuntimeHeartbeatFresh({ updatedAt: new Date(now - HEARTBEAT_MAX_AGE_MS - 1).toISOString() }, now), false)
  assert.equal(isRuntimeHeartbeatFresh(null, now), false)
})
