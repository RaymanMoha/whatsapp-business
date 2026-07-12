import crypto from 'node:crypto'

export function signWebhookBody(rawBody, key) {
  return crypto.createHmac('sha512', key).update(rawBody).digest('hex')
}

export function verifyWebhookSignature(rawBody, signature, algorithm, key) {
  if (!key || !rawBody || !signature || String(algorithm).toLowerCase() !== 'sha512') return false
  const expected = Buffer.from(signWebhookBody(rawBody, key), 'hex')
  let received
  try {
    received = Buffer.from(String(signature), 'hex')
  } catch {
    return false
  }
  return received.length === expected.length && crypto.timingSafeEqual(received, expected)
}
