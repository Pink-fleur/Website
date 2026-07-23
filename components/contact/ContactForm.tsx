'use client'

import { useState, useRef, useTransition } from 'react'

const subjects = [
  'General',
  'Partner Enquiry',
  'Press',
  'Purchase',
  'Donation',
]

export default function ContactForm() {
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot check (client-side fast path)
    if (data.get('_hp')) return

    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          body: JSON.stringify({
            name: data.get('name'),
            email: data.get('email'),
            subject: data.get('subject'),
            message: data.get('message'),
          }),
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
          const body = (await res.json()) as { error?: string }
          setError(body.error ?? 'Something went wrong. Please try again.')
          return
        }

        setSent(true)
        formRef.current?.reset()
      } catch {
        setError('Unable to send. Please try again or reach out via Instagram.')
      }
    })
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start justify-center py-16">
        <p className="font-display text-3xl text-black mb-4">Thank you.</p>
        <p className="font-body text-sm text-black/60">We&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot */}
      <input name="_hp" type="text" tabIndex={-1} aria-hidden className="hidden" />

      <div>
        <label htmlFor="name" className="font-body text-xs tracking-widest uppercase text-black/50 block mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-black/10 bg-white px-4 py-3 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#E79489]"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="font-body text-xs tracking-widest uppercase text-black/50 block mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-black/10 bg-white px-4 py-3 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#E79489]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="font-body text-xs tracking-widest uppercase text-black/50 block mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full border border-black/10 bg-white px-4 py-3 font-body text-sm text-black focus:outline-none focus:border-[#E79489] appearance-none"
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-body text-xs tracking-widest uppercase text-black/50 block mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full border border-black/10 bg-white px-4 py-3 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#E79489] resize-none"
          placeholder="How can we help?"
        />
      </div>

      {error && <p className="font-body text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="py-4 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
