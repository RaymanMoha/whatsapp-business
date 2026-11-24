import test from 'node:test'
import assert from 'node:assert/strict'
import { shoppingAction, welcomeMenu, catalogPage, productCard, matchPhotoProducts, matchingCategory } from './shopping-ui.js'
const products = [
  { id:'lipstick',name:'Red Lipstick',category:'Makeup',price:950,stock:3,available:true },
  { id:'nail',name:'Red Nail Polish',category:'Makeup',price:650,stock:0,available:false },
  { id:'gucci',name:'Gucci Bloom Eau de',category:'Fragrance',price:12500,stock:4,available:true },
  { id:'ck',name:'Calvin Klein CK One',category:'Fragrance',price:7800,stock:2,available:true },
]

test('supports natural intent without product codes or number menus', () => {
  assert.equal(shoppingAction('Hello!').type,'menu')
  assert.deepEqual(shoppingAction('add two'),{type:'add',quantity:2,query:''})
  assert.deepEqual(shoppingAction("I'll take 2 Gucci Bloom"),{type:'add',quantity:2,query:'gucci bloom'})
  assert.deepEqual(shoppingAction('add lipstick to my cart'),{type:'add',quantity:1,query:'lipstick'})
  assert.equal(shoppingAction('yes please').type,'confirm_add')
  assert.equal(shoppingAction('add it').type,'add')
  for(const text of ['P1','254712345678','paid','Do not add lipstick','What are your hours?']) assert.equal(shoppingAction(text),null)
})

test('understands singular and plural photo requests and continued browsing', () => {
  for(const text of ['show pic','show me pics','photos','show pictures','send me images']) assert.equal(shoppingAction(text).type,'photos')
  assert.deepEqual(shoppingAction('show photos of Gucci Bloom'),{type:'photos',query:'gucci bloom'})
  assert.equal(shoppingAction('All').type,'browse')
  assert.equal(shoppingAction('show another').type,'more')
  assert.equal(matchingCategory(products,'show me perfumes'),'Fragrance')
  assert.deepEqual(matchPhotoProducts(products,'Gucci Bloom').map(p=>p.id),['gucci'])
  assert.deepEqual(matchPhotoProducts(products,'red').map(p=>p.id),['lipstick','nail'])
  assert.deepEqual(matchPhotoProducts(products,'unknown'),[])
})

test('shows names and honest availability with a single next action', () => {
  const catalog=catalogPage(products)
  assert.match(catalog,/Red Lipstick/)
  assert.match(catalog,/Sold out/)
  assert.match(catalog,/more/)
  assert.doesNotMatch(catalog,/P\d|1 —|product code/)
  assert.match(productCard(products[0]),/add two/)
  assert.doesNotMatch(productCard(products[1]),/Would you like to add/)
  assert.doesNotMatch(welcomeMenu('Our Shop',['Makeup','Fragrance']),/P\d|1 —|Reply with a number/)
})

test('matches CK as a word and recognizes checkout typos and quantities', () => {
  const catalog = products
  assert.deepEqual(matchPhotoProducts(catalog, 'ck').map(p => p.id), ['ck'])
  assert.deepEqual(shoppingAction('Number 7'), { type: 'select', number: 7 })
  assert.deepEqual(shoppingAction('7 add 1'), { type: 'select_add', number: 7, quantity: 1 })
  assert.deepEqual(shoppingAction('1'), { type: 'quantity', quantity: 1 })
  assert.deepEqual(shoppingAction('Yes 1'), { type: 'quantity', quantity: 1 })
})
