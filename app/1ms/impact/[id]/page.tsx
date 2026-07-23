import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import BackButton from '@/components/1ms/BackButton'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import { sanityClient, urlFor } from '@/lib/sanity/client'
import { beneficiaryByIdQuery } from '@/lib/sanity/queries'
import type { Beneficiary } from '@/lib/sanity/types'
import type { Scarf } from '@/lib/shopify/types'
import {
  getBeneficiaryStatusLabel,
  getFundingProgressPercent,
  isBeneficiaryFullyFunded,
} from '@/lib/beneficiary-funding'

interface Props {
  params: Promise<{ id: string }>
}

async function getBeneficiary(id: string): Promise<Beneficiary | null> {
  try {
    return await sanityClient.fetch<Beneficiary | null>(beneficiaryByIdQuery, { id })
  } catch {
    return null
  }
}

async function getLinkedScarfHandle(linkedScarfShopifyId: string): Promise<string | undefined> {
  try {
    const result = await shopifyFetch<{ products: { nodes: Scarf[] } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 50, query: 'tag:1ms' },
      tags: ['scarves'],
    })
    return result.products.nodes.find((s) => s.id === linkedScarfShopifyId)?.handle
  } catch {
    return undefined
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const beneficiary = await getBeneficiary(id)

  if (!beneficiary) {
    return {
      title: 'Story not found — 1MS by Pink Fleur Foundation',
    }
  }

  return {
    title: `${beneficiary.displayName}'s Story — 1MS by Pink Fleur Foundation`,
    description: beneficiary.shortStory,
  }
}

export const revalidate = 300

export default async function BeneficiaryStoryPage({ params }: Props) {
  const { id } = await params
  const beneficiary = await getBeneficiary(id)

  if (!beneficiary) notFound()

  const scarfHandle = await getLinkedScarfHandle(beneficiary.linkedScarfShopifyId)

  const photoUrl = beneficiary.photo?.asset?._ref
    ? urlFor(beneficiary.photo).width(900).height(1200).fit('crop').url()
    : null
  const isFunded = isBeneficiaryFullyFunded(beneficiary)
  const progress = getFundingProgressPercent(beneficiary)
  const statusLabel = getBeneficiaryStatusLabel(beneficiary)

  return (
    <main className="pt-16 bg-white">
      <section className="bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[680px] bg-[#E79489]/20">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={`${beneficiary.displayName} — Pink Fleur Foundation beneficiary`}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-body text-xs tracking-[0.3em] uppercase text-black/50">
                  Photo pending
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          <div className="px-6 py-16 lg:px-14 lg:py-24 flex flex-col justify-center">
            <BackButton />
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
              {statusLabel}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-black leading-none mb-5">
              {beneficiary.displayName}
            </h1>
            <p className="font-body text-xs tracking-widest uppercase text-black/50 mb-8">
              {beneficiary.location}, {beneficiary.country}
            </p>
            <p className="font-body text-base text-black/70 leading-relaxed max-w-xl mb-10">
              {beneficiary.shortStory}
            </p>

            <div className="border border-[#E79489]/30 p-5 max-w-xl">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="font-body text-xs tracking-widest uppercase text-black/50">
                  Funding progress
                </p>
                <p className="font-body text-xs text-black/60">{progress}%</p>
              </div>
              <div className="h-2 bg-[#F8E8E5] overflow-hidden">
                <div className="h-full bg-[#E79489]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-14 items-start">
          <article className="max-w-3xl">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6">
              Her story
            </p>
            {beneficiary.story?.length ? (
              <div className="font-body text-base text-black/72 leading-relaxed space-y-5">
                <PortableText value={beneficiary.story} />
              </div>
            ) : (
              <p className="font-body text-base text-black/72 leading-relaxed">
                {beneficiary.shortStory}
              </p>
            )}
          </article>

          <aside className="lg:sticky lg:top-24 bg-[#F8E8E5] p-6">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
              Support {beneficiary.displayName}
            </p>
            <p className="font-body text-sm text-black/65 leading-relaxed mb-6">
              Every purchase of her linked scarf goes directly to {beneficiary.displayName} — automatically, with no selection needed.
            </p>
            {!isFunded ? (
              <Link
                href={
                  scarfHandle
                    ? `/1ms/scarves/${scarfHandle}`
                    : { pathname: '/1ms', query: { beneficiary: beneficiary._id } }
                }
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors"
              >
                Shop to support
              </Link>
            ) : (
              <p className="font-body text-xs text-black/55 italic">
                Fully funded — thank you to everyone who supported her journey.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}
