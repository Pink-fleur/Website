import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import LogoMarquee from '@/components/shared/LogoMarquee'

export const metadata: Metadata = {
  title: 'About Us — Pink Fleur',
  description:
    'Pink Fleur is a premium fashion brand dedicated to creating timeless, modest fashion for women who value elegance, confidence, and intentional living.',
}

const values = [
  {
    title: 'Timeless Excellence',
    body: 'We create pieces that transcend seasons and trends, focusing on enduring quality and thoughtful craftsmanship.',
  },
  {
    title: 'Purpose',
    body: 'Every collection, partnership, and initiative is guided by the belief that business should create value beyond profit.',
  },
  {
    title: 'Authenticity',
    body: 'We remain rooted in our identity while embracing innovation and global relevance.',
  },
  {
    title: 'Craftsmanship',
    body: 'Attention to detail, premium finishes, and excellence in execution define everything we produce.',
  },
  {
    title: 'Empowerment',
    body: 'We design for women who lead, create, nurture, and inspire. Our work celebrates their journeys and supports their growth.',
  },
]

const notableWomen = [
  'Kate Henshaw',
  'Rahama Sadau',
  'Sophie Alakija',
  'Bolanle Olukanni',
  'Nkiru Anumudu',
  'Anita Okoye',
  'Halima Dangote',
]

export default function AboutPage() {
  return (
    <main className="pt-16">
      {/* About Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
                About Us
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-black leading-tight mb-8">
                Pink Fleur
              </h1>
              <p className="font-body text-base text-black/70 leading-relaxed mb-6">
                Pink Fleur is a premium fashion brand dedicated to creating timeless, modest fashion for women who value elegance, confidence, and intentional living. Founded by Zainab Salihijo, the brand exists at the intersection of exceptional design, meaningful storytelling, and social impact.
              </p>
              <p className="font-body text-base text-black/70 leading-relaxed mb-6">
                Since its inception, Pink Fleur has grown from a vision to redefine modest fashion into an internationally recognized brand, serving customers across more than 38 countries. Every outfit is thoughtfully designed to celebrate the modern woman while honoring craftsmanship, quality, and authenticity.
              </p>
              <p className="font-body text-base text-black/70 leading-relaxed">
                For us, fashion is a language of identity, confidence, and culture. Every collection is created to help women feel seen, empowered, and beautifully themselves.
              </p>
            </div>

            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src="/about-us.jpeg"
                alt="Pink Fleur"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-black mb-8">
              A story of elegance and authenticity.
            </h2>
            <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
              <p>
                Pink Fleur was born from a simple belief: women should never have to choose between elegance and authenticity. What began as a passion for creating beautiful, modest clothing has evolved into a global fashion brand recognized for timeless design, premium craftsmanship, and meaningful impact.
              </p>
              <p>
                Over the years, Pink Fleur has dressed influential women, collaborated with leading creatives, and expanded its reach far beyond Nigeria. Our pieces have been worn by celebrities, featured in international publications, showcased on global runways, and appeared in major film productions.
              </p>
              <p>
                Yet, our greatest achievement is not where our designs have been seen—it is the confidence they inspire in the women who wear them. Today, Pink Fleur continues to design with the same philosophy that inspired its beginning: creating clothing that outlives trends and becomes part of a woman&apos;s story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Vision
            </p>
            <p className="font-display text-2xl md:text-3xl leading-snug">
              To become Africa&apos;s leading premium fashion house, globally recognized for timeless design, cultural excellence, and transformational impact.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Mission
            </p>
            <p className="font-display text-2xl md:text-3xl leading-snug">
              To create exceptional fashion that empowers women to express confidence, elegance, and authenticity while building a lasting legacy through creativity, innovation, and social impact.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-16 font-body font-medium">
            Our Values
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="font-display text-3xl text-black mb-6">{value.title}</h3>
                <p className="font-body text-sm text-black/60 leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Brand */}
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
              A Global Brand
            </p>
            <h2 className="font-display text-4xl text-black mb-6">
              From our studio in Nigeria, Pink Fleur has reached women around the world.
            </h2>
            <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
              <p>
                Today, our designs have been delivered to over 38 countries across Africa, Europe, North America, Asia, and Australia, reflecting the growing global appreciation for African fashion and craftsmanship.
              </p>
              <p>
                Our international journey has included participation in prestigious showcases such as Pure London, strategic partnerships with retailers and creatives, and recognition from global media.
              </p>
              <p>
                Whether worn in Lagos, London, Seoul, Paris, or New York, every Pink Fleur piece carries the same commitment to elegance, quality, and purpose.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src="/images/collections/DSC_2238.jpeg"
              alt="Pink Fleur — a global brand"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Recognition & Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
            Recognition &amp; Features
          </p>
          <div className="max-w-3xl mb-14">
            <h2 className="font-display text-4xl text-black mb-6">
              Telling Africa&apos;s story through fashion.
            </h2>
            <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
              <p>
                Pink Fleur has earned recognition across fashion, media, and entertainment, reflecting the brand&apos;s growing influence within Africa and beyond. Our work has been featured in ESSENCE Magazine, highlighting our contribution to contemporary African fashion.
              </p>
              <p>
                Our designs have also appeared in major productions on Netflix, Amazon Prime, and DSTV, including Sons of the Caliphate, Beyond the Veil, and The Rishantes.
              </p>
              <p>
                Over the years, Pink Fleur has had the privilege of dressing remarkable women, including {notableWomen.join(', ')}.
              </p>
              <p>
                These milestones affirm our commitment to excellence while inspiring us to continue telling Africa&apos;s story through fashion.
              </p>
            </div>
          </div>
          <div className="border-t border-black/10 pt-10">
            <LogoMarquee />
          </div>
        </div>
      </section>

      {/* Fashion with Impact */}
      <section className="py-24 bg-[#E79489] text-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-black/60 mb-4 font-body font-medium">
              Fashion with Impact
            </p>
            <h2 className="font-display text-4xl leading-tight">
              We believe fashion can do more than transform wardrobes—it can transform lives.
            </h2>
          </div>
          <div className="space-y-6 font-body text-base text-black/78 leading-relaxed">
            <p>
              At Pink Fleur, beautiful fashion and meaningful impact go hand in hand. Through the Pink Fleur Foundation, we extend our purpose beyond clothing by investing in women, communities, and future generations.
            </p>
            <p>
              Our initiatives include The Money Reset, equipping women with practical financial knowledge and confidence; The Sunrise Ladies, supporting women&apos;s personal and entrepreneurial growth; and The One Million Scarves Campaign, transforming scarves into symbols of hope by connecting every purchase to the story and empowerment of a woman.
            </p>
            <Link
              href="/impact"
              className="inline-flex items-center justify-center border border-black/50 px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
            >
              Explore the Foundation
            </Link>
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
            Looking Ahead
          </p>
          <p className="font-body text-base text-black/70 leading-relaxed mb-8">
            As Pink Fleur continues to grow, our commitment remains unchanged to build a globally respected fashion brand that creates timeless designs, empowers women, and leaves a legacy that extends far beyond the garments we create.
          </p>
          <p className="font-display text-2xl md:text-3xl text-black leading-snug">
            Every stitch tells a story. Every collection carries purpose. Every woman who wears Pink Fleur becomes part of our journey.
          </p>
        </div>
      </section>
    </main>
  )
}
