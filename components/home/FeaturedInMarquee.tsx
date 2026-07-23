import LogoMarquee from '@/components/shared/LogoMarquee'

export default function FeaturedInMarquee() {
  return (
    <section className="bg-[#F8E8E5] py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-10 font-body text-xs font-medium uppercase tracking-[0.3em] text-[#E79489]">
          Featured In
        </p>
      </div>

      <LogoMarquee />
    </section>
  )
}
