import Link from 'next/link'
import Image from 'next/image'
import type { Beneficiary } from '@/lib/sanity/types'
import { getBeneficiaryStatusLabel, isBeneficiaryFullyFunded } from '@/lib/beneficiary-funding'

interface Props {
  beneficiary: Beneficiary
  showCta?: boolean
  /** Pre-computed image URL resolved from Sanity. */
  photoUrl?: string
  /** Shopify handle of the scarf linked to this beneficiary, if resolved. */
  scarfHandle?: string
}

export default function BeneficiaryCard({ beneficiary, showCta = true, photoUrl, scarfHandle }: Props) {
  const isFunded = isBeneficiaryFullyFunded(beneficiary)
  const statusLabel = getBeneficiaryStatusLabel(beneficiary)
  const supportHref = scarfHandle
    ? `/1ms/scarves/${scarfHandle}`
    : { pathname: '/1ms', query: { beneficiary: beneficiary._id } }

  return (
    <div className="bg-[#F8E8E5] flex flex-col">
      {/* Photo */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${beneficiary.displayName} — supported by Pink Fleur Foundation`}
            fill
            className="object-cover object-top hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#E79489]/20">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-black/50">
              Photo pending
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span
            className={`inline-block px-3 py-1 text-xs tracking-widest uppercase font-body font-medium ${
              isFunded
                ? 'bg-black text-white'
                : 'bg-[#E79489] text-black'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-3xl text-black mb-1">{beneficiary.displayName}</h3>
        <p className="font-body text-xs tracking-widest uppercase text-black/50 mb-4">
          {beneficiary.location}, {beneficiary.country}
        </p>
        <p className="font-body text-sm text-black/70 leading-relaxed flex-1 mb-6">
          {beneficiary.shortStory}
        </p>

        {showCta && (
          <div className="flex flex-col gap-2">
            {!isFunded && (
              <Link
                href={supportHref}
                className="inline-flex min-h-12 items-center justify-center px-5 py-3 bg-black text-white text-xs tracking-widest uppercase font-body font-medium text-center hover:bg-[#E79489] hover:text-black transition-colors"
              >
                Buy to support {beneficiary.displayName}
              </Link>
            )}
            <Link
              href={`/1ms/impact/${beneficiary._id}`}
              className="inline-flex min-h-12 items-center justify-center px-5 py-3 border border-black/30 text-black text-xs tracking-widest uppercase font-body font-medium text-center hover:border-black hover:bg-white transition-colors"
            >
              Read {beneficiary.displayName}&apos;s story
            </Link>
            {isFunded && (
              <p className="text-xs text-black/50 font-body italic">
                Fully funded — thank you to everyone who supported her journey.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
