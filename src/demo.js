const DEMO_REQUEST_PATTERN = /\b(?:merchant\s+demo|appbase\s+demo|show\s+(?:me\s+)?(?:a|the)?\s*demo|see\s+(?:a|the)?\s*demo|try\s+(?:a|the)?\s*demo|demo\s+appbase)\b/i
const DEMO_BOOKING_PATTERN = /\b(?:book|schedule|arrange|reserve)\b.{0,24}\b(?:demo|walkthrough|call)\b|\b(?:demo|walkthrough)\b.{0,24}\b(?:book|schedule|arrange|reserve)\b/i

export function buildDemoReply(text) {
  const message = String(text || '').trim()

  if (DEMO_BOOKING_PATTERN.test(message)) {
    return [
      'Let\'s arrange your AppBase walkthrough.',
      'Reply in one message with:',
      '1. Your name and business name',
      '2. What you sell',
      '3. Your preferred day and time',
      'A team member will continue with you in this WhatsApp chat.',
    ].join('\n')
  }

  if (!DEMO_REQUEST_PATTERN.test(message)) return null

  return [
    'Welcome to the AppBase merchant demo 👋',
    'You are now testing the customer side of a WhatsApp storefront.',
    '',
    'Try this two-minute shopping flow:',
    '1. Reply: Show products',
    '2. Choose an item, then reply: Add 2 [product name] to my cart',
    '3. Reply: Show my cart',
    '4. Reply: Pay cart',
    '',
    'Behind the scenes, AppBase records the conversation, cart, payment status and order for the merchant.',
    'For a guided look at the merchant dashboard, reply: Book a demo',
  ].join('\n')
}
