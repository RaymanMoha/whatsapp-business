const PROMOTION_TYPES = new Set(['percentage', 'fixed', 'buy_x_get_y'])

function money(value) {
  return Math.max(Number(value || 0), 0)
}

export function isDeliveryOnlyPromotion(promotion) {
  const customerCopy = `${promotion?.name || ''} ${promotion?.description || ''}`.toLowerCase()
  return /\b(free delivery|free shipping|delivery fee|shipping fee)\b/.test(customerCopy)
}

export function isPromotionActive(promotion, at = new Date()) {
  if (!promotion?.active || !PROMOTION_TYPES.has(promotion.type)) return false

  const now = at instanceof Date ? at : new Date(at)
  if (Number.isNaN(now.getTime())) return false

  const startsAt = promotion.startsAt ? new Date(promotion.startsAt) : null
  const endsAt = promotion.endsAt ? new Date(promotion.endsAt) : null
  if (startsAt && !Number.isNaN(startsAt.getTime()) && startsAt > now) return false
  if (endsAt && !Number.isNaN(endsAt.getTime()) && endsAt < now) return false

  const limit = Number(promotion.redemptionLimit || 0)
  const used = Number(promotion.redemptionCount || 0)
  if (limit > 0 && used >= limit) return false
  return true
}

function appliesToItem(promotion, item) {
  if (promotion.scope === 'products') {
    return Array.isArray(promotion.productIds) && promotion.productIds.includes(item.productId)
  }
  if (promotion.scope === 'categories') {
    return Array.isArray(promotion.categories) && promotion.categories.includes(item.category)
  }
  return true
}

function calculateDiscount(promotion, items) {
  const eligibleItems = items.filter((item) => appliesToItem(promotion, item))
  const eligibleSubtotal = eligibleItems.reduce((total, item) => total + money(item.lineTotal), 0)
  if (eligibleSubtotal <= 0) return 0

  if (promotion.type === 'percentage') {
    return Math.round(eligibleSubtotal * (money(promotion.value) / 100))
  }
  if (promotion.type === 'fixed') {
    return Math.min(money(promotion.value), eligibleSubtotal)
  }
  if (promotion.type === 'buy_x_get_y') {
    const buyQuantity = Math.max(Number(promotion.buyQuantity || 1), 1)
    const getQuantity = Math.max(Number(promotion.getQuantity || 1), 1)
    const groupSize = buyQuantity + getQuantity
    return eligibleItems.reduce((discount, item) => {
      const quantity = Math.max(Number(item.quantity || 0), 0)
      const freeQuantity = Math.floor(quantity / groupSize) * getQuantity
      return discount + freeQuantity * money(item.unitPrice)
    }, 0)
  }
  return 0
}

export function calculateCartPricing(items, promotions = [], options = {}) {
  const normalizedItems = Array.isArray(items) ? items : []
  const subtotal = normalizedItems.reduce((total, item) => total + money(item.lineTotal), 0)
  const at = options.at || new Date()

  const candidates = (Array.isArray(promotions) ? promotions : [])
    .filter((promotion) => isPromotionActive(promotion, at))
    .filter((promotion) => !isDeliveryOnlyPromotion(promotion))
    .filter((promotion) => subtotal >= money(promotion.minimumSpend))
    .map((promotion) => ({
      promotion,
      discount: Math.min(calculateDiscount(promotion, normalizedItems), subtotal),
    }))
    .filter((candidate) => candidate.discount > 0)
    .sort((left, right) => right.discount - left.discount || String(left.promotion.name).localeCompare(String(right.promotion.name)))

  const best = candidates[0] || null
  const deliveryPromotion = best
    ? null
    : (Array.isArray(promotions) ? promotions : [])
      .filter((promotion) => isPromotionActive(promotion, at))
      .filter((promotion) => subtotal >= money(promotion.minimumSpend))
      .find((promotion) => isDeliveryOnlyPromotion(promotion)) || null
  const discount = best?.discount || 0
  return {
    subtotal,
    discount,
    total: Math.max(subtotal - discount, 0),
    promotion: best
      ? {
          id: best.promotion.id,
          name: best.promotion.name,
          type: best.promotion.type,
        }
      : deliveryPromotion
        ? {
            id: deliveryPromotion.id,
            name: deliveryPromotion.name,
            type: 'free_delivery',
          }
      : null,
  }
}

export function promotionCustomerDescription(promotion) {
  if (isDeliveryOnlyPromotion(promotion) || promotion.type === 'free_delivery') return 'Free delivery'
  if (promotion.type === 'percentage') return `${promotion.value}% off`
  if (promotion.type === 'fixed') return `KES ${promotion.value} off`
  return `Buy ${promotion.buyQuantity || 1}, get ${promotion.getQuantity || 1} free`
}
