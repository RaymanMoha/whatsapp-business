export function isPaymentConfirmationClaim(text) {
  const normalized = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  return [
    'sent',
    'done',
    'paid',
    'completed',
    'payment sent',
    'money sent',
    'i paid',
    'i have paid',
    'payment done',
  ].includes(normalized)
}

export function paymentClaimReply(payment) {
  if (!payment) {
    return 'I cannot confirm a payment yet. Payment is confirmed only after M-Pesa sends a successful result.'
  }

  if (payment.status === 'Paid') {
    const receipt = payment.mpesaReceiptNumber ? ` Receipt: ${payment.mpesaReceiptNumber}.` : ''
    return `Payment confirmed by M-Pesa for KES ${payment.amount}.${receipt}`
  }

  if (payment.status === 'Failed' || payment.status === 'Request failed') {
    const reason = payment.resultDescription || payment.responseDescription || 'The payment was not completed.'
    return `Payment was not received. M-Pesa status: ${reason} Your cart is still available. Reply "pay cart" to try again.`
  }

  return 'Payment has not been confirmed yet. Complete the prompt on your phone and wait for the M-Pesa confirmation. Do not share your PIN or OTP in chat.'
}
