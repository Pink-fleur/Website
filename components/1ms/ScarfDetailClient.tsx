'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Scarf } from '@/lib/shopify/types'
import type { Beneficiary } from '@/lib/sanity/types'
import { formatMoney } from '@/lib/shopify/format'
import { useCart, MAX_LINE_QUANTITY } from '@/lib/cart/context'

interface Props {
  scarf: Scarf
  linkedBeneficiaries: Beneficiary[]
}

export default function ScarfDetailClient({ scarf, linkedBeneficiaries }: Props) {
  const { addItem, triggerFlyToCart } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState(scarf.variants.nodes[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  const image = scarf.images.nodes[0]
  const selectedVariant = scarf.variants.nodes.find((v) => v.id === selectedVariantId) ?? scarf.variants.nodes[0]

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addItem(
      {
        merchandiseId: selectedVariant.id,
        productId: scarf.id,
        productHandle: scarf.handle,
        title: scarf.title,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        image: image ? { url: image.url, altText: image.altText } : undefined,
      },
      quantity
    )

    triggerFlyToCart(imageWrapRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image */}
        <div ref={imageWrapRef} className="aspect-[3/4] bg-[#F8E8E5] relative overflow-hidden">
          {image ? (
            <Image src={image.url} alt={image.altText ?? scarf.title} fill className="object-cover" sizes="50vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-4xl text-[#E79489]/30 italic">Pink Fleur</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-display text-4xl md:text-5xl text-black mb-4">{scarf.title}</h1>
          <p className="font-body text-2xl text-black mb-6">
            {formatMoney(
              selectedVariant?.price.amount ?? scarf.priceRange.minVariantPrice.amount,
              selectedVariant?.price.currencyCode ?? 'GBP'
            )}
          </p>

          {/* Variants */}
          {scarf.variants.nodes.length > 1 && (
            <div className="mb-8">
              <p className="font-body text-xs tracking-widest uppercase text-black/50 mb-3">Size / Style</p>
              <div className="flex flex-wrap gap-2">
                {scarf.variants.nodes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={!v.availableForSale}
                    className={`px-4 py-2 text-xs font-body border transition-colors ${
                      selectedVariantId === v.id
                        ? 'bg-black text-white border-black'
                        : v.availableForSale
                        ? 'border-black/20 text-black/70 hover:border-black'
                        : 'border-black/10 text-black/30 cursor-not-allowed line-through'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Who this scarf supports (read-only, auto-split — no buyer selection) */}
          <div className="mb-8 border border-[#F8E8E5] p-5">
            <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-3">
              {linkedBeneficiaries.length > 0 ? 'This scarf supports' : 'Your purchase supports'}
            </p>
            {linkedBeneficiaries.length > 0 ? (
              <div className="flex flex-col gap-3">
                {linkedBeneficiaries.map((b) => (
                  <div key={b._id}>
                    <Link
                      href={`/1ms/impact/${b._id}`}
                      className="font-display text-xl text-black hover:text-[#E79489] underline underline-offset-4 decoration-[#F8E8E5] transition-colors"
                    >
                      {b.displayName}
                    </Link>
                    <p className="font-body text-xs text-black/50">{b.location}, {b.country}</p>
                  </div>
                ))}
                {linkedBeneficiaries.length > 1 && (
                  <p className="font-body text-xs text-black/50 mt-1">
                    Proceeds are shared evenly between them — automatically, every purchase.
                  </p>
                )}
              </div>
            ) : (
              <p className="font-body text-sm text-black/60 leading-relaxed">
                The One Million Scarves initiative — supporting women through dignity, hope, and possibility.
              </p>
            )}
          </div>

          {/* Quantity + Add to cart */}
          {selectedVariant?.availableForSale !== false && (
            <div className="flex items-center border border-black/20 w-fit mb-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-black/60 hover:text-black"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-body text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(MAX_LINE_QUANTITY, q + 1))}
                disabled={quantity >= MAX_LINE_QUANTITY}
                className="w-10 h-12 flex items-center justify-center text-black/60 hover:text-black disabled:opacity-30"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale}
            className="w-full py-4 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {selectedVariant?.availableForSale === false ? 'Sold Out' : added ? 'Added ✓' : 'Add to Cart'}
          </button>

          {/* Description */}
          {scarf.description && (
            <p className="font-body text-sm text-black/60 leading-relaxed mt-4">{scarf.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
