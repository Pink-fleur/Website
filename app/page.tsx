import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import OneMSTeaser from '@/components/home/OneMSTeaser'
import FeaturedInMarquee from '@/components/home/FeaturedInMarquee'

export const metadata: Metadata = {
  title: 'Pink Fleur',
  description:
    'Pink Fleur is a premium womenswear brand offering elegantly styled modest ready to wear womenswear and other companion pieces designed for the modern, sophisticated woman.',
}

const featuredCollections = [
  {
    title: 'Shirts',
    image: '/new-shirts.jpeg',
  },
  {
    title: 'Dresses',
    image: '/dress.jpeg',
  },
  {
    title: 'Scarves',
    image: '/images/scarf-mocks/new1.png',
  },
  {
    title: 'Ready-to-Wear',
    image: '/read-to-wear.jpeg',
  },
]

export default function Home() {
  return (
    <main>
      <section className="relative min-h-screen overflow-hidden bg-black pt-16">
        <Image
          src="/new-hero-image.JPG"
          alt="Pink Fleur"
          fill
          priority
          className="object-cover object-[50%_25%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black from-[26%] via-black/68 via-[56%] to-transparent to-[82%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-6 font-body text-xs font-medium uppercase tracking-[0.3em] text-[#E79489]">
              Pink Fleur
            </p>
            <h1 className="mb-8 font-display text-5xl leading-[0.95] text-white md:text-7xl">
              Timeless Fashion.<br />
              <em>Purposefully Crafted.</em>
            </h1>
            <div className="max-w-xl space-y-5 font-body text-base leading-relaxed text-white/78 md:text-lg">
              <p>
                Pink Fleur is a premium womenswear brand offering elegantly styled modest ready to wear womenswear and other companion pieces (scarves, handbags, and accessories) designed for the modern, sophisticated woman.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#featured-collections"
                className="inline-flex items-center justify-center bg-[#E79489] px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-black transition-colors hover:bg-white"
              >
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-white/55 px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-collections" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-[#E79489]">
              Featured Collections
            </p>
            <Link
              href="/shop"
              className="inline-flex self-start items-center justify-center bg-black px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#E79489] hover:text-black md:self-auto"
            >
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.title}
                href={`/shop?category=${encodeURIComponent(collection.title)}`}
                className="group block"
              >
                <article>
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-[#F8E8E5]">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-display text-2xl leading-tight text-black transition-colors group-hover:text-[#E79489]">
                    {collection.title}
                  </h3>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OneMSTeaser />

      <FeaturedInMarquee />
    </main>
  )
}
