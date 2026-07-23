import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/queries'
import { sanityClient, urlFor } from '@/lib/sanity/client'
import { beneficiariesQuery } from '@/lib/sanity/queries'
import type { Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ScarfGrid from '@/components/1ms/ScarfGrid'
import BeneficiaryCard from '@/components/1ms/BeneficiaryCard'
import ShopifyErrorBoundary from '@/components/shared/ShopifyErrorBoundary'

function getBeneficiaryPhotoUrl(beneficiary: Beneficiary): string | undefined {
  if (!beneficiary.photo?.asset?._ref) return undefined
  return urlFor(beneficiary.photo).width(400).height(500).fit('crop').url()
}

const oneMSSteps = [
  'Purchase a Pink Fleur scarf under the 1MS campaign.',
  'Read the story of the woman connected to your purchase.',
  'Know that your purchase is contributing to meaningful impact.',
]

export const metadata: Metadata = {
  title: '1 Million Scarves — Pink Fleur',
  description: "The 1 Million Scarves (1MS) Campaign is Pink Fleur Foundation's long term social empowerment initiative aimed at supporting one million women by 2032.",
}

export const revalidate = 30

async function getData() {
  const [scarves, beneficiaries] = await Promise.allSettled([
    shopifyFetch<{ products: { nodes: Scarf[] } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 20, query: 'tag:1ms' },
      tags: ['scarves'],
    }),
    sanityClient.fetch<Beneficiary[]>(beneficiariesQuery),
  ])

  const scarfList = scarves.status === 'fulfilled' ? scarves.value.products.nodes : []

 
  return {
    scarves: scarfList,
    beneficiaries: beneficiaries.status === 'fulfilled' ? beneficiaries.value : [],
  }
}

interface Props {
  searchParams: Promise<{ beneficiary?: string | string[] }>
}

function getSelectedBeneficiaryId(beneficiary: string | string[] | undefined) {
  return Array.isArray(beneficiary) ? beneficiary[0] : beneficiary
}

const SCARF_PREVIEW_COUNT = 6

function getPreviewScarves(scarves: Scarf[], beneficiaries: Beneficiary[], selectedBeneficiaryId?: string) {
  if (!selectedBeneficiaryId) return scarves.slice(0, SCARF_PREVIEW_COUNT)

  const linkedScarfId = beneficiaries.find((b) => b._id === selectedBeneficiaryId)?.linkedScarfShopifyId
  if (!linkedScarfId) return scarves.slice(0, SCARF_PREVIEW_COUNT)

  const ordered = [...scarves].sort((a, b) => Number(b.id === linkedScarfId) - Number(a.id === linkedScarfId))
  return ordered.slice(0, SCARF_PREVIEW_COUNT)
}

export default async function OneMSPage({ searchParams }: Props) {
  const selectedBeneficiaryId = getSelectedBeneficiaryId((await searchParams).beneficiary)
  const { scarves, beneficiaries } = await getData()
  const previewScarves = getPreviewScarves(scarves, beneficiaries, selectedBeneficiaryId)
  const scarfHandleById = Object.fromEntries(scarves.map((s) => [s.id, s.handle]))

  return (
    <main className="pt-16">
      <section className="relative py-28 overflow-hidden">
        <Image
          src="/images/scarf-mocks/new1.png"
          alt="1MS Scarf Collection — Pink Fleur Foundation"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4 font-body font-medium">
            Collections — 1MS Global Scarf
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">1 Million Scarves</h1>
          <p className="font-body text-base text-white/75 max-w-md leading-relaxed">
            Pink Fleur Foundation&apos;s long term social empowerment initiative aimed at supporting one million women by 2032.
          </p>
        </div>
      </section>

      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              What 1MS Is All About
            </p>
            <div className="space-y-6 font-body text-base text-white/70 leading-relaxed">
              <p>
                The 1 Million Scarves (1MS) Campaign is Pink Fleur Foundation&apos;s long term social empowerment initiative aimed at supporting one million women by 2032.
              </p>
              <p>
                Each scarf in the collection is co-created with women around the world, sharing their story of strength and courage. These scarves are a symbol of hope and resilience — proceeds from every purchase help support another woman&apos;s story.
              </p>
            </div>
            <Link
              href="/impact"
              className="mt-8 inline-flex items-center justify-center bg-[#E79489] px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-black transition-colors hover:bg-white"
            >
              Learn About the Foundation
            </Link>
          </div>
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">How It Works</p>
            <div className="flex flex-col gap-6">
              {oneMSSteps.map((step, index) => (
                <div key={step} className="flex gap-5 items-start">
                  <span className="font-display text-3xl text-white/25 leading-none shrink-0">0{index + 1}</span>
                  <p className="font-body text-sm text-white/75 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-black/10 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-body text-xs text-[#E79489] text-center">
            Every scarf you purchase provides direct financial support to the woman whose story it carries.
          </p>
        </div>
      </div>

      <ShopifyErrorBoundary>
        <ScarfGrid
          scarves={previewScarves}
          beneficiaries={beneficiaries}
          eyebrow="The Collection"
          heading="Shop the Scarves"
          viewAllHref="/shop?category=Scarves"
          viewAllLabel="See all scarves →"
        />
      </ShopifyErrorBoundary>

      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-5 mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-3 font-body font-medium">
                Meet the Women You&apos;re Supporting
              </p>
              <h2 className="font-display text-4xl text-black">
                Stories of courage. Stories of survival. Stories of resilience.
              </h2>
            </div>
            <Link
              href="/1ms/impact"
              className="shrink-0 text-xs tracking-widest uppercase text-black font-body font-medium hover:text-[#E79489] transition-colors hidden md:block"
            >
              View all stories →
            </Link>
          </div>
          {beneficiaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {beneficiaries.slice(0, 3).map((b) => (
                <BeneficiaryCard
                  key={b._id}
                  beneficiary={b}
                  photoUrl={getBeneficiaryPhotoUrl(b)}
                  scarfHandle={scarfHandleById[b.linkedScarfShopifyId]}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white px-6 py-12 text-center">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
                No published stories yet
              </p>
              <p className="font-body text-sm text-black/60 max-w-xl mx-auto leading-relaxed">
                Verified beneficiary stories will appear here once published in Sanity.
              </p>
            </div>
          )}
          <div className="mt-8 md:hidden">
            <Link href="/1ms/impact" className="text-xs tracking-widest uppercase text-black font-body font-medium">
              View all stories →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4 font-body font-medium">
              Perfume
            </p>
            <h2 className="font-display text-3xl text-black mb-4">Coming Soon</h2>
            <p className="font-body text-sm text-black/60 leading-relaxed">
              A signature Pink Fleur fragrance created to leave a soft, elegant, and unforgettable impression.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4 font-body font-medium">
              Bags
            </p>
            <h2 className="font-display text-3xl text-black mb-4">Coming Soon</h2>
            <p className="font-body text-sm text-black/60 leading-relaxed">
              Pink Fleur Bags are coming soon — a stylish collection designed to complement your everyday elegance with signature Pink Fleur detail.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
