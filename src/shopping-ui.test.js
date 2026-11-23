import test from 'node:test'
import assert from 'node:assert/strict'
import { shoppingAction, welcomeMenu, catalogPage, productCard, matchPhotoProducts } from './shopping-ui.js'

const products = Array.from({ length: 7 }, (_, i) => ({ id: `item-${i}`, name: `Item ${i}`, price: 1200, stock: i ? 3 : 0, available: true }))

test('routes menu choices without confusing payment phones, claims, or questions', () => {
  assert.equal(shoppingAction('Hello!').type, 'menu')
  assert.equal(shoppingAction('2').type, 'cart')
  assert.equal(shoppingAction('3').type, 'track')
  for (const text of ['254712345678', 'paid', 'checkout', 'What are your opening hours?', 'add Green Tea to cart']) assert.equal(shoppingAction(text), null)
  assert.deepEqual(shoppingAction('add 2 P6'), { type: 'add', index: 5, quantity: 2 })
  assert.equal(shoppingAction('remove P6 from cart').type, 'remove')
  assert.equal(shoppingAction('P0'), null)
})

test('paginates with stable product codes and accurate stock', () => {
  assert.match(catalogPage(products), /Sold out/)
  assert.match(catalogPage(products), /more/)
  const next = catalogPage(products, 1)
  assert.match(next, /P6 · Item 5/)
  assert.match(next, /add 2 P6/)
  assert.doesNotMatch(next, /next page/)
  assert.match(catalogPage([]), /no products/)
  assert.doesNotMatch(catalogPage([{ name: 'Removed' }]), /KES 0/)
})

test('product cards do not invite adding sold-out items', () => {
  const soldOut = productCard(products[0], 'P1')
  assert.match(soldOut, /sold out/)
  assert.doesNotMatch(soldOut, /add P1/)
  assert.match(productCard(products[1], 'P2'), /KES 1,200/)
  assert.match(productCard(products[1], 'P2'), /add 2 P2/)
  assert.match(welcomeMenu('Our Shop'), /Welcome to \*Our Shop\*/)
})


test('recognizes photo requests and distinguishes missing product photos', () => {
  assert.deepEqual(shoppingAction('show pics'), { type: 'photos', query: '' })
  assert.deepEqual(shoppingAction('Send me photos of Honey'), { type: 'photos', query: 'honey' })
  assert.equal(shoppingAction('What are the pictures used for?'), null)
  assert.match(productCard(products[1], 'P2'), /Photo not available/)
  assert.doesNotMatch(productCard({ ...products[1], image: { data: 'photo', mimetype: 'image/png' } }, 'P2'), /Photo not available/)
})

test('photo requests select the named product rather than every shared word', () => {
  assert.deepEqual(matchPhotoProducts(products, 'Item 2').map(p => p.id), ['item-2'])
  assert.deepEqual(matchPhotoProducts(products, 'Unknown'), [])
})
