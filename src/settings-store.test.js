import test from 'node:test'
import assert from 'node:assert/strict'

test('dashboard settings redact provider credentials', async () => {
  delete process.env.MONGODB_URI
  process.env.AUTH_SECRET = 'test-auth-secret-that-is-long-enough'
  process.env.GROQ_API_KEY = 'gsk_test_secret_value_1234'
  process.env.MPESA_CONSUMER_KEY = 'mpesa-consumer-key-5678'

  const { getSettingsForDashboard } = await import(`./settings-store.js?test=${Date.now()}`)
  const settings = await getSettingsForDashboard()
  const serialized = JSON.stringify(settings)

  assert.equal(settings.secrets.groqApiKey.configured, true)
  assert.equal(settings.secrets.groqApiKey.ending, '1234')
  assert.equal(settings.secrets.groqApiKey.source, 'environment')
  assert.equal(serialized.includes('gsk_test_secret_value_1234'), false)
  assert.equal(serialized.includes('mpesa-consumer-key-5678'), false)
})
