import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeWhatsAppReply, selectWhatsAppProductImages } from './whatsapp-product-ux.js'

test('removes invented product image links from WhatsApp replies', () => {
  const reply = sanitizeWhatsAppReply(`Here are the links to the pictures:

1. Linen Shirt
https://example.com/linen-shirt.jpg
2. Satin Dress
https://cdn.example.test/satin-dress.png`)

  assert.equal(reply.includes('http'), false)
  assert.equal(reply.includes('links to the pictures'), false)
  assert.match(reply, /Linen Shirt/)
  assert.match(reply, /Satin Dress/)
})

test('preserves approved non-image business links', () => {
  const reply = sanitizeWhatsAppReply('Find the shop at https://maps.google.com/example')
  assert.equal(reply, 'Find the shop at https://maps.google.com/example')
})

test('selects at most one real product image', () => {
  const products = ['Dress', 'Shirt', 'Bag'].map((name, index) => ({
    id: String(index),
    name,
    subtitle: 'Women fashion',
    category: 'Fashion',
    available: true,
    image: { data: 'base64', mimetype: 'image/jpeg' },
  }))

  const selected = selectWhatsAppProductImages(products, 'Show available products')
  assert.equal(selected.length, 1)
  assert.equal(selected[0].name, 'Dress')
})
