'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Scarf } from '@/lib/shopify/types'
import { formatMoney } from '@/lib/shopify/format'
import { useCart } from '@/lib/cart/context'

interface Props {
  scarf: Scarf
  beneficiaryNames?: string[]
}

export default function ScarfCard({ scarf, beneficiaryNames = [] }: Props) {
  const { addItem, triggerFlyToCart } = useCart()
  const [added, setAdded] = useState(false)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const image = scarf.images.nodes[0]
  const price = scarf.priceRange.minVariantPrice
  const scarfHref = `/1ms/scarves/${scarf.handle}`
  const defaultVariant = scarf.variants.nodes.find((v) => v.availableForSale) ?? scarf.variants.nodes[0]

  function handleQuickAdd() {
    if (!defaultVariant) return
    addItem({
      merchandiseId: defaultVariant.id,
      productId: scarf.id,
      productHandle: scarf.handle,
      title: scarf.title,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      image: image ? { url: image.url, altText: image.altText } : undefined,
    })
    triggerFlyToCart(imageWrapRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col bg-white">
      <Link href={scarfHref} className="block">
        <div ref={imageWrapRef} className="aspect-[3/4] bg-[#F8E8E5] overflow-hidden relative">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? scarf.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-4xl text-[#E79489]/30 italic">Pink Fleur</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={scarfHref}>
          <h3 className="font-display text-2xl text-black mb-1 hover:text-[#E79489] transition-colors">
            {scarf.title}
          </h3>
        </Link>
        {beneficiaryNames.length > 0 && (
          <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-3">
            For {beneficiaryNames.join(' & ')}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="font-body text-sm text-black">
            {formatMoney(price.amount, price.currencyCode)}
          </p>
          <Link
            href={scarfHref}
            className="text-xs tracking-widest uppercase text-[#E79489] font-body font-medium hover:underline"
          >
            View scarf →
          </Link>
        </div>
        <button
          onClick={handleQuickAdd}
          disabled={!defaultVariant?.availableForSale}
          className="mt-3 w-full py-2.5 border border-black/20 text-black text-xs tracking-widest uppercase font-body font-medium hover:bg-black hover:text-white hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {!defaultVariant?.availableForSale ? 'Sold Out' : added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
