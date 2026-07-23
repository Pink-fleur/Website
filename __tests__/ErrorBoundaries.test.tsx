import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ShopifyErrorBoundary from '@/components/shared/ShopifyErrorBoundary'
import SanityErrorBoundary from '@/components/shared/SanityErrorBoundary'

const Exploding = () => { throw new Error('Test error') }

describe('ShopifyErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ShopifyErrorBoundary><p>Shop content</p></ShopifyErrorBoundary>)
    expect(screen.getByText('Shop content')).toBeInTheDocument()
  })

  it('renders fallback when child throws', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<ShopifyErrorBoundary><Exploding /></ShopifyErrorBoundary>)
    expect(screen.getByText(/Our shop is temporarily unavailable/)).toBeInTheDocument()
    spy.mockRestore()
  })
})

describe('SanityErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<SanityErrorBoundary><p>Sanity content</p></SanityErrorBoundary>)
    expect(screen.getByText('Sanity content')).toBeInTheDocument()
  })

  it('renders fallback when child throws', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<SanityErrorBoundary><Exploding /></SanityErrorBoundary>)
    expect(screen.getByText(/Content is loading/)).toBeInTheDocument()
    spy.mockRestore()
  })
})
