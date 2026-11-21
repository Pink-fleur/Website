import type { Metadata } from 'next'
import Image from 'next/image'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTIONS_QUERY, GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { CollectionSummary, PageInfo, Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ShopifyErrorBoundary from '@/components/shared/ShopifyErrorBoundary'
import ShopClient from '@/components/shop/ShopClient'
import { buildCategories } from '@/lib/shopify/categories'

// Shopify allows up to 250 per request; the catalog is small enough to load in full
// so category filters always see every product.
const PAGE_SIZE = 250
const MAX_PAGES = 10

export const metadata: Metadata = {
  title: 'Shop All Collections — Pink Fleur',
  description:
    'Search and filter every Pink Fleur collection — shirts, dresses, scarves, and ready-to-wear — in one place.',
}

export const revalidate = 30

async function fetchAllProducts() {
  const all: Scarf[] = []
  let after: string | null = null
  for (let page = 0; page < MAX_PAGES; page++) {
    const data: { products: { nodes: Scarf[]; pageInfo: PageInfo } } = await shopifyFetch({
      query: GET_PRODUCTS_QUERY,
      variables: { first: PAGE_SIZE, after },
      tags: ['products'],
    })
    all.push(...data.products.nodes)
    if (!data.products.pageInfo.hasNextPage) break
    after = data.products.pageInfo.endCursor
  }
  return all
}

async function getData() {
  const [products, beneficiaries, collections] = await Promise.allSettled([
    fetchAllProducts(),
    sanityClient.fetch<Beneficiary[]>(beneficiariesQuery),
    shopifyFetch<{ collections: { nodes: CollectionSummary[] } }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first: 100 },
      tags: ['collections'],
    }),
  ])

  if (products.status === 'rejected') {
    console.log('[shop] Shopify fetch error:', products.reason)
  }
  if (collections.status === 'rejected') {
    console.log('[shop] Shopify collections fetch error:', collections.reason)
  }

  const productList = products.status === 'fulfilled' ? products.value : []
  const collectionList = collections.status === 'fulfilled' ? collections.value.collections.nodes : []

  return {
    products: productList,
    beneficiaries: beneficiaries.status === 'fulfilled' ? beneficiaries.value : [],
    categories: buildCategories(productList, collectionList),
  }
}

interface Props {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const initialCategory = first(params.category)
  const initialQuery = first(params.q)
  const { products, beneficiaries, categories } = await getData()

  return (
    <main className="pt-16">
      <section className="relative py-28 overflow-hidden bg-black">
        <Image
          src="/images/collections/DSC_2140.jpeg"
          alt="Shop Pink Fleur collections"
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4 font-body font-medium">
            Shop
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">All Collections</h1>
          <p className="font-body text-base text-white/75 max-w-md leading-relaxed">
            Search and filter across shirts, dresses, scarves, and ready-to-wear — all in one place.
          </p>
        </div>
      </section>

      <ShopifyErrorBoundary>
        <ShopClient
          products={products}
          beneficiaries={beneficiaries}
          categories={categories}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />
      </ShopifyErrorBoundary>
    </main>
  )
}
