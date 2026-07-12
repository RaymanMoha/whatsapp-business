import { getMpesaConfig, savePayment } from './mpesa-store.js'

function timestamp() {
  const date = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.startsWith('254') && digits.length === 12) return digits
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.length === 9) return `254${digits}`
  return digits
}

export async function getMpesaAccessToken() {
  const config = await getMpesaConfig()
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')
  const response = await fetch(`${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`M-Pesa token request failed: ${response.status} ${body}`)
  }

  const data = await response.json()
  if (!data.access_token) throw new Error('M-Pesa token response did not include access_token')
  return data.access_token
}

export async function initiateStkPush(input) {
  const config = await getMpesaConfig()
  const phone = normalizePhone(input.phone)
  const amount = Math.round(Number(input.amount))

  if (!phone || phone.length < 12) throw new Error('Valid customer phone is required')
  if (!amount || amount < 1) throw new Error('Amount must be at least 1')
  if (!config.callbackUrl) throw new Error('MPESA_CALLBACK_URL is required')

  const accessToken = await getMpesaAccessToken()
  const stamp = timestamp()
  const password = Buffer.from(`${config.businessShortCode}${config.passKey}${stamp}`).toString('base64')
  const accountReference = String(input.accountReference || 'WhatsAppOrder').slice(0, 12)
  const transactionDesc = String(input.description || 'WhatsApp order payment').slice(0, 100)
  const payload = {
    BusinessShortCode: config.businessShortCode,
    Password: password,
    Timestamp: stamp,
    TransactionType: config.transactionType,
    Amount: amount,
    PartyA: config.partyA || phone,
    PartyB: config.businessShortCode,
    PhoneNumber: phone,
    CallBackURL: config.callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  }

  const response = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(async () => ({ raw: await response.text() }))

  const payment = await savePayment({
    phone,
    amount,
    accountReference,
    description: transactionDesc,
    chatId: input.chatId || null,
    customerName: input.customerName || null,
    productId: input.productId || null,
    productName: input.productName || null,
    lineItems: Array.isArray(input.lineItems) ? input.lineItems : [],
    itemCount: Number(input.itemCount || 0),
    source: input.source || 'dashboard',
    merchantRequestId: data.MerchantRequestID || null,
    checkoutRequestId: data.CheckoutRequestID || null,
    responseCode: data.ResponseCode || null,
    responseDescription: data.ResponseDescription || data.errorMessage || null,
    customerMessage: data.CustomerMessage || null,
    status: response.ok && data.ResponseCode === '0' ? 'STK sent' : 'Request failed',
    provider: 'mpesa',
    providerResponse: data,
  })

  if (!response.ok || data.ResponseCode !== '0') {
    throw new Error(data.errorMessage || data.ResponseDescription || `M-Pesa STK push failed: ${response.status}`)
  }

  return payment
}
