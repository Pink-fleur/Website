import crypto from 'crypto'

// Verifies the X-Shopify-Hmac-Sha256 header Shopify sends with every webhook.
// The secret is shown in Shopify Admin → Settings → Notifications → Webhooks.
export function verifyShopifyHmac(rawBody: string, hmacHeader: string | null) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret || !hmacHeader) return false

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  const digestBuffer = Buffer.from(digest, 'base64')
  const headerBuffer = Buffer.from(hmacHeader, 'base64')

  if (digestBuffer.length !== headerBuffer.length) return false

  return crypto.timingSafeEqual(digestBuffer, headerBuffer)
}

// Shopify webhook topics that change what the site shows. Point each of these
// webhooks at https://<site>/api/shopify/catalog in Shopify Admin.
export const CATALOG_TOPICS = new Set([
  'collections/create',
  'collections/update',
  'collections/delete',
  'product_listings/add',
  'product_listings/update',
  'product_listings/remove',
  'products/create',
  'products/update',
  'products/delete',
])
