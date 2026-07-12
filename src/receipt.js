import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const BRAND = rgb(0.035, 0.42, 0.29)
const INK = rgb(0.05, 0.065, 0.06)
const MUTED = rgb(0.38, 0.41, 0.39)
const PAPER = rgb(0.965, 0.955, 0.925)

function safeText(value, fallback = '-') {
  const text = String(value ?? '').trim()
  return (text || fallback).replace(/[^\x20-\x7E\xA0-\xFF]/g, '?')
}

function fitText(value, font, size, maxWidth) {
  const original = safeText(value)
  let text = original
  while (text.length > 1 && font.widthOfTextAtSize(`${text}...`, size) > maxWidth) {
    text = text.slice(0, -1)
  }
  return text === original ? text : `${text}...`
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-KE', { maximumFractionDigits: 2 }).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
  const compact = String(value)
  const parsed = /^\d{14}$/.test(compact)
    ? new Date(`${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}T${compact.slice(8, 10)}:${compact.slice(10, 12)}:${compact.slice(12, 14)}+03:00`)
    : new Date(compact)
  return Number.isNaN(parsed.getTime())
    ? compact
    : parsed.toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' })
}

export function getReceiptId(payment) {
  const reference = payment.mpesaReceiptNumber || payment.id || payment.checkoutRequestId || Date.now()
  return `receipt-${String(reference).replace(/[^a-zA-Z0-9_-]/g, '')}`
}

export async function createReceiptPdf(payment) {
  const document = await PDFDocument.create()
  const page = document.addPage([420, 595])
  const regular = await document.embedFont(StandardFonts.Helvetica)
  const bold = await document.embedFont(StandardFonts.HelveticaBold)
  const businessName = safeText(process.env.BUSINESS_NAME, 'WhatsAppBase')
  const receiptNumber = safeText(payment.mpesaReceiptNumber, payment.id)
  const productName = safeText(payment.productName, payment.accountReference || 'WhatsApp order')
  const customer = safeText(payment.customerName, payment.phone)
  const phone = safeText(payment.phone)
  const paidAt = formatDate(payment.paidAt || payment.updatedAt || payment.createdAt)

  page.drawRectangle({ x: 0, y: 0, width: 420, height: 595, color: PAPER })
  page.drawRectangle({ x: 0, y: 495, width: 420, height: 100, color: INK })
  page.drawRectangle({ x: 28, y: 527, width: 34, height: 34, color: BRAND })
  page.drawText('W', { x: 38, y: 537, size: 14, font: bold, color: rgb(1, 1, 1) })
  page.drawText(businessName, { x: 76, y: 544, size: 17, font: bold, color: rgb(1, 1, 1) })
  page.drawText('OFFICIAL PAYMENT RECEIPT', { x: 76, y: 524, size: 8, font: bold, color: rgb(0.45, 0.9, 0.69) })

  page.drawText('PAID', { x: 28, y: 453, size: 10, font: bold, color: BRAND })
  page.drawText(`KES ${formatMoney(payment.amount)}`, { x: 28, y: 414, size: 30, font: bold, color: INK })
  page.drawText('Payment received successfully', { x: 28, y: 393, size: 10, font: regular, color: MUTED })

  const rows = [
    ['Receipt number', receiptNumber],
    ['Paid for', productName],
    ['Customer', customer],
    ['Phone', phone],
    ['Paid at', paidAt],
    ['Payment method', 'M-Pesa'],
  ]

  let y = 345
  for (const [label, value] of rows) {
    page.drawLine({ start: { x: 28, y: y + 24 }, end: { x: 392, y: y + 24 }, thickness: 0.6, color: rgb(0.82, 0.82, 0.78) })
    page.drawText(label.toUpperCase(), { x: 28, y, size: 7.5, font: bold, color: MUTED })
    const clipped = fitText(value, regular, 10, 225)
    const textWidth = regular.widthOfTextAtSize(clipped, 10)
    page.drawText(clipped, { x: Math.max(160, 392 - textWidth), y: y - 1, size: 10, font: regular, color: INK })
    y -= 44
  }

  page.drawRectangle({ x: 28, y: 30, width: 364, height: 48, color: rgb(0.9, 0.94, 0.9) })
  page.drawText('Thank you. Keep this receipt for your records.', { x: 48, y: 56, size: 9, font: bold, color: BRAND })
  page.drawText('Generated automatically after confirmed M-Pesa payment.', { x: 48, y: 42, size: 7.5, font: regular, color: MUTED })

  const bytes = await document.save()
  return {
    id: getReceiptId(payment),
    filename: `${getReceiptId(payment)}.pdf`,
    mimetype: 'application/pdf',
    data: Buffer.from(bytes).toString('base64'),
  }
}
