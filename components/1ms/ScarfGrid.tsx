import Link from 'next/link'
import type { Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ScarfCard from './ScarfCard'

interface Props {
  scarves: Scarf[]
  beneficiaries: Beneficiary[]
  eyebrow?: string
  heading?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export default function ScarfGrid({
  scarves,
  beneficiaries,
  eyebrow,
  heading,
  viewAllHref,
  viewAllLabel = 'See all →',
}: Props) {
  if (scarves.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
            Shop unavailable
          </p>
          <h2 className="font-display text-4xl text-black mb-4">No live scarves yet</h2>
          <p className="font-body text-sm text-black/60 leading-relaxed">
            Once Shopify products are published to the Storefront API, they will appear here automatically.
          </p>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs tracking-widest uppercase font-body hover:bg-[#E79489] hover:text-black transition-colors"
            >
              Contact Pink Fleur
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {heading && (
          <div className="flex items-end justify-between mb-12">
            <div>
              {eyebrow && (
                <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-3 font-body font-medium">
                  {eyebrow}
                </p>
              )}
              <h2 className="font-display text-4xl text-black">{heading}</h2>
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="shrink-0 text-xs tracking-widest uppercase text-black font-body font-medium hover:text-[#E79489] transition-colors hidden md:block"
              >
                {viewAllLabel}
              </Link>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scarves.map((scarf) => {
            const linked = beneficiaries.filter((b) => b.linkedScarfShopifyId === scarf.id)
            return (
              <ScarfCard
                key={scarf.id}
                scarf={scarf}
                beneficiaryNames={linked.map((b) => b.displayName)}
              />
            )
          })}
        </div>
        {viewAllHref && (
          <div className="mt-8 md:hidden">
            <Link href={viewAllHref} className="text-xs tracking-widest uppercase text-black font-body font-medium">
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
