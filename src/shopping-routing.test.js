import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

test('numbering, pronouns and AI actions use an unrelated merchant catalog and never AI confirmations', { timeout: 45000 }, async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'merchant-routing-'))
  await mkdir(join(cwd, 'data'))
  await writeFile(join(cwd, 'data/products.json'), JSON.stringify({ products: [
    { id: 'tools-a', name: 'Copper Spanner', price: 300, stock: 10, available: true },
    { id: 'tools-b', name: 'Steel Hammer', price: 700, stock: 10, available: true },
  ] }))
  let decision = { action: 'clarify' }
  const ai = createServer(async (req, res) => {
    for await (const _ of req) { /* consume request */ }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(decision) } }] }))
  })
  await new Promise(resolve => ai.listen(0, '127.0.0.1', resolve))
  const reserve = createServer(); await new Promise(resolve => reserve.listen(0, '127.0.0.1', resolve))
  const port = reserve.address().port; await new Promise(resolve => reserve.close(resolve))
  const child = spawn(process.execPath, [fileURLToPath(new URL('./server.js', import.meta.url))], { cwd, env: { ...process.env, DEMO_PROFILE: '', MONGODB_URI: '', PORT: String(port), GROQ_API_KEY: 'test-only', GROQ_BASE_URL: `http://127.0.0.1:${ai.address().port}`, WAHA_BASE_URL: 'http://127.0.0.1:1' }, stdio: 'ignore' })
  try {
    for (let i = 0; i < 300; i++) { try { await fetch(`http://127.0.0.1:${port}/health`); break } catch { await new Promise(r => setTimeout(r, 100)) } }
    const say = async (message, chatId = 'merchant-one') => (await (await fetch(`http://127.0.0.1:${port}/test/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, chatId }) })).json()).reply
    assert.match(await say('Bros'), /1\. Copper Spanner/)
    assert.match(await say('Number 2'), /Steel Hammer/)
    assert.match(await say('2 add 1'), /1 x Steel Hammer/)
    assert.match(await say('cart'), /1 x Steel Hammer/)
    assert.match(await say('add that to cart'), /2 x Steel Hammer/)
    assert.match(await say('add two'), /4 x Steel Hammer/)
    assert.match(await say('cart', 'merchant-two'), /empty/)
    decision = { action: 'add', productIds: ['tools-a'], quantity: 2, reply: 'Invented confirmation' }
    assert.match(await say('I would like a couple of spanners please'), /2 x Copper Spanner/)
    decision = { action: 'add', productIds: ['foreign-product'], quantity: 99, reply: '99 noted' }
    assert.doesNotMatch(await say('mysterious request'), /99 noted/)
    assert.match(await say('cart'), /2 x Copper Spanner/)
    decision = { action: 'mark_paid', reply: 'Paid and order confirmed' }
    assert.doesNotMatch(await say('other request'), /Paid and order confirmed/)
    assert.match(await say('Number 99'), /not in your current collection/)
  } finally {
    if (child.exitCode === null) { child.kill(); await new Promise(resolve => child.once('exit', resolve)) }
    ai.closeAllConnections(); await new Promise(resolve => ai.close(resolve)); await rm(cwd, { recursive: true, force: true })
  }
})
