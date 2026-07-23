import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 3
const WINDOW_MS = 10 * 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  rateLimitMap.set(ip, [...timestamps, now])
  return false
}

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str.replace(/<[^>]*>/g, '').trim().slice(0, 2000)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const name = sanitize(body.name)
  const email = sanitize(body.email)
  const subject = sanitize(body.subject)
  const message = sanitize(body.message)

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // TODO Phase 2: send via Resend/SendGrid
  // For Phase 1, log the submission server-side
  console.log('[Contact Form]', { name, email, subject, message: message.slice(0, 100) + '…' })

  return NextResponse.json({ success: true })
}
