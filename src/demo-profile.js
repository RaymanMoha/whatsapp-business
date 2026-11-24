export const demoProfile = process.env.DEMO_PROFILE === 'nia-beauty' ? {
  businessName: 'Nia Beauty Nairobi · Demo',
  botName: 'Nia',
  handoffMessage: 'This is the Nia Beauty demonstration store. No live support agent is connected. Ask me about the demo products, delivery, or returns, or type menu to keep exploring.',
} : null

export const demoKnowledge = [
  { topic: 'Demo store', content: 'Nia Beauty Nairobi is a fictional demo store. Product images are sample assets from DummyJSON. Prices in KES, stock quantities, hours, and policies are illustrative. Beauty purchases are previews. The separate M-Pesa Test item is for an optional real KES 2 payment test; it has no physical delivery.' },
  { topic: 'Opening hours', content: 'For this demo, our store hours are Monday to Saturday, 9 AM to 7 PM, East Africa Time. Closed on Sundays.' },
  { topic: 'Delivery', content: 'Demo delivery policy: Nairobi CBD pickup is free. Nairobi-area delivery is quoted at KES 250, outside the product subtotal, after the delivery area is confirmed. Allow 1 to 2 business days. No actual delivery is booked in this demo.' },
  { topic: 'Returns', content: 'Demo returns policy: report an incorrect or damaged item within 48 hours. Unopened items can be reviewed for a return within 7 days. Opened cosmetics cannot be returned for hygiene reasons. This is an illustrative demo policy.' },
  { topic: 'Choosing products', content: 'Help customers compare the products and their listed prices. Ask whether they are shopping for makeup, body care, or a fragrance gift. Do not invent ingredients, bottle sizes, skin suitability, medical benefits, discounts, or brand-authorisation claims.' },
  { topic: 'Payments', content: 'Beauty checkout is a preview and never charges money. Only a cart containing exactly one M-Pesa Test item, total KES 2, can request a payment prompt when the provider is configured. Approving a production prompt charges KES 2; no physical product is delivered. Never ask customers to share a PIN or OTP in chat. A payment is paid only after provider confirmation.' },
  { topic: 'Support', content: 'No live team member is connected for the demonstration. Do not say you have notified a human or booked a delivery.' },
]
