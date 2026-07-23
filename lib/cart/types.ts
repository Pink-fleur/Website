import type { Money } from '@/lib/shopify/types'

export interface CartLineItem {
  merchandiseId: string
  productId: string
  productHandle: string
  title: string
  variantTitle?: string
  price: Money
  image?: { url: string; altText: string | null }
  quantity: number
}
