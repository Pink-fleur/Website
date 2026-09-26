const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.SHOPIFY_STOREFRONT_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ''
const SHOPIFY_API_VERSION = '2024-10'

export function hasShopifyStorefrontConfig() {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN)
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate = 60,
  tags,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  // Seconds before cached Shopify data is refetched. Without this, 'force-cache'
  // keeps the response forever and price/stock edits in Shopify never show up.
  revalidate?: number
  tags?: string[]
}): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error('Shopify store domain is not configured')
  }

  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (SHOPIFY_STOREFRONT_TOKEN) {
    headers['Shopify-Storefront-Private-Token'] = SHOPIFY_STOREFRONT_TOKEN
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache,
    next: cache === 'no-store' ? undefined : { revalidate, tags },
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as { data: T; errors?: Array<{ message: string }> }

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`)
  }

  return json.data
}
