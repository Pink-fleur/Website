import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import type { PageInfo, Scarf } from '@/lib/shopify/types'

const PAGE_SIZE = 12

interface ProductsResponse {
  products: { nodes: Scarf[]; pageInfo: PageInfo }
}

export async function GET(req: NextRequest) {
  const after = req.nextUrl.searchParams.get('after') || undefined

  try {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: PAGE_SIZE, after },
      tags: ['products'],
    })

    return NextResponse.json({
      products: data.products.nodes,
      pageInfo: data.products.pageInfo,
    })
  } catch (e) {
    const err = e as Error
    return NextResponse.json({ error: err.message || 'Unable to load products' }, { status: 502 })
  }
}
