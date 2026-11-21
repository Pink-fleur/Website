import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ScarfDetailClient from '@/components/1ms/ScarfDetailClient'
import { isOneMillionScarfProduct } from '@/lib/shopify/categories'

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle).catch(() => null)
  if (!product) return { title: 'Pink Fleur' }

  if (isOneMillionScarfProduct(product)) {
    return {
      title: `${product.title} — 1MS by Pink Fleur`,
      description: 'Every scarf carries a story. 100% of the funding it generates goes directly to the women behind it.',
    }
  }
  return {
    title: `${product.title} — Pink Fleur`,
    description: product.description || 'Elegantly styled modest womenswear by Pink Fleur.',
  }
}

// Shared by the page and its metadata; Next dedupes the identical fetch.
async function getProduct(handle: string) {
  const data = await shopifyFetch<{ product: Scarf | null }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: [`scarf-${handle}`],
  })
  return data.product
}

export const revalidate = 30

async function getData(handle: string) {
  const [scarfResult, beneficiariesResult] = await Promise.allSettled([
    getProduct(handle),
    sanityClient.fetch<Beneficiary[]>(beneficiariesQuery),
  ])

  const scarf = scarfResult.status === 'fulfilled' ? scarfResult.value : null

  
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
