function text(value) {
  return String(value ?? '').trim()
}

function slugify(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value
  const normalized = text(value).toLowerCase()
  if (['true', 'yes', '1', 'available', 'in stock'].includes(normalized)) return true
  if (['false', 'no', '0', 'sold out', 'unavailable'].includes(normalized)) return false
  return null
}

export const CATALOG_COLUMNS = [
  'id',
  'name',
  'subtitle',
  'category',
  'price',
  'stock',
  'available',
  'emoji',
]

export function validateCatalogRows(rows, existingProducts = []) {
  const existingIds = new Set(existingProducts.map((product) => product.id))
  const seenIds = new Set()

  return rows.map((row, index) => {
    const rowNumber = Number(row.rowNumber || index + 2)
    const name = text(row.name)
    const id = text(row.id) || slugify(name)
    const price = Number(row.price)
    const stock = Number(row.stock)
    const available = parseBoolean(row.available)
    const errors = []

    if (!name) errors.push('Name is required')
    if (!id) errors.push('ID is required')
    if (id && !/^[a-z0-9][a-z0-9-]*$/.test(id)) errors.push('ID must use lowercase letters, numbers, and hyphens')
    if (!text(row.category)) errors.push('Category is required')
    if (!Number.isFinite(price) || price < 0) errors.push('Price must be 0 or more')
    if (!Number.isInteger(stock) || stock < 0) errors.push('Stock must be a whole number 0 or more')
    if (available === null) errors.push('Available must be Yes or No')
    if (seenIds.has(id)) errors.push('Duplicate ID in file')
    if (id) seenIds.add(id)

    return {
      rowNumber,
      id,
      name,
      subtitle: text(row.subtitle),
      category: text(row.category),
      price: Number.isFinite(price) ? price : 0,
      stock: Number.isFinite(stock) ? stock : 0,
      available: available ?? false,
      emoji: text(row.emoji) || '📦',
      action: existingIds.has(id) ? 'Update' : 'Add',
      errors,
      valid: errors.length === 0,
    }
  })
}
