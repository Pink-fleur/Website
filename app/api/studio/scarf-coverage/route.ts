import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import type { PageInfo, Scarf } from '@/lib/shopify/types'

const MAX_PAGES = 10

interface ProductsResponse {
  products: { nodes: Scarf[]; pageInfo: PageInfo }
}

export async function GET() {
  try {
    const scarves: Scarf[] = []
    let after: string | undefined
    let hasNextPage = true
    let pages = 0

    while (hasNextPage && pages < MAX_PAGES) {
      const data = await shopifyFetch<ProductsResponse>({
        query: GET_PRODUCTS_QUERY,
        variables: { first: 50, after, query: 'tag:1ms' },
        cache: 'no-store',
      })
      scarves.push(...data.products.nodes)
      hasNextPage = data.products.pageInfo.hasNextPage
      after = data.products.pageInfo.endCursor ?? undefined
      pages += 1
    }

    return NextResponse.json({
      scarves: scarves.map((s) => ({
        id: s.id,
        handle: s.handle,
        title: s.title,
        image: s.images.nodes[0]?.url,
      })),
    })
  } catch (e) {
    const err = e as Error
    return NextResponse.json({ error: err.message || 'Unable to load scarves from Shopify' }, { status: 502 })
  }
}
