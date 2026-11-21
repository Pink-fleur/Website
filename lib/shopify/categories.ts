import type { CollectionSummary, Scarf } from './types'

// Category buttons matched against Shopify "Product type".
export const PRODUCT_TYPE_CATEGORIES = ['Shirts', 'Dresses', 'Scarves', 'Ready-to-Wear']

// Collections that exist in Shopify but shouldn't become shop filters
// ("frontpage" is Shopify's auto-created "Home page" collection).
export const HIDDEN_COLLECTION_HANDLES = new Set(['frontpage'])

// "Ready To Wear", "ready-to-wear" and "Ready to wear" all compare equal.
export function normalizeCategory(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function productMatchesCategory(product: Scarf, category: string) {
  const wanted = normalizeCategory(category)
  if (normalizeCategory(product.productType || 'Scarves') === wanted) return true
  return product.collections?.nodes.some((c) => normalizeCategory(c.title) === wanted) ?? false
}

// Product-type categories first, then Shopify collections; anything with no
// products is dropped so shoppers never land on an empty filter.
export function buildCategories(products: Scarf[], collections: CollectionSummary[]) {
  const seen = new Set<string>()
  const candidates = [
    ...PRODUCT_TYPE_CATEGORIES,
    ...collections.filter((c) => !HIDDEN_COLLECTION_HANDLES.has(c.handle)).map((c) => c.title.trim()),
  ]
  return candidates.filter((category) => {
    const key = normalizeCategory(category)
    if (seen.has(key)) return false
    seen.add(key)
    return products.some((p) => productMatchesCategory(p, category))
  })
}
