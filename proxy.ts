import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block unauthenticated access to studio
  if (pathname.startsWith('/studio')) {
    // Sanity Studio handles its own auth — we add an extra origin check layer
    const host = req.headers.get('host') ?? ''
    const allowedHosts = [
      process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') ?? '',
      'localhost:3000',
    ].filter(Boolean)

    const isAllowed = allowedHosts.some((h) => host.includes(h))
    if (!isAllowed && process.env.NODE_ENV === 'production') {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  const response = NextResponse.next()

  // Security headers on every response
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
