import test from 'node:test'
import assert from 'node:assert/strict'
import { validateCatalogRows } from './catalog-import.js'

test('validates catalog rows and identifies adds and updates', () => {
  const rows = validateCatalogRows(
    [
      { rowNumber: 2, id: 'organic-honey-500ml', name: 'Organic Honey 500ml', category: 'Grocery', price: '250', stock: '12', available: 'Yes', emoji: '🍯' },
      { rowNumber: 3, id: '', name: 'New Tea', category: 'Drinks', price: 100, stock: 5, available: true },
    ],
    [{ id: 'organic-honey-500ml' }],
  )

  assert.equal(rows[0].action, 'Update')
  assert.equal(rows[0].valid, true)
  assert.equal(rows[1].id, 'new-tea')
  assert.equal(rows[1].action, 'Add')
})

test('rejects unsafe or incomplete catalog rows', () => {
  const [row] = validateCatalogRows([
    { rowNumber: 2, id: 'Bad ID', name: '', category: '', price: '-1', stock: '1.5', available: 'maybe' },
  ])

  assert.equal(row.valid, false)
  assert.deepEqual(row.errors, [
    'Name is required',
    'ID must use lowercase letters, numbers, and hyphens',
    'Category is required',
    'Price must be 0 or more',
    'Stock must be a whole number 0 or more',
    'Available must be Yes or No',
  ])
})
