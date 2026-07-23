interface ShopifyLineItemProperty {
  name?: string
  key?: string
  value?: string | number | null
}

export interface ShopifyOrderLineItem {
  quantity?: number
  price?: string
  pre_tax_price?: string
  total_discount?: string
  properties?: ShopifyLineItemProperty[]
}

export interface ShopifyOrderPayload {
  id?: number | string
  currency?: string
  line_items?: ShopifyOrderLineItem[]
}

export interface FundingAllocation {
  beneficiaryId: string
  amount: number
}

function getPropertyValue(properties: ShopifyLineItemProperty[] | undefined, key: string) {
  const property = properties?.find((item) => item.name === key || item.key === key)
  if (property?.value === undefined || property.value === null) return null
  return String(property.value)
}

function getBeneficiaryIds(properties: ShopifyLineItemProperty[] | undefined): string[] {
  const raw = getPropertyValue(properties, '_beneficiary_ids')
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0)
  } catch {
    return []
  }
}

function parseMoney(value: string | undefined) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

function getLineItemSubtotal(lineItem: ShopifyOrderLineItem) {
  if (lineItem.pre_tax_price) return parseMoney(lineItem.pre_tax_price)

  const quantity = Number.isFinite(lineItem.quantity) ? lineItem.quantity ?? 1 : 1
  const price = parseMoney(lineItem.price)
  const discount = parseMoney(lineItem.total_discount)

  return Math.max(price * quantity - discount, 0)
}

export function getFundingAllocationPercent() {
  const configured = Number(process.env.SHOPIFY_FUNDING_ALLOCATION_PERCENT ?? '100')
  if (!Number.isFinite(configured)) return 100
  return Math.min(Math.max(configured, 0), 100)
}

export function calculateFundingAllocations(
  order: ShopifyOrderPayload,
  allocationPercent = getFundingAllocationPercent()
): FundingAllocation[] {
  const allocations = new Map<string, number>()
  const multiplier = allocationPercent / 100

  for (const lineItem of order.line_items ?? []) {
    const beneficiaryIds = getBeneficiaryIds(lineItem.properties)
    if (beneficiaryIds.length === 0) continue

    const lineAmount = getLineItemSubtotal(lineItem) * multiplier
    if (lineAmount <= 0) continue

    const share = lineAmount / beneficiaryIds.length

    for (const beneficiaryId of beneficiaryIds) {
      allocations.set(beneficiaryId, (allocations.get(beneficiaryId) ?? 0) + share)
    }
  }

  return Array.from(allocations, ([beneficiaryId, amount]) => ({
    beneficiaryId,
    amount: Math.round(amount * 100) / 100,
  }))
}

export function getOrderCurrency(order: ShopifyOrderPayload) {
  return order.currency?.toUpperCase() ?? null
}
