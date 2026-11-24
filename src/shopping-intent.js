// Interpret intent separately from rendering and executing real commerce actions.
export function validateShoppingDecision(value, products, knowledge) {
  if (!value || !['browse', 'select', 'add', 'cart', 'checkout', 'help', 'faq', 'clarify'].includes(value.action)) return { action: 'clarify' }
  const productIds = [...new Set(Array.isArray(value.productIds) ? value.productIds : [])]
  const knowledgeIds = [...new Set(Array.isArray(value.knowledgeIds) ? value.knowledgeIds : [])]
  if (['select', 'add'].includes(value.action) && (!productIds.length || productIds.some(id => !products.some(p => p.id === id)))) return { action: 'clarify' }
  if (value.action === 'add' && (!Number.isInteger(value.quantity) || value.quantity < 1 || value.quantity > 99)) return { action: 'clarify' }
  if (value.action === 'faq' && (!knowledgeIds.length || knowledgeIds.some(id => !knowledge.some(k => k.id === id)))) return { action: 'clarify' }
  return { action: value.action, productIds, quantity: value.quantity, knowledgeIds }
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]; row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const old = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = old
    }
  }
  return row[b.length]
}

export function approximateShoppingCommand(text) {
  const word = String(text).trim().toLowerCase()
  if (!/^[a-z]{4,10}$/.test(word)) return null
  const candidates = ['browse', 'checkout'].map(command => ({ command, distance: editDistance(word, command) }))
    .filter(x => x.distance <= Math.floor(x.command.length / 3)).sort((a, b) => a.distance - b.distance)
  return candidates.length && (candidates.length === 1 || candidates[0].distance < candidates[1].distance) ? candidates[0].command : null
}
