import test from 'node:test'
import assert from 'node:assert/strict'
import { isPaymentConfirmationClaim, paymentClaimReply } from './payment-status.js'

test('customer text cannot confirm a cancelled payment', () => {
  assert.equal(isPaymentConfirmationClaim('Sent'), true)
  assert.equal(isPaymentConfirmationClaim('I have paid'), true)
  assert.equal(isPaymentConfirmationClaim('Show my cart'), false)

  const reply = paymentClaimReply({
    status: 'Failed',
    amount: 2,
    resultDescription: 'Request Cancelled by user.',
  })

  assert.match(reply, /Payment was not received/)
  assert.match(reply, /Request Cancelled by user/)
  assert.doesNotMatch(reply, /Payment confirmed/)
})

test('only a paid provider record produces confirmation', () => {
  const reply = paymentClaimReply({
    status: 'Paid',
    amount: 2,
    mpesaReceiptNumber: 'TEST123',
  })

  assert.match(reply, /Payment confirmed by M-Pesa/)
  assert.match(reply, /TEST123/)
})
