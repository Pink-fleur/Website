import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { beneficiariesByScarfIdQuery } from '@/lib/sanity/queries'
import { hasShopifyStorefrontConfig, shopifyFetch } from '@/lib/shopify/client'
import { CREATE_CART_MUTATION } from '@/lib/shopify/queries'
import type { Cart } from '@/lib/shopify/types'

interface CheckoutLineRequest {
  merchandiseId?: unknown
  quantity?: unknown
  productId?: unknown
}

interface CheckoutRequest {
  lines?: unknown
}

interface ScarfBeneficiary {
  _id: string
  displayName: string
}

const beneficiaryCache = new Map<string, Promise<ScarfBeneficiary[]>>()

async function getLinkedBeneficiaries(productId: string): Promise<ScarfBeneficiary[]> {
  if (!productId) return []

  let pending = beneficiaryCache.get(productId)
  if (!pending) {
    pending = sanityClient
      .fetch<ScarfBeneficiary[]>(beneficiariesByScarfIdQuery, { scarfId: productId })
      .catch(() => [])
    beneficiaryCache.set(productId, pending)
  }
  return pending
}

interface CartCreateResponse {
  cartCreate: {
    cart: Cart | null
    userErrors: Array<{ field: string[] | null; message: string }>
  }
}

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 10
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  rateLimitMap.set(ip, [...timestamps, now])
  return false
}

function parseQuantity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) return 1
  return Math.min(Math.max(value, 1), 10)
}

const MAX_LINES = 25

function parseLines(value: unknown): { merchandiseId: string; quantity: number; productId: string }[] {
  if (!Array.isArray(value)) return []

  return value.slice(0, MAX_LINES).flatMap((raw: CheckoutLineRequest) => {
    const merchandiseId = typeof raw?.merchandiseId === 'string' ? raw.merchandiseId.trim() : ''
    if (!merchandiseId) return []

    return [
      {
        merchandiseId,
        quantity: parseQuantity(raw.quantity),
        productId: typeof raw?.productId === 'string' ? raw.productId.trim() : '',
      },
    ]
  })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: CheckoutRequest
  try {
    body = (await req.json()) as CheckoutRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const lines = parseLines(body.lines)
  if (lines.length === 0) {
    return NextResponse.json({ error: 'At least one cart line is required' }, { status: 400 })
  }

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0)

  if (!hasShopifyStorefrontConfig()) {
    const checkoutUrl = new URL('/contact', req.nextUrl.origin)
    checkoutUrl.searchParams.set('subject', 'Demo checkout')
    checkoutUrl.searchParams.set('items', lines.map((l) => l.merchandiseId).join(','))

    return NextResponse.json({
      cartId: `demo-cart-${Date.now()}`,
      checkoutUrl: checkoutUrl.toString(),
      totalQuantity,
      demo: true,
    })
  }

  try {
    const cartLines = await Promise.all(
      lines.map(async (line) => {
        const linkedBeneficiaries = await getLinkedBeneficiaries(line.productId)
        return {
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
          attributes:
            linkedBeneficiaries.length > 0
              ? [
                  {
                    key: '_beneficiary_ids',
                    value: JSON.stringify(linkedBeneficiaries.map((b) => b._id)),
                  },
                  {
                    key: '_beneficiary_names',
                    value: linkedBeneficiaries.map((b) => b.displayName).join(', '),
                  },
                ]
              : [],
        }
      })
    )

    const data = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART_MUTATION,
      variables: { lines: cartLines },
      cache: 'no-store',
    })

    const userError = data.cartCreate.userErrors[0]
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    if (!data.cartCreate.cart?.checkoutUrl) {
      return NextResponse.json({ error: 'Unable to create checkout' }, { status: 502 })
    }

    return NextResponse.json({
      cartId: data.cartCreate.cart.id,
      checkoutUrl: data.cartCreate.cart.checkoutUrl,
      totalQuantity: data.cartCreate.cart.totalQuantity,
    })
  } catch (e) {
    const err = e as Error
    return NextResponse.json(
      { error: err.message || 'Unable to create checkout' },
      { status: 502 }
    )
  }
}
