export const money = (value) => `KES ${Number(value || 0).toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
const normalize = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const quantities = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }

export function shoppingAction(text) {
  const value = String(text || '').trim().toLowerCase().replace(/[!?.,]+$/, '')
  if (/^(checkout|check out|pay|pay cart)$/.test(value)) return { type: 'checkout' }
  const numberedAdd = value.match(/^(?:number\s+)?([1-9][0-9]{0,4})\s+add\s+([1-9][0-9]?)$/)
  if (numberedAdd) return { type: 'select_add', number: Number(numberedAdd[1]), quantity: Number(numberedAdd[2]) }
  const numberedProduct = value.match(/^(?:number|no\.?|item|product)\s*#?\s*([1-9][0-9]{0,4})$/)
  if (numberedProduct) return { type: 'select', number: Number(numberedProduct[1]) }
  if (/^[1-9][0-9]{2,4}$/.test(value)) return { type: 'select', number: Number(value) }
  const confirmedQuantity = value.match(/^yes(?: please)?[ ,]+([1-9][0-9]?|one|two|three|four|five|six|seven|eight|nine|ten)$/)
  if (confirmedQuantity) return { type: 'quantity', quantity: quantities[confirmedQuantity[1]] || Number(confirmedQuantity[1]) }
  if (/^(?:[1-9][0-9]?|one|two|three|four|five|six|seven|eight|nine|ten)$/.test(value)) return { type: 'quantity', quantity: quantities[value] || Number(value) }
  if (/^(hi|hello|hey|hey there|hello there|habari|jambo|sasa|start|menu)$/.test(value)) return { type: 'menu' }
  if (/^(browse|browse products|shop|products|catalog|catalogue|show products|show me products|all|show all|show all products)$/.test(value)) return { type: 'browse' }
  if (/^(cart|view cart|my cart|show my cart|view my cart|what'?s in my cart)$/.test(value)) return { type: 'cart' }
  if (/^(track|track order|track my order|order status)$/.test(value)) return { type: 'track' }
  if (/^(help|contact|contact team|talk to someone|talk to a human|talk to our team)$/.test(value)) return { type: 'help' }
  if (/^(more|next|another|show another|show me another|next page|more products|more photos|more pics)$/.test(value)) return { type: 'more' }
  if (/^(yes|yes please)$/.test(value)) return { type: 'confirm_add', quantity: 1, query: '' }
  if (/^(add it|add this|add that|add to cart|add to my cart)$/.test(value)) return { type: 'add', quantity: 1, query: '' }
  const photos = value.match(/^(?:(?:show|send)(?: me)?\s+)?(?:all\s+)?(?:product\s+)?(?:pic|pics|picture|pictures|photo|photos|image|images)(?:\s+(?:(?:of|for)\s+)?(.+))?$/)
  if (photos) return { type: 'photos', query: photos[1] || '' }
  const addition = value.match(/^(?:add|put|take|i['’]?ll take)\s+(?:(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)\s*)?(.*?)(?:\s+(?:to|in)\s+(?:my\s+)?(?:cart|bag))?$/)
  if (addition) return { type: 'add', quantity: quantities[addition[1]] || Math.max(1, Number(addition[1] || 1)), query: addition[2].replace(/^(?:of\s+)?(?:it|this|that|these|those)$/, '').trim() }
  return null
}

export function welcomeMenu(name, categories = []) {
  return `Hi 👋 Welcome to *${name}*.\n\nWhat are you shopping for today?${categories.length ? `\n${categories.join(' · ')}` : ''}\n\nTell me what you’re looking for, or say *browse* to see the collection.`
}

export function catalogPage(products, page = 0, pageSize = 3, category = '') {
  if (!products.length) return 'I don’t have products in that collection right now. What else would you like to see?'
  const start = page * pageSize
  const visible = products.slice(start, start + pageSize)
  return [`*${category || 'The collection'}*`, ...visible.map((product, index) => `${start + index + 1}. ${product.name} — ${money(product.price)}${product.available && Number(product.stock) > 0 ? '' : ' · Sold out'}`), 'Which one catches your eye? Reply with its name or number.', ...(start + pageSize < products.length ? ['Say *more* to see the next few.'] : [])].join('\n\n')
}

export function productCard(product) {
  const available = product.available && Number(product.stock) > 0
  return [`*${product.name}* · *${money(product.price)}*`, product.subtitle, available ? 'In stock.' : 'Currently sold out.', ...(!product.image?.data || !product.image?.mimetype ? ['A photo isn’t available for this item yet.'] : []), available ? (product.id === 'nia-mpesa-test' ? 'Add one unit to test a KES 2 payment. Say *yes*. Approving a production M-Pesa prompt charges KES 2.' : 'Would you like to add it? Say *yes*, or *add two*.') : 'Would you like to see something similar?'].filter(Boolean).join('\n\n')
}

export function matchPhotoProducts(products, query) {
  const search = normalize(query).replace(/^(?:show me|show|tell me about|i want to see|i want|the|a|an) /, '')
  if (!search) return products
  const exact = products.filter(product => normalize(product.name) === search)
  if (exact.length) return exact
  return products.filter(product => {
    const name = normalize(product.name)
    return name && search.split(' ').every(word => name.split(' ').some(part => part === word || (word.length >= 3 && part.startsWith(word))))
  })
}

export function matchingCategory(products, text) {
  const value = normalize(text).replace(/^(?:show me|show|browse|shop|i want|looking for) /, '')
  const aliases = { perfume: 'fragrance', perfumes: 'fragrance', fragrances: 'fragrance', 'bodycare': 'body care' }
  const query = aliases[value] || value
  return [...new Set(products.map(product => product.category).filter(Boolean))].find(category => normalize(category) === query) || null
}
