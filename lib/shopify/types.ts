export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ScarfVariant {
  id: string
  title: string
  price: Money
  availableForSale: boolean
  quantityAvailable: number
}

export interface Scarf {
  id: string
  handle: string
  title: string
  description: string
  productType?: string
  variants: { nodes: ScarfVariant[] }
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money }
  images: { nodes: ShopifyImage[] }
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
}
