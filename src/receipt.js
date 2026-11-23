import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const RECEIPT_TEMPLATE_VERSION = 2

const DEEP = rgb(0.024, 0.071, 0.051)
const DEEP_GREEN = rgb(0.024, 0.141, 0.102)
const LIME = rgb(0.616, 1, 0.184)
const GREEN = rgb(0.086, 0.51, 0.263)
const INK = rgb(0.027, 0.071, 0.051)
const MUTED = rgb(0.38, 0.4, 0.37)
const PAPER = rgb(0.965, 0.957, 0.929)
const MINT = rgb(0.875, 0.969, 0.898)
const BORDER = rgb(0.82, 0.82, 0.77)
const WHITE = rgb(1, 1, 1)

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

function drawRightText(page, text, { right = 392, ...options }) {
  const width = options.font.widthOfTextAtSize(text, options.size)
  page.drawText(text, { ...options, x: right - width })
}

function drawDetail(page, { label, value, x, y, width, regular, bold }) {
  page.drawText(label.toUpperCase(), { x, y, size: 7.2, font: bold, color: GREEN })
  page.drawText(fitText(value, regular, 9.5, width), { x, y: y - 15, size: 9.5, font: regular, color: INK })
}

async function loadBrandAssets(document, fallbackFont) {
  let display = fallbackFont
  let logo = null

  try {
    document.registerFontkit(fontkit)
    const [fontBytes, logoBytes] = await Promise.all([
      readFile(path.join(process.cwd(), 'app/fonts/BigCaslonFB.woff')),
      readFile(path.join(process.cwd(), 'public/appbase-logo-color.png')),
    ])
    display = await document.embedFont(fontBytes, { subset: true })
    logo = await document.embedPng(logoBytes)
  } catch (error) {
    console.warn('Receipt brand assets could not be embedded; using safe fallbacks.', error)
  }

  return { display, logo }
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
  const { display, logo } = await loadBrandAssets(document, bold)

  const businessName = safeText(process.env.BUSINESS_NAME, 'AppBase Store')
  const receiptNumber = safeText(payment.mpesaReceiptNumber, payment.id)
  const productName = safeText(payment.productName, payment.accountReference || 'Customer order')
  const lineItems = Array.isArray(payment.lineItems) && payment.lineItems.length
    ? payment.lineItems.slice(0, 3)
    : [{ name: productName, quantity: 1, unitPrice: Number(payment.amount || 0), lineTotal: Number(payment.amount || 0) }]
  const customer = safeText(payment.customerName, payment.phone)
  const phone = safeText(payment.phone)
  const paidAt = formatDate(payment.paidAt || payment.updatedAt || payment.createdAt)
  const discount = Number(payment.discount || 0)
  const promotionName = safeText(payment.promotion?.name, 'promotion')

  page.drawRectangle({ x: 0, y: 0, width: 420, height: 595, color: PAPER })
  page.drawRectangle({ x: 0, y: 382, width: 420, height: 213, color: DEEP })
  page.drawRectangle({ x: 320, y: 382, width: 100, height: 213, color: DEEP_GREEN, opacity: 0.42 })
  page.drawRectangle({ x: 0, y: 379, width: 420, height: 3, color: LIME })

  if (logo) {
    page.drawImage(logo, { x: 27, y: 524, width: 82, height: 45 })
  } else {
    page.drawText('APPBASE', { x: 28, y: 540, size: 15, font: bold, color: LIME })
  }
  drawRightText(page, 'PAYMENT RECEIPT', { y: 552, size: 8, font: bold, color: WHITE, opacity: 0.72 })
  drawRightText(page, fitText(businessName, regular, 8, 170), { y: 536, size: 8, font: regular, color: WHITE, opacity: 0.5 })

  page.drawRectangle({ x: 28, y: 475, width: 49, height: 22, color: LIME })
  page.drawText('PAID', { x: 40, y: 482, size: 8, font: bold, color: DEEP })
  page.drawText('TOTAL RECEIVED', { x: 28, y: 454, size: 7.5, font: bold, color: WHITE, opacity: 0.5 })
  page.drawText(`KES ${formatMoney(payment.amount)}`, { x: 28, y: 412, size: 34, font: display, color: WHITE })
  page.drawText(
    discount > 0 ? `You saved KES ${formatMoney(discount)} with ${promotionName}.` : 'Payment confirmed and matched to this order.',
    { x: 28, y: 393, size: 9, font: regular, color: discount > 0 ? LIME : WHITE, opacity: discount > 0 ? 1 : 0.58 },
  )
  drawRightText(page, `REF ${fitText(receiptNumber, bold, 8, 130)}`, { y: 404, size: 8, font: bold, color: LIME })
  drawRightText(page, paidAt, { y: 391, size: 7.5, font: regular, color: WHITE, opacity: 0.48 })

  page.drawText('ORDER SUMMARY', { x: 28, y: 351, size: 8, font: bold, color: GREEN })
  page.drawText('ITEM', { x: 28, y: 331, size: 7, font: bold, color: MUTED })
  page.drawText('QTY x PRICE', { x: 216, y: 331, size: 7, font: bold, color: MUTED })
  drawRightText(page, 'TOTAL', { y: 331, size: 7, font: bold, color: MUTED })
  page.drawLine({ start: { x: 28, y: 322 }, end: { x: 392, y: 322 }, thickness: 0.7, color: BORDER })

  let y = 301
  for (const item of lineItems) {
    const name = fitText(item.name, bold, 9.5, 175)
    const detail = `${Number(item.quantity || 1)} x KES ${formatMoney(item.unitPrice)}`
    const total = `KES ${formatMoney(item.lineTotal)}`
    page.drawText(name, { x: 28, y, size: 9.5, font: bold, color: INK })
    page.drawText(fitText(detail, regular, 8.5, 90), { x: 216, y, size: 8.5, font: regular, color: MUTED })
    drawRightText(page, total, { y, size: 8.5, font: bold, color: INK })
    page.drawLine({ start: { x: 28, y: y - 12 }, end: { x: 392, y: y - 12 }, thickness: 0.45, color: BORDER, opacity: 0.7 })
    y -= 31
  }
  if (Array.isArray(payment.lineItems) && payment.lineItems.length > lineItems.length) {
    page.drawText(`+ ${payment.lineItems.length - lineItems.length} more items`, { x: 28, y, size: 8.5, font: bold, color: GREEN })
    y -= 18
  }

  const detailsTop = Math.min(y - 6, 192)
  page.drawText('PAYMENT DETAILS', { x: 28, y: detailsTop, size: 8, font: bold, color: GREEN })
  page.drawRectangle({ x: 28, y: detailsTop - 104, width: 364, height: 90, color: WHITE, opacity: 0.48, borderColor: BORDER, borderWidth: 0.7 })
  page.drawLine({ start: { x: 210, y: detailsTop - 104 }, end: { x: 210, y: detailsTop - 14 }, thickness: 0.6, color: BORDER })
  page.drawLine({ start: { x: 28, y: detailsTop - 59 }, end: { x: 392, y: detailsTop - 59 }, thickness: 0.6, color: BORDER })
  drawDetail(page, { label: 'Receipt number', value: receiptNumber, x: 42, y: detailsTop - 33, width: 145, regular, bold })
  drawDetail(page, { label: 'Customer', value: customer, x: 224, y: detailsTop - 33, width: 145, regular, bold })
  drawDetail(page, { label: 'Phone', value: phone, x: 42, y: detailsTop - 78, width: 145, regular, bold })
  drawDetail(page, { label: 'Method', value: 'M-Pesa - confirmed', x: 224, y: detailsTop - 78, width: 145, regular, bold })

  page.drawRectangle({ x: 0, y: 0, width: 420, height: 58, color: DEEP_GREEN })
  page.drawRectangle({ x: 0, y: 55, width: 420, height: 3, color: LIME })
  page.drawText('Thank you for your order.', { x: 28, y: 30, size: 15, font: display, color: WHITE })
  drawRightText(page, 'Verified payment - AppBase', { y: 32, size: 7.5, font: bold, color: LIME })
  drawRightText(page, 'Keep this receipt for your records.', { y: 19, size: 7, font: regular, color: WHITE, opacity: 0.5 })

  const bytes = await document.save()
  return {
    id: getReceiptId(payment),
    filename: `${getReceiptId(payment)}.pdf`,
    mimetype: 'application/pdf',
    templateVersion: RECEIPT_TEMPLATE_VERSION,
    data: Buffer.from(bytes).toString('base64'),
  }
}
