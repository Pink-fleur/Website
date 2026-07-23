import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ScarfDetailClient from '@/components/1ms/ScarfDetailClient'

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  return {
    title: `${handle.replace(/-/g, ' ')} — 1MS by Pink Fleur`,
    description: 'Every scarf carries a story. 100% of the funding it generates goes directly to the women behind it.',
  }
}

export const revalidate = 30

async function getData(handle: string) {
  const [scarfResult, beneficiariesResult] = await Promise.allSettled([
    shopifyFetch<{ product: Scarf | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      tags: [`scarf-${handle}`],
    }),
    sanityClient.fetch<Beneficiary[]>(beneficiariesQuery),
  ])

  const scarf = scarfResult.status === 'fulfilled' ? scarfResult.value.product : null

  
  return {
    scarf,
    beneficiaries: beneficiariesResult.status === 'fulfilled' ? beneficiariesResult.value : [],
  }
}

export default async function ScarfDetailPage({ params }: Props) {
  const { handle } = await params
  const { scarf, beneficiaries } = await getData(handle)

  if (!scarf) notFound()

  const linkedBeneficiaries = beneficiaries.filter((b) => b.linkedScarfShopifyId === scarf.id)

  return (
    <main className="pt-16">
      <ScarfDetailClient scarf={scarf} linkedBeneficiaries={linkedBeneficiaries} />
    </main>
  )
}
