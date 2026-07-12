import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, verifyPassword } from './auth-password.js'

test('hashes and verifies dashboard passwords with scrypt', () => {
  const encoded = hashPassword('a-strong-dashboard-password')
  assert.match(encoded, /^scrypt:/)
  assert.equal(verifyPassword('a-strong-dashboard-password', encoded), true)
  assert.equal(verifyPassword('wrong-password', encoded), false)
})
