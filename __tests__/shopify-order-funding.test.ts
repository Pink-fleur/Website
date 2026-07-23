import { calculateFundingAllocations, getOrderCurrency } from '@/lib/shopify/order-funding'

function beneficiaryIdsProperty(ids: string[]) {
  return { name: '_beneficiary_ids', value: JSON.stringify(ids) }
}

describe('Shopify order funding allocation', () => {
  it('groups line-item totals by beneficiary id', () => {
    expect(
      calculateFundingAllocations({
        currency: 'NGN',
        line_items: [
          {
            quantity: 2,
            price: '1000.00',
            properties: [beneficiaryIdsProperty(['beneficiary-a'])],
          },
          {
            pre_tax_price: '500.00',
            properties: [beneficiaryIdsProperty(['beneficiary-a'])],
          },
          {
            quantity: 1,
            price: '750.00',
            properties: [beneficiaryIdsProperty(['beneficiary-b'])],
          },
        ],
      })
    ).toEqual([
      { beneficiaryId: 'beneficiary-a', amount: 2500 },
      { beneficiaryId: 'beneficiary-b', amount: 750 },
    ])
  })

  it('splits a line evenly across multiple linked beneficiaries', () => {
    expect(
      calculateFundingAllocations({
        currency: 'NGN',
        line_items: [
          {
            quantity: 1,
            price: '1000.00',
            properties: [beneficiaryIdsProperty(['beneficiary-a', 'beneficiary-b'])],
          },
        ],
      })
    ).toEqual([
      { beneficiaryId: 'beneficiary-a', amount: 500 },
      { beneficiaryId: 'beneficiary-b', amount: 500 },
    ])
  })

  it('ignores lines without any linked beneficiaries', () => {
    expect(
      calculateFundingAllocations({
        currency: 'NGN',
        line_items: [
          {
            quantity: 1,
            price: '1000.00',
            properties: [beneficiaryIdsProperty([])],
          },
          {
            quantity: 1,
            price: '1000.00',
            properties: [],
          },
          {
            quantity: 1,
            price: '1000.00',
            properties: [{ name: '_beneficiary_ids', value: 'not-json' }],
          },
        ],
      })
    ).toEqual([])
  })

  it('applies the configured allocation percentage', () => {
    expect(
      calculateFundingAllocations(
        {
          currency: 'NGN',
          line_items: [
            {
              quantity: 1,
              price: '1000.00',
              properties: [beneficiaryIdsProperty(['beneficiary-a'])],
            },
          ],
        },
        25
      )
    ).toEqual([{ beneficiaryId: 'beneficiary-a', amount: 250 }])
  })

  it('normalizes order currency', () => {
    expect(getOrderCurrency({ currency: 'ngn' })).toBe('NGN')
    expect(getOrderCurrency({})).toBeNull()
  })
})
