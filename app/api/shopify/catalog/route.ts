import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CATALOG_TOPICS, verifyShopifyHmac } from '@/lib/shopify/webhook'
import { SHOPIFY_CACHE_TAG } from '@/lib/shopify/client'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifyShopifyHmac(rawBody, req.headers.get('x-shopify-hmac-sha256'))) {
    return NextResponse.json({ error: 'Invalid Shopify webhook signature' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic') ?? ''
  if (!CATALOG_TOPICS.has(topic)) {
    return NextResponse.json({ skipped: true, reason: 'Unsupported topic' })
  }

  // Every Shopify fetch carries this tag, so this refreshes /shop filters,
  // /1ms, impact pages and product pages. `expire: 0` makes the next visitor
  // get fresh data, so a deleted collection disappears immediately.
  revalidateTag(SHOPIFY_CACHE_TAG, { expire: 0 })

  return NextResponse.json({ revalidated: true, topic })
}
