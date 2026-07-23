import type { Metadata } from 'next'
import './globals.css'
import AppChrome from '@/components/layout/AppChrome'

export const metadata: Metadata = {
  title: {
    default: 'Pink Fleur Foundation',
    template: '%s | Pink Fleur Foundation',
  },
  description: 'Art, photography, and the 1MS movement — One Million Scarves connecting story and purchase to create real impact for women in underserved communities.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pinkfleur.org'),
  openGraph: {
    siteName: 'Pink Fleur Foundation',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Pink Fleur Foundation' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
  icons: {
    icon: '/logo-new.png',
    apple: '/logo-new.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  )
}
