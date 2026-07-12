import crypto from 'node:crypto'

const KEY_LENGTH = 64
const COST = 16384
const BLOCK_SIZE = 8
const PARALLELIZATION = 1

export function hashPassword(password) {
  const value = String(password || '')
  if (value.length < 12) throw new Error('Password must be at least 12 characters')

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(value, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: 64 * 1024 * 1024,
  }).toString('hex')

  return `scrypt:${COST}:${BLOCK_SIZE}:${PARALLELIZATION}:${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  const value = String(storedHash || '')
  const separator = value.includes(':') ? ':' : '$'
  const [algorithm, cost, blockSize, parallelization, salt, expectedHex] = value.split(separator)
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false

  try {
    const expected = Buffer.from(expectedHex, 'hex')
    const actual = crypto.scryptSync(String(password || ''), salt, expected.length, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
      maxmem: 64 * 1024 * 1024,
    })
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}
