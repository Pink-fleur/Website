import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactForm from '@/components/contact/ContactForm'

global.fetch = jest.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('renders Send Message button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument()
  })

  it('shows thank you message after successful submission', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'General' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there!' } })
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))
    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ error: 'Server error' }) })
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'General' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there!' } })
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })
})
