import type { Metadata } from 'next'
import Link from 'next/link'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { Beneficiary } from '@/lib/sanity/types'
import type { Scarf } from '@/lib/shopify/types'
import BeneficiaryGrid from '@/components/1ms/BeneficiaryGrid'

export const metadata: Metadata = {
  title: 'Meet the Women — 1MS by Pink Fleur Foundation',
  description: 'Every scarf purchase supports a named woman. Meet the women your purchase supports — real stories of resilience, hope, and transformation.',
}

export const revalidate = 300

async function getBeneficiaries(): Promise<Beneficiary[]> {
  try {
    return await sanityClient.fetch<Beneficiary[]>(beneficiariesQuery)
  } catch {
    return []
  }
}

async function getScarves(): Promise<Scarf[]> {
  try {
    const result = await shopifyFetch<{ products: { nodes: Scarf[] } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 50, query: 'tag:1ms' },
      tags: ['scarves'],
    })
    return result.products.nodes
  } catch {
    return []
  }
}

export default async function ImpactPage() {
  const [beneficiaries, scarves] = await Promise.all([getBeneficiaries(), getScarves()])

  return (
    <main className="pt-16">
      <section className="py-16 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/1ms"
            className="font-body text-xs tracking-widest uppercase text-[#E79489] hover:underline mb-8 inline-block"
          >
            Back to 1MS
          </Link>
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4 font-body font-medium">
            Meet the Women
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-black mb-4 leading-tight">
            Your purchase supports
          </h1>
          <p className="font-body text-base text-black/60 max-w-lg leading-relaxed">
            Each woman below has given written consent to share her story. Your purchase directly funds her journey.
          </p>
        </div>
      </section>

      <BeneficiaryGrid beneficiaries={beneficiaries} scarves={scarves} />
    </main>
  )
}
