import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BeneficiaryGrid from '@/components/1ms/BeneficiaryGrid'
import type { Beneficiary } from '@/lib/sanity/types'

jest.mock('../lib/sanity/client', () => ({
  sanityClient: { fetch: jest.fn().mockResolvedValue(null) },
  urlFor: jest.fn(() => ({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    fit: jest.fn().mockReturnThis(),
    url: jest.fn().mockReturnValue('/images/beneficiaries/b-1.jpg'),
  })),
}))

const beneficiaries: Beneficiary[] = [
  {
    _id: 'bg-1',
    displayName: 'Hajara',
    location: 'Kano',
    country: 'Nigeria',
    shortStory: 'Story A.',
    story: [],
    photo: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    status: 'seeking',
    fundingGoal: 500000,
    fundingProgress: 0,
    linkedScarfShopifyId: '',
    pagedVerified: true,
    searchKeywords: ['kano'],
    publishedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'bg-2',
    displayName: 'Patience',
    location: 'Abuja',
    country: 'Nigeria',
    shortStory: 'Story B.',
    story: [],
    photo: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    status: 'supported',
    fundingGoal: 350000,
    fundingProgress: 50000,
    linkedScarfShopifyId: '',
    pagedVerified: true,
    searchKeywords: ['disability'],
    publishedAt: '2026-01-01T00:00:00Z',
  },
]

describe('BeneficiaryGrid', () => {
  it('renders all beneficiaries', () => {
    render(<BeneficiaryGrid beneficiaries={beneficiaries} />)
    expect(screen.getByText('Hajara')).toBeInTheDocument()
    expect(screen.getByText('Patience')).toBeInTheDocument()
  })

  it('filters by search query', () => {
    render(<BeneficiaryGrid beneficiaries={beneficiaries} />)
    fireEvent.change(screen.getByPlaceholderText(/Search by name/), { target: { value: 'Kano' } })
    expect(screen.getByText('Hajara')).toBeInTheDocument()
    expect(screen.queryByText('Patience')).not.toBeInTheDocument()
  })

  it('shows no results message on empty search', () => {
    render(<BeneficiaryGrid beneficiaries={beneficiaries} />)
    fireEvent.change(screen.getByPlaceholderText(/Search by name/), { target: { value: 'zzz' } })
    expect(screen.getByText('No women match your search.')).toBeInTheDocument()
  })

  it('clears search on clear button', () => {
    render(<BeneficiaryGrid beneficiaries={beneficiaries} />)
    fireEvent.change(screen.getByPlaceholderText(/Search by name/), { target: { value: 'zzz' } })
    fireEvent.click(screen.getByText('Clear filters'))
    expect(screen.getByText('Hajara')).toBeInTheDocument()
    expect(screen.getByText('Patience')).toBeInTheDocument()
  })
})
