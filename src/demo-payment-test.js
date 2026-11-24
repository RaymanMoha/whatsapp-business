export const demoPaymentTestProduct = {
  id: 'nia-mpesa-test',
  name: 'M-Pesa Test',
  subtitle: 'Payment test only. One unit costs KES 2. No physical product or delivery.',
  category: 'Payment test',
  price: 2,
  stock: 100,
  available: true,
  demo: true,
  emoji: '📱',
}

export function isDemoPaymentTest(items, pricing) {
  return items.length === 1 && items[0].productId === demoPaymentTestProduct.id &&
    Number(items[0].quantity) === 1 && Number(items[0].unitPrice) === 2 &&
    pricing.subtotal === 2 && pricing.total === 2 && pricing.discount === 0
}
