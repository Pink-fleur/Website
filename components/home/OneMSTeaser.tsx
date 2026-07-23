import Link from 'next/link'
import Image from 'next/image'

export default function OneMSTeaser() {
  return (
    <section className="bg-[#F8E8E5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Image side */}
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden">
          <Image
            src="/images/collections/DSC_2187.jpeg"
            alt="One Million Scarves — Pink Fleur"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#0C0D31]/20" />
          <div className="absolute bottom-8 left-8">
            <span className="font-display text-6xl font-bold text-[#FEFDE4]/30 select-none">1MS</span>
          </div>
        </div>

        {/* Content side */}
        <div className="px-10 py-16 md:py-24 flex flex-col justify-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#47326B] mb-6 font-body font-medium">
            What is 1MS?
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-[#47326B] leading-[0.95] mb-8">
            One Million Scarves<br />
            <em>by Pink Fleur</em>
          </h2>
          <p className="font-body text-base text-[#0C0D31]/70 leading-relaxed mb-10">
            1MS is more than a scarf collection. It is a purpose-led movement where story and purchase create impact. Every scarf funds a named woman in an underserved community — connecting buyer and beneficiary through art.
          </p>
          <Link
            href="/1ms"
            className="inline-flex self-start items-center justify-center px-8 py-4 bg-[#0C0D31] text-[#FEFDE4] text-xs tracking-widest uppercase font-body font-medium hover:bg-[#47326B] transition-colors"
          >
            Discover the Movement
          </Link>
        </div>
      </div>
    </section>
  )
}
