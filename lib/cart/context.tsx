'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CartLineItem } from './types'
import { flyToCart } from './flyToCart'

const STORAGE_KEY = 'pinkfleur_cart'
export const MAX_LINE_QUANTITY = 10

interface CartContextValue {
  lines: CartLineItem[]
  totalQuantity: number
  subtotal: number
  currencyCode: string
  isOpen: boolean
  isCheckingOut: boolean
  checkoutError: string
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartLineItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (merchandiseId: string, quantity: number) => void
  removeItem: (merchandiseId: string) => void
  checkout: () => Promise<void>
  cartIconRef: React.RefObject<HTMLButtonElement | null>
  triggerFlyToCart: (sourceEl: HTMLElement | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLineItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const cartIconRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      // One-time hydration from a browser-only API unavailable during SSR — the
      // empty-cart first paint must match the server, so this can't move to render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw))
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const addItem = useCallback((item: Omit<CartLineItem, 'quantity'>, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.merchandiseId === item.merchandiseId)
      if (existing) {
        return prev.map((l) =>
          l.merchandiseId === item.merchandiseId
            ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_LINE_QUANTITY) }
            : l
        )
      }
      return [...prev, { ...item, quantity: Math.min(Math.max(quantity, 1), MAX_LINE_QUANTITY) }]
    })
    setCheckoutError('')
  }, [])

  const triggerFlyToCart = useCallback((sourceEl: HTMLElement | null) => {
    if (!sourceEl || !cartIconRef.current) return
    flyToCart(sourceEl, cartIconRef.current)
  }, [])

  const updateQuantity = useCallback((merchandiseId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.merchandiseId !== merchandiseId)
      return prev.map((l) =>
        l.merchandiseId === merchandiseId ? { ...l, quantity: Math.min(quantity, MAX_LINE_QUANTITY) } : l
      )
    })
  }, [])

  const removeItem = useCallback((merchandiseId: string) => {
    setLines((prev) => prev.filter((l) => l.merchandiseId !== merchandiseId))
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const totalQuantity = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + Number(l.price.amount) * l.quantity, 0),
    [lines]
  )
  const currencyCode = lines[0]?.price.currencyCode ?? 'GBP'

  const checkout = useCallback(async () => {
    if (lines.length === 0) return
    setIsCheckingOut(true)
    setCheckoutError('')

    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            merchandiseId: l.merchandiseId,
            quantity: l.quantity,
            productId: l.productId,
          })),
        }),
      })

      const payload = (await res.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null

      if (!res.ok || !payload?.checkoutUrl) {
        throw new Error(payload?.error ?? 'Unable to open checkout')
      }

      window.localStorage.removeItem(STORAGE_KEY)
      window.location.assign(payload.checkoutUrl)
    } catch (e) {
      const err = e as Error
      setCheckoutError(err.message || 'Unable to open checkout. Please try again.')
      setIsCheckingOut(false)
    }
  }, [lines])

  const value: CartContextValue = {
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    isOpen,
    isCheckingOut,
    checkoutError,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    checkout,
    cartIconRef,
    triggerFlyToCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
