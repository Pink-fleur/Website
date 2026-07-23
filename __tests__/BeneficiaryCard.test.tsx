import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BeneficiaryCard from '@/components/1ms/BeneficiaryCard'
import type { Beneficiary } from '@/lib/sanity/types'


const mockBeneficiary: Beneficiary = {
  _id: 'test-id',
  displayName: 'Hajara',
  location: 'Kano',
  country: 'Nigeria',
  shortStory: 'Left school at Primary 3, married at 15.',
  story: [],
  photo: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
  status: 'seeking',
  fundingGoal: 500000,
  fundingProgress: 0,
  linkedScarfShopifyId: '',
  pagedVerified: true,
  searchKeywords: ['education'],
  publishedAt: '2026-01-01T00:00:00Z',
}

describe('BeneficiaryCard', () => {
  it('renders the beneficiary name', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} />)
    expect(screen.getByText('Hajara')).toBeInTheDocument()
  })

  it('renders location', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} />)
    expect(screen.getByText('Kano, Nigeria')).toBeInTheDocument()
  })

  it('renders short story', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} />)
    expect(screen.getByText('Left school at Primary 3, married at 15.')).toBeInTheDocument()
  })

  it('shows "Seeking support" status badge', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} />)
    expect(screen.getByText('Seeking support')).toBeInTheDocument()
  })

  it('shows CTA when not funded', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} />)
    expect(screen.getByText('Buy to support Hajara')).toBeInTheDocument()
  })

  it('does not show buy CTA for funded beneficiary', () => {
    render(<BeneficiaryCard beneficiary={{ ...mockBeneficiary, status: 'funded', fundingProgress: 500000 }} />)
    expect(screen.queryByText('Buy to support Hajara')).not.toBeInTheDocument()
  })

  it('shows funded message for funded beneficiary', () => {
    render(<BeneficiaryCard beneficiary={{ ...mockBeneficiary, status: 'funded', fundingProgress: 500000 }} />)
    const matches = screen.getAllByText(/Fully funded/)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('does not mark a beneficiary fully funded when progress is below the goal', () => {
    render(<BeneficiaryCard beneficiary={{ ...mockBeneficiary, status: 'funded', fundingProgress: 315000 }} />)
    expect(screen.getByText('63% funded')).toBeInTheDocument()
    expect(screen.getByText('Buy to support Hajara')).toBeInTheDocument()
    expect(screen.queryByText(/Fully funded/)).not.toBeInTheDocument()
  })

  it('hides CTA when showCta is false', () => {
    render(<BeneficiaryCard beneficiary={mockBeneficiary} showCta={false} />)
    expect(screen.queryByText('Buy to support Hajara')).not.toBeInTheDocument()
  })
})
