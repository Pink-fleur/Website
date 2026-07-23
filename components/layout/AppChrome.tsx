'use client'

import { usePathname } from 'next/navigation'
import { CartProvider } from '@/lib/cart/context'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollEffects from './ScrollEffects'
import CartDrawer from '@/components/cart/CartDrawer'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <CartProvider>
      <ScrollEffects />
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
