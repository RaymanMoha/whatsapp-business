import sharp from 'sharp'

// WhatsApp image messages use ordinary JPEGs, including when the catalog stores WebP.
export async function prepareWhatsAppImage(image, id = 'product') {
  const bytes = Buffer.from(image.data, 'base64')
  const jpeg = await sharp(bytes).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 88 }).toBuffer()
  return { mimetype: 'image/jpeg', data: jpeg.toString('base64'), filename: `${id}.jpg` }
}
