'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const revealSelector = [
  'main > section',
  'main article',
  'main form',
  'main .grid > *',
  'main [class*="columns-"] > *',
  'footer > div > *',
].join(',')

export default function ScrollEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>(revealSelector))

    root.classList.add('motion-enhanced')

    targets.forEach((target, index) => {
      target.classList.add('reveal-on-scroll')
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`)
    })

    const cleanup = () => {
      targets.forEach((target) => {
        target.classList.remove('reveal-on-scroll', 'is-visible')
        target.style.removeProperty('--reveal-delay')
      })
      root.classList.remove('motion-enhanced')
    }

    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return cleanup
    }

    const reveal = (target: HTMLElement) => target.classList.add('is-visible')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      }
    )

    targets.forEach((target) => {
      // Reveal anything already on screen immediately instead of waiting on
      // the observer's first (async) callback — on some mobile browsers that
      // callback can be delayed until the next touch/click, which left
      // above-the-fold content (e.g. the shop grid) invisible until tapped.
      const rect = target.getBoundingClientRect()
      const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0
      if (alreadyInView) {
        reveal(target)
        return
      }
      observer.observe(target)
    })

    // Safety net: never let content stay invisible indefinitely if the
    // observer never fires for some reason.
    const failsafe = window.setTimeout(() => {
      targets.forEach(reveal)
    }, 1500)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
      cleanup()
    }
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(window.scrollY / scrollHeight, 1) : 0
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      root.style.removeProperty('--scroll-progress')
    }
  }, [pathname])

  return <div className="scroll-progress" aria-hidden="true" />
}
