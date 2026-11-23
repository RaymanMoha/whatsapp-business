export const money = (value) => `KES ${Number(value || 0).toLocaleString('en-KE', { maximumFractionDigits: 2 })}`

export function shoppingAction(text) {
  const value = String(text || '').trim().toLowerCase().replace(/[!?.,]+$/, '')
  if (/^(hi|hello|hey|hey there|hello there|habari|jambo|sasa|start|menu|help menu)$/.test(value)) return { type: 'menu' }
  const photos = value.match(/^(?:(?:show|send)(?: me)?\s+)?(?:product\s+)?(?:pics|pictures|photos|images)(?:\s+(?:of|for)\s+(.+))?$/)
  if (photos) return { type: 'photos', query: photos[1] || '' }
  if (/^(1|browse|browse products|shop|products|catalog|catalogue|show products|show me products)$/.test(value)) return { type: 'browse' }
  if (/^(2|view cart|my cart)$/.test(value)) return { type: 'cart' }
  if (/^(3|track|track order|track my order|order status)$/.test(value)) return { type: 'track' }
  if (/^(4|help|contact|contact team|talk to someone|talk to a human|talk to our team)$/.test(value)) return { type: 'help' }
  if (/^(more|next|next page|more products)$/.test(value)) return { type: 'more' }
  const selection = value.match(/^(?:(show|view|add|remove)\s+)?(?:(\d{1,2})\s+)?p([1-9]\d*)(?:\s+(?:to|from)\s+(?:my\s+)?cart)?$/)
  if (selection) return { type: selection[1] === 'add' ? 'add' : selection[1] === 'remove' ? 'remove' : 'product', index: Number(selection[3]) - 1, quantity: Math.max(1, Number(selection[2] || 1)) }
  return null
}

export function welcomeMenu(name) {
  return `👋 Welcome to *${name}*!\n\n1 — Browse products\n2 — View my cart\n3 — Track my order\n4 — Help & contact\n\nReply with a number, or ask a question.\nType *menu* anytime to come back.`
}

export function catalogPage(products, page = 0, pageSize = 5) {
  if (!products.length) return 'There are no products to browse right now. Reply *4* for help or *menu* to go back.'
  const start = page * pageSize
  const entries = products.slice(start, start + pageSize).map((product, index) => {
    if (!product.id) return `*P${start + index + 1} · Product no longer available*`
    const available = product.available && Number(product.stock) > 0
    return `*P${start + index + 1} · ${product.name}*\n${money(product.price)} · ${available ? 'In stock' : 'Sold out'}`
  })
  return [`🛍️ *Browse products* · ${start + 1}–${Math.min(start + pageSize, products.length)} of ${products.length}`, ...entries, `Reply *P${start + 1}* for details, or *add P${start + 1}* to add one.\nFor quantity: *add 2 P${start + 1}*.`, ...(start + pageSize < products.length ? ['Reply *more* for the next page.'] : []), '*2* — View cart · *menu* — Main menu'].join('\n\n')
}

export function productCard(product, code) {
  const available = product.available && Number(product.stock) > 0
  return [`*${product.name}*`, product.subtitle, `*${money(product.price)}*`, ...(!product.image?.data || !product.image?.mimetype ? ['Photo not available yet.'] : []), available ? `${product.stock} in stock` : 'Currently sold out', '', available ? `Reply *add ${code}* to add one, or *add 2 ${code}* for two.` : 'Reply *browse* to see other products.', '*2* — View cart · *browse* — Products'].filter((line) => line !== undefined && line !== null).join('\n')
}

export function matchPhotoProducts(products, query) {
  const normalize = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const search = normalize(query)
  if (!search) return products
  return products.filter((product) => {
    const name = normalize(product.name)
    return name && (name.includes(search) || search.includes(name))
  })
}
