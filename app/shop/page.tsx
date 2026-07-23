import type { Metadata } from 'next'
import Image from 'next/image'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { PageInfo, Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ShopifyErrorBoundary from '@/components/shared/ShopifyErrorBoundary'
import ShopClient from '@/components/shop/ShopClient'

const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: 'Shop All Collections — Pink Fleur',
  description:
    'Search and filter every Pink Fleur collection — shirts, dresses, scarves, and ready-to-wear — in one place.',
}

export const revalidate = 30

const CATEGORIES = ['Shirts', 'Dresses', 'Scarves', 'Ready-to-Wear']

async function getData() {
  const [products, beneficiaries] = await Promise.allSettled([
    shopifyFetch<{ products: { nodes: Scarf[]; pageInfo: PageInfo } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: PAGE_SIZE },
      tags: ['products'],
    }),
    sanityClient.fetch<Beneficiary[]>(beneficiariesQuery),
  ])

  const productList = products.status === 'fulfilled' ? products.value.products.nodes : []
  const pageInfo: PageInfo =
    products.status === 'fulfilled' ? products.value.products.pageInfo : { hasNextPage: false, endCursor: null }

  if (products.status === 'rejected') {
    console.log('[shop] Shopify fetch error:', products.reason)
  }

  return {
    products: productList,
    pageInfo,
    beneficiaries: beneficiaries.status === 'fulfilled' ? beneficiaries.value : [],
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
  const { products, pageInfo, beneficiaries } = await getData()

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
          initialPageInfo={pageInfo}
          beneficiaries={beneficiaries}
          categories={CATEGORIES}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />
      </ShopifyErrorBoundary>
    </main>
  )
}
