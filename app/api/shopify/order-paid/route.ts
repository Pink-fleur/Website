import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSanityWriteClient } from '@/lib/sanity/write-client'
import {
  calculateFundingAllocations,
  getOrderCurrency,
  type ShopifyOrderPayload,
} from '@/lib/shopify/order-funding'
import type { Beneficiary } from '@/lib/sanity/types'

export const runtime = 'nodejs'

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret || !hmacHeader) return false

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  const digestBuffer = Buffer.from(digest, 'base64')
  const headerBuffer = Buffer.from(hmacHeader, 'base64')

  if (digestBuffer.length !== headerBuffer.length) return false

  return crypto.timingSafeEqual(digestBuffer, headerBuffer)
}

function getReceiptId(webhookId: string) {
  return `shopifyWebhookReceipt.${webhookId.replace(/[^a-zA-Z0-9_.-]/g, '-')}`
}

function isConflictError(error: unknown) {
  return typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && (error as { statusCode?: number }).statusCode === 409
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const hmac = req.headers.get('x-shopify-hmac-sha256')

  if (!verifyShopifyHmac(rawBody, hmac)) {
    return NextResponse.json({ error: 'Invalid Shopify webhook signature' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic')
  if (topic && topic !== 'orders/paid') {
    return NextResponse.json({ skipped: true, reason: 'Unsupported topic' })
  }

  let order: ShopifyOrderPayload
  try {
    order = JSON.parse(rawBody) as ShopifyOrderPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const expectedCurrency = (process.env.SHOPIFY_FUNDING_CURRENCY ?? 'NGN').toUpperCase()
  const orderCurrency = getOrderCurrency(order)

  if (orderCurrency !== expectedCurrency) {
    return NextResponse.json({
      skipped: true,
      reason: 'Currency mismatch',
      expectedCurrency,
      orderCurrency,
    })
  }

  const allocations = calculateFundingAllocations(order)
  if (allocations.length === 0) {
    return NextResponse.json({ updated: [], skipped: true, reason: 'No beneficiary allocations found' })
  }

  const webhookId = req.headers.get('x-shopify-webhook-id') ?? `order-${order.id ?? crypto.randomUUID()}`
  const sanity = getSanityWriteClient()

  try {
    await sanity.create({
      _id: getReceiptId(webhookId),
      _type: 'shopifyWebhookReceipt',
      webhookId,
      topic: topic ?? 'orders/paid',
      shop: req.headers.get('x-shopify-shop-domain') ?? undefined,
      orderId: order.id ? String(order.id) : undefined,
      receivedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (isConflictError(error)) {
      return NextResponse.json({ skipped: true, reason: 'Duplicate webhook' })
    }
    throw error
  }

  const updated: Array<{ beneficiaryId: string; amount: number; status?: Beneficiary['status'] }> = []
  const allocationAudit: Array<{ beneficiaryId: string; beneficiaryName: string; amount: number }> = []

  for (const allocation of allocations) {
    const beneficiary = await sanity.fetch<Pick<Beneficiary, '_id' | 'displayName' | 'fundingGoal' | 'fundingProgress' | 'status'> | null>(
      `*[_type == "beneficiary" && _id == $id && status != "withdrawn"][0]{
        _id,
        displayName,
        fundingGoal,
        fundingProgress,
        status
      }`,
      { id: allocation.beneficiaryId }
    )

    if (!beneficiary) continue

    allocationAudit.push({
      beneficiaryId: beneficiary._id,
      beneficiaryName: beneficiary.displayName,
      amount: allocation.amount,
    })

    const nextProgress = (beneficiary.fundingProgress ?? 0) + allocation.amount
    const shouldMarkFunded = (beneficiary.fundingGoal ?? 0) > 0
      && nextProgress >= beneficiary.fundingGoal
      && beneficiary.status !== 'funded'

    const patch = sanity.patch(beneficiary._id).inc({ fundingProgress: allocation.amount })

    if (shouldMarkFunded) {
      patch.set({
        status: 'funded',
        fundedAt: new Date().toISOString(),
      })
    }

    await patch.commit()

    updated.push({
      beneficiaryId: beneficiary._id,
      amount: allocation.amount,
      status: shouldMarkFunded ? 'funded' : beneficiary.status,
    })
  }

  if (allocationAudit.length > 0) {
    await sanity.patch(getReceiptId(webhookId)).set({ allocations: allocationAudit }).commit()
  }

  if (updated.length > 0) {
    revalidatePath('/1ms')
    revalidatePath('/1ms/impact')
    revalidatePath('/1ms/impact/[id]', 'page')
  }

  return NextResponse.json({ updated })
}
