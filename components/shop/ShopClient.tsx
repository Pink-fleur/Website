'use client'

import { useMemo, useState } from 'react'
import type { PageInfo, Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import ScarfGrid from '@/components/1ms/ScarfGrid'

interface Props {
  products: Scarf[]
  initialPageInfo: PageInfo
  beneficiaries: Beneficiary[]
  categories: string[]
  initialCategory?: string
  initialQuery?: string
}

function findCategory(categories: string[], value?: string) {
  if (!value) return undefined
  return categories.find((c) => c.toLowerCase() === value.toLowerCase())
}

export default function ShopClient({
  products,
  initialPageInfo,
  beneficiaries,
  categories,
  initialCategory,
  initialQuery,
}: Props) {
  const [category, setCategory] = useState(findCategory(categories, initialCategory) ?? 'All')
  const [query, setQuery] = useState(initialQuery ?? '')
  const [loadedProducts, setLoadedProducts] = useState(products)
  const [pageInfo, setPageInfo] = useState(initialPageInfo)
  const [loadingMore, setLoadingMore] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return loadedProducts.filter((product) => {
      const productCategory = (product.productType || 'Scarves').toLowerCase()
      if (category !== 'All' && productCategory !== category.toLowerCase()) return false
      if (!q) return true
      return (
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
      )
    })
  }, [loadedProducts, category, query])

  function clearFilters() {
    setCategory('All')
    setQuery('')
  }

  async function loadMore() {
    if (!pageInfo.hasNextPage || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await fetch(`/api/products?after=${encodeURIComponent(pageInfo.endCursor ?? '')}`)
      if (!res.ok) throw new Error('Unable to load more products')
      const data = (await res.json()) as { products: Scarf[]; pageInfo: PageInfo }
      setLoadedProducts((prev) => [...prev, ...data.products])
      setPageInfo(data.pageInfo)
    } catch {
      // Best-effort: leave pageInfo untouched so the button stays available to retry.
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-black/10 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-body font-medium border transition-colors ${
                  category === c
                    ? 'bg-black text-white border-black'
                    : 'border-black/20 text-black/60 hover:border-black/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full md:w-72 border border-black/10 bg-white px-4 py-3 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#E79489]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#E79489] mb-4">
              {query ? 'No matches' : `${category} — Coming Soon`}
            </p>
            <h2 className="font-display text-4xl text-black mb-4">
              {query ? 'No products match your search' : 'Nothing here yet'}
            </h2>
            <p className="font-body text-sm text-black/60 leading-relaxed">
              {query
                ? 'Try a different search term or browse another collection.'
                : 'This collection is on its way. Explore our other collections in the meantime.'}
            </p>
            <button
              onClick={clearFilters}
              className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs tracking-widest uppercase font-body hover:bg-[#E79489] hover:text-black transition-colors"
            >
              View all products
            </button>
          </div>
        </section>
      ) : (
        <ScarfGrid scarves={filtered} beneficiaries={beneficiaries} />
      )}

      {pageInfo.hasNextPage && (
        <div className="bg-white pt-2 pb-20 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-10 py-3.5 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  )
}
