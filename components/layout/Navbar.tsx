'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart/context'
import { CartIcon } from '@/components/icons/CartIcon'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: '1MS', href: '/1ms' },
  { label: 'Collections', href: '/shop' },
  { label: 'Our Founder', href: '/founder' },
  { label: 'Pink Fleur Foundation', href: '/impact' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { totalQuantity, openCart, cartIconRef } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (totalQuantity === 0) return

    const interval = window.setInterval(() => {
      const el = cartIconRef.current
      if (!el) return
      el.classList.remove('animate-cart-shake')
      void el.offsetWidth
      el.classList.add('animate-cart-shake')
    }, 6000)

    return () => window.clearInterval(interval)
  }, [totalQuantity, cartIconRef])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function isActiveLink(href: string) {
    if (href === '/') {
      return pathname === '/'
    }

    if (href === '/1ms') {
      return pathname === href || pathname.startsWith('/1ms/scarves/')
    }

    return pathname === href
  }

  function handleNavClick() {
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b transition-[border-color,box-shadow] duration-300 ${
        scrolled ? 'border-black/10 shadow-[0_1px_16px_rgba(0,0,0,0.06)]' : 'border-black/0'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ease-out ${
          scrolled ? 'h-16 md:h-20' : 'h-24'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo-new.png"
            alt="Pink Fleur"
            width={160}
            height={107}
            priority
            className={`w-auto object-contain transition-all duration-300 ${
              scrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={handleNavClick}
                className={`relative font-body text-[11px] tracking-widest uppercase transition-colors lg:text-xs ${
                  isActive ? 'text-[#E79489]' : 'text-black hover:text-[#E79489]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-[#E79489]" aria-hidden="true" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Utility cluster: shop CTA, cart, mobile menu — kept as one right-aligned group */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/1ms"
            aria-current={isActiveLink('/1ms') ? 'page' : undefined}
            className={`hidden lg:inline-flex items-center px-5 py-2 text-xs tracking-widest uppercase font-body font-medium transition-colors ${
              isActiveLink('/1ms')
                ? 'bg-[#E79489] text-black'
                : 'bg-black text-white hover:bg-[#E79489] hover:text-black'
            }`}
          >
            Shop
          </Link>

          {/* Cart */}
          <button
            ref={cartIconRef}
            onClick={openCart}
            aria-label={`Open cart${totalQuantity > 0 ? `, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}` : ''}`}
            className="relative p-2 text-black hover:text-[#E79489] transition-colors"
          >
            <CartIcon className="w-5 h-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E79489] px-1 font-body text-[10px] leading-none text-black">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative z-10 p-2 text-black"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`block w-5 h-px bg-current transition-transform duration-300 ease-out ${
                open ? 'translate-y-[5px] rotate-45' : 'mb-1'
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-200 ease-out ${
                open ? 'w-5 opacity-0' : 'w-5 mb-1 opacity-100'
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ease-out ${
                open ? 'w-5 -translate-y-[5px] -rotate-45' : 'w-3'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        inert={open ? undefined : true}
      >
        <div className="overflow-hidden">
          <div
            className={`bg-white border-t border-black/10 px-6 py-4 flex flex-col gap-4 transition-opacity duration-200 ${
              open ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`border-l-2 pl-3 font-body text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? 'border-[#E79489] text-[#E79489]'
                      : 'border-transparent text-black'
                  }`}
                  onClick={handleNavClick}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/1ms"
              aria-current={isActiveLink('/1ms') ? 'page' : undefined}
              className={`inline-flex items-center justify-center px-5 py-2 text-xs tracking-widest uppercase font-body font-medium ${
                isActiveLink('/1ms')
                  ? 'bg-[#E79489] text-black'
                  : 'bg-black text-white'
              }`}
              onClick={() => setOpen(false)}
            >
              Shop
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
