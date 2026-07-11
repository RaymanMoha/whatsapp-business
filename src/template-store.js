import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dataDir = path.join(process.cwd(), 'data')
const templatesFile = path.join(dataDir, 'message-templates.json')

const defaultTemplates = [
  {
    id: 'product-list',
    name: 'Available products',
    category: 'Products',
    body:
      'Hi {{customer_name}}, here is what is available today:\n\n{{product_list}}\n\nReply with the product name and quantity you want.',
    variables: ['customer_name', 'product_list'],
    createdAt: '2026-07-11T00:00:00.000Z',
    updatedAt: '2026-07-11T00:00:00.000Z',
  },
  {
    id: 'delivery-info',
    name: 'Delivery information',
    category: 'Delivery',
    body:
      'We can help with delivery. Please send your location, preferred delivery time, and phone number for confirmation.',
    variables: [],
    createdAt: '2026-07-11T00:00:00.000Z',
    updatedAt: '2026-07-11T00:00:00.000Z',
  },
  {
    id: 'order-confirmation',
    name: 'Order confirmation',
    category: 'Orders',
    body:
      'Thanks {{customer_name}}. Your order is:\n\n{{order_summary}}\n\nTotal: {{order_total}}\n\nPlease confirm if everything is correct.',
    variables: ['customer_name', 'order_summary', 'order_total'],
    createdAt: '2026-07-11T00:00:00.000Z',
    updatedAt: '2026-07-11T00:00:00.000Z',
  },
  {
    id: 'human-handoff',
    name: 'Human handoff',
    category: 'Support',
    body:
      'Thanks for your message. I am passing this to the store team so they can confirm the details and reply properly.',
    variables: [],
    createdAt: '2026-07-11T00:00:00.000Z',
    updatedAt: '2026-07-11T00:00:00.000Z',
  },
]

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(templatesFile, 'utf8')
  } catch {
    await writeFile(templatesFile, JSON.stringify({ templates: defaultTemplates }, null, 2))
  }
}

export async function readMessageTemplates() {
  await ensureStore()
  const raw = await readFile(templatesFile, 'utf8')
  const parsed = JSON.parse(raw)
  const templates = Array.isArray(parsed.templates) ? parsed.templates : []
  return templates
    .map((template) => ({
      ...template,
      body: String(template.body || '').replaceAll('\\n', '\n'),
    }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export async function upsertMessageTemplate(input) {
  await ensureStore()
  const templates = await readMessageTemplates()
  const now = new Date().toISOString()
  const id = input.id || `template-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const body = String(input.body || '').trim()
  const name = String(input.name || '').trim()
  const category = String(input.category || 'General').trim() || 'General'

  if (!name) throw new Error('Template name is required')
  if (!body) throw new Error('Template body is required')

  const variables = Array.from(body.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)).map((match) => match[1])
  const uniqueVariables = [...new Set(variables)]
  const existingIndex = templates.findIndex((template) => template.id === id)
  const previous = existingIndex >= 0 ? templates[existingIndex] : null
  const nextTemplate = {
    id,
    name,
    category,
    body,
    variables: uniqueVariables,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  }

  if (existingIndex >= 0) {
    templates[existingIndex] = nextTemplate
  } else {
    templates.push(nextTemplate)
  }

  await writeFile(templatesFile, JSON.stringify({ templates }, null, 2))
  return nextTemplate
}

export async function deleteMessageTemplate(id) {
  await ensureStore()
  const templates = await readMessageTemplates()
  const nextTemplates = templates.filter((template) => template.id !== id)
  await writeFile(templatesFile, JSON.stringify({ templates: nextTemplates }, null, 2))
}
