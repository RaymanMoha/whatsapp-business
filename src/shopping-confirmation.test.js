import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

test('yes adds only after a fresh product question, without repeated accidental additions', { timeout: 15000 }, async () => {
  const listener = createServer()
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve))
  const port = listener.address().port
  await new Promise(resolve => listener.close(resolve))
  const cwd = await mkdtemp(join(tmpdir(), 'whatsapp-confirmation-'))
  const child = spawn(process.execPath, [fileURLToPath(new URL('./server.js', import.meta.url))], {
    cwd, env: { ...process.env, PORT: String(port), NODE_ENV: 'test', DEMO_PROFILE: 'nia-beauty', MONGODB_URI: '', GROQ_API_KEY: '', WAHA_BASE_URL: 'http://127.0.0.1:1' }, stdio: 'ignore',
  })
  try {
    let ready = false
    for (let i = 0; i < 60; i++) {
      try { await fetch(`http://127.0.0.1:${port}/health`); ready = true; break } catch { await new Promise(resolve => setTimeout(resolve, 100)) }
    }
    assert.ok(ready, 'test server started')
    const reply = async message => {
      const response = await fetch(`http://127.0.0.1:${port}/test/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, chatId: 'confirmation-test@c.us' }) })
      assert.equal(response.status, 200)
      return (await response.json()).reply
    }
    await reply('yes')
    assert.match(await reply('cart'), /empty/)
    await reply('Olay')
    assert.match(await reply('yes'), /1 x Olay/)
    assert.match(await reply('yes'), /Tell me which one/)
    assert.match(await reply('cart'), /1 x Olay/)
    assert.match(await reply('add two'), /3 x Olay/)
    await reply('Olay')
    await reply('browse')
    await reply('yes')
    assert.match(await reply('cart'), /3 x Olay/)
    await reply('Olay')
    assert.match(await reply('yes please'), /4 x Olay/)
    await reply('checkout')
    await reply('yes')
    assert.match(await reply('cart'), /4 x Olay/)
    await reply('clear cart')
    assert.match(await reply('M-Pesa Test'), /KES 2/)
    await reply('yes')
    assert.match(await reply('checkout'), /Checkout preview/)
    await reply('add it')
    assert.match(await reply('checkout'), /exactly \*one M-Pesa Test/)
    await reply('Olay')
    await reply('yes')
    assert.match(await reply('checkout'), /nothing else/)
  } finally {
    if (child.exitCode === null) { child.kill(); await new Promise(resolve => child.once('exit', resolve)) }
    await rm(cwd, { recursive: true, force: true })
  }
})
