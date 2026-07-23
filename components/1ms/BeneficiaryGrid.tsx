'use client'

import { useState, useMemo } from 'react'
import type { Beneficiary } from '@/lib/sanity/types'
import type { Scarf } from '@/lib/shopify/types'
import { urlFor } from '@/lib/sanity/client'
import BeneficiaryCard from './BeneficiaryCard'

function resolvePhoto(b: Beneficiary): string | undefined {
  if (b.photo?.asset?._ref) {
    return urlFor(b.photo).width(400).height(500).fit('crop').url()
  }
  return undefined
}

interface Props {
  beneficiaries: Beneficiary[]
  scarves?: Scarf[]
}

export default function BeneficiaryGrid({ beneficiaries, scarves = [] }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const scarfHandleById = useMemo(
    () => Object.fromEntries(scarves.map((s) => [s.id, s.handle])),
    [scarves]
  )

  const countries = ['All', ...Array.from(new Set(beneficiaries.map((b) => b.country)))]

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return beneficiaries.filter((b) => {
      if (filter !== 'All' && b.country !== filter) return false
      if (!q) return true
      return (
        b.displayName.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.shortStory.toLowerCase().includes(q) ||
        b.searchKeywords.some((k) => k.toLowerCase().includes(q))
      )
    })
  }, [beneficiaries, query, filter])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {beneficiaries.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
              No published beneficiaries
            </p>
            <h2 className="font-display text-4xl text-black mb-4">Women&apos;s stories will appear here once published.</h2>
            <p className="font-body text-sm text-black/60 max-w-xl mx-auto">
              Add verified beneficiary profiles in Sanity to show live impact stories.
            </p>
          </div>
        ) : (
          <>
        {/* Search & filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="search"
            placeholder="Search by name, city, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-black/10 bg-white px-5 py-3 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#E79489]"
          />
          <div className="flex gap-2 flex-wrap">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-body font-medium border transition-colors ${
                  filter === c
                    ? 'bg-black text-white border-black'
                    : 'border-black/20 text-black/60 hover:border-black/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-black/50 mb-4">No women match your search.</p>
            <button
              onClick={() => { setQuery(''); setFilter('All') }}
              className="text-xs tracking-widest uppercase text-[#E79489] font-body"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((b) => (
              <div key={b._id} id={b._id}>
                <BeneficiaryCard
                  beneficiary={b}
                  photoUrl={resolvePhoto(b)}
                  scarfHandle={scarfHandleById[b.linkedScarfShopifyId]}
                />
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  )
}
