'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart, MAX_LINE_QUANTITY } from '@/lib/cart/context'
import { formatMoney } from '@/lib/shopify/format'

export default function CartDrawer() {
  const { lines, subtotal, currencyCode, isOpen, isCheckingOut, checkoutError, closeCart, updateQuantity, removeItem, checkout } =
    useCart()

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="font-display text-2xl text-black">Your Cart</h2>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 text-black/60 hover:text-black">
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <p className="font-body text-sm text-black/60 mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs tracking-widest uppercase font-body hover:bg-[#E79489] hover:text-black transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
              {lines.map((line) => (
                <div key={line.merchandiseId} className="flex gap-4">
                  <div className="w-20 h-24 bg-[#F8E8E5] shrink-0 relative overflow-hidden">
                    {line.image ? (
                      <Image
                        src={line.image.url}
                        alt={line.image.altText ?? line.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/1ms/scarves/${line.productHandle}`}
                          onClick={closeCart}
                          className="font-display text-lg text-black hover:text-[#E79489] transition-colors"
                        >
                          {line.title}
                        </Link>
                        {line.variantTitle && line.variantTitle !== 'Default Title' && (
                          <p className="font-body text-xs text-black/50">{line.variantTitle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(line.merchandiseId)}
                        aria-label={`Remove ${line.title} from cart`}
                        className="shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-body font-medium tracking-wide uppercase text-red-500 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                      >
                        <span aria-hidden="true">✕</span> Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-black/20">
                        <button
                          onClick={() => updateQuantity(line.merchandiseId, line.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-black/60 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-body text-sm">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.merchandiseId, line.quantity + 1)}
                          disabled={line.quantity >= MAX_LINE_QUANTITY}
                          className="w-7 h-7 flex items-center justify-center text-black/60 hover:text-black disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-body text-sm text-black">
                        {formatMoney(Number(line.price.amount) * line.quantity, line.price.currencyCode)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-sm uppercase tracking-widest text-black/60">Subtotal</span>
                <span className="font-display text-xl text-black">{formatMoney(subtotal, currencyCode)}</span>
              </div>
              {checkoutError && <p className="text-xs text-red-600 font-body mb-4">{checkoutError}</p>}
              <button
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors disabled:opacity-50"
              >
                {isCheckingOut ? 'Opening Checkout…' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
