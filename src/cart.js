function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function isAddToCartIntent(text) {
  const lower = normalizeText(text)
  return lower.includes('cart') && /\b(add|put)\b/.test(lower)
}

export function isViewCartIntent(text) {
  const lower = normalizeText(text)
  return lower === 'cart' || (lower.includes('cart') && /\b(view|show|my|summary|what)\b/.test(lower))
}

export function isClearCartIntent(text) {
  const lower = normalizeText(text)
  return ['clear cart', 'empty cart', 'cancel cart', 'remove everything'].some((phrase) =>
    lower.includes(phrase),
  )
}

export function isRemoveFromCartIntent(text) {
  const lower = normalizeText(text)
  return (lower.includes('cart') && /\b(remove|delete)\b/.test(lower)) || lower.includes('take out of cart')
}

export function isProductSelectionIntent(text, matchedProducts) {
  if (!Array.isArray(matchedProducts) || matchedProducts.length < 2) return false

  const normalized = normalizeText(text)
  const words = normalized.split(' ').filter(Boolean)
  const hasConnector = /\b(and|plus|with)\b/.test(normalized) || String(text || '').includes(',')
  const looksLikeQuestion = /\b(what|which|compare|difference|price|cost|have|available|recommend)\b/.test(
    normalized,
  )

  return hasConnector && words.length <= 10 && !looksLikeQuestion
}

export function matchCartProducts(products, text) {
  const lower = normalizeText(text)
  return products.filter((product) => {
    const name = normalizeText(product.name)
    if (name && lower.includes(name)) return true

    const words = name.split(' ').filter((word) => word.length >= 4)
    return words.some((word) => lower.split(' ').includes(word))
  })
}

export function extractCartQuantity(text) {
  const normalized = normalizeText(text)
  const match = normalized.match(/(?:^|\s)(\d{1,2})(?:\s*x)?(?:\s|$)/)
  const quantity = Number(match?.[1] || 1)
  return Number.isInteger(quantity) && quantity > 0 ? Math.min(quantity, 99) : 1
}

export function addCartItems(currentItems, products, quantity = 1) {
  const next = currentItems.map((item) => ({ ...item }))

  for (const product of products) {
    if (!product.available) continue
    const existing = next.find((item) => item.productId === product.id)
    const currentQuantity = existing?.quantity || 0
    const availableStock = Math.max(Number(product.stock || 0), 0)
    const nextQuantity = Math.min(currentQuantity + quantity, availableStock)
    const item = {
      productId: product.id,
      name: product.name,
      category: product.category || '',
      unitPrice: Number(product.price || 0),
      quantity: nextQuantity,
      lineTotal: Number(product.price || 0) * nextQuantity,
    }

    if (existing) Object.assign(existing, item)
    else if (nextQuantity > 0) next.push(item)
  }

  return next.filter((item) => item.quantity > 0)
}

export function removeCartItems(currentItems, productIds) {
  const ids = new Set(productIds)
  return currentItems.filter((item) => !ids.has(item.productId))
}

export function revalidateCartItems(currentItems, products) {
  const issues = []
  const items = []

  for (const item of currentItems) {
    const product = products.find((candidate) => candidate.id === item.productId)
    if (!product || !product.available) {
      issues.push(`${item.name} is no longer available`)
      continue
    }

    const stock = Math.max(Number(product.stock || 0), 0)
    if (stock < item.quantity) {
      issues.push(`${product.name} only has ${stock} in stock`)
      continue
    }

    items.push({
      productId: product.id,
      name: product.name,
      category: product.category || '',
      unitPrice: Number(product.price || 0),
      quantity: item.quantity,
      lineTotal: Number(product.price || 0) * item.quantity,
    })
  }

  return { items, issues }
}

export function getCartTotal(items) {
  return items.reduce((total, item) => total + Number(item.lineTotal || 0), 0)
}

export function getCartItemCount(items) {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0)
}

export function formatCartSummary(items, heading = 'Your cart', pricing = null) {
  if (!items.length) return 'Your cart is empty.'

  const lines = items.map(
    (item) => `${item.quantity} x ${item.name} — KES ${item.lineTotal}`,
  )
  const subtotal = Number(pricing?.subtotal ?? getCartTotal(items))
  const discount = Number(pricing?.discount || 0)
  const total = Number(pricing?.total ?? subtotal)
  return [
    `${heading}:`,
    ...lines,
    ...(discount > 0
      ? [
          `Subtotal: KES ${subtotal}`,
          `${pricing?.promotion?.name || 'Promotion'}: -KES ${discount}`,
        ]
      : []),
    `Total: KES ${total}`,
  ].join('\n')
}
