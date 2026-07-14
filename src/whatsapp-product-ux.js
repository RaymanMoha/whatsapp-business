import { findProductsForMessage } from './product-store.js'

const PRODUCT_IMAGE_URL = /https?:\/\/\S+(?:\.(?:avif|gif|jpe?g|png|webp)(?:\?\S*)?|example\.com\/\S*)/i

export function sanitizeWhatsAppReply(value) {
  const lines = String(value || '')
    .split('\n')
    .filter((line) => !PRODUCT_IMAGE_URL.test(line))

  return lines
    .join('\n')
    .replace(/\[([^\]]+)]\(https?:\/\/[^)]+(?:\.(?:avif|gif|jpe?g|png|webp)(?:\?[^)]*)?|example\.com\/[^)]*)\)/gi, '$1')
    .replace(/(?:here (?:are|is)|use|open|view|see) (?:the )?(?:links?|urls?) (?:to|for) (?:the )?(?:product )?(?:pictures?|photos?|images?)[.:]?/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function selectWhatsAppProductImages(products, text) {
  return findProductsForMessage(products, text, 1)
    .filter((product) => product.image?.data && product.image?.mimetype)
}
