import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pink Fleur Foundation',
  description:
    'The Pink Fleur Foundation is the social impact arm of Pink Fleur, equipping women with the knowledge, resources, and support they need to thrive.',
}

const pillars = [
  {
    title: 'Financial Empowerment',
    body: 'We equip women with practical financial knowledge and skills to help them build wealth, make informed financial decisions, and achieve long-term financial security.',
  },
  {
    title: 'Entrepreneurship & Leadership',
    body: 'We create opportunities for women to develop businesses, strengthen leadership capacity, and access networks that support sustainable growth.',
  },
  {
    title: 'Storytelling for Social Change',
    body: "We believe stories have the power to heal, inspire, and mobilize action. Through ethical storytelling, we amplify women's voices while connecting communities to meaningful opportunities for impact.",
  },
]

const moneyResetFocus = ['Personal Finance', 'Wealth Building', 'Investing', 'Business Growth', 'Financial Confidence']

const oneMSSteps = [
  'Purchase a Pink Fleur scarf under the 1MS campaign',
  'Read the story of the woman connected to your purchase.',
  'Know that your purchase is contributing to meaningful impact.',
]

const sunriseFocus = ['Entrepreneurship', 'Leadership', 'Community Building', 'Personal Development', 'Capacity Building']

export default function ImpactPage() {
  return (
    <main className="pt-16">
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
            Pink Fleur Foundation
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-black mb-8 max-w-3xl leading-tight">
            The social impact arm of Pink Fleur.
          </h1>
          <div className="max-w-3xl space-y-6 font-body text-base text-black/70 leading-relaxed">
            <p>
              The Pink Fleur Foundation (PFF) is the social impact arm of Pink Fleur. Established to extend the brand&apos;s purpose beyond fashion, the Foundation designs and delivers initiatives that equip women with the knowledge, resources, and support they need to thrive.
            </p>
            <p>
              By combining storytelling, education, entrepreneurship, and strategic partnerships, we are building a future where every woman has the opportunity to reach her full potential.
            </p>
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
              To build a world where women are empowered to live with confidence, financial independence, and purpose.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Mission
            </p>
            <p className="font-display text-2xl md:text-3xl leading-snug">
              To empower women through financial literacy, entrepreneurship, storytelling, and community-driven initiatives that create sustainable social impact across Africa and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-16 font-body font-medium">
            What We Do
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="font-display text-3xl text-black mb-6">{pillar.title}</h3>
                <p className="font-body text-sm text-black/60 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Money Reset */}
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Initiatives
            </p>
            <h2 className="font-display text-4xl text-black mb-6">The Money Reset</h2>
            <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
              <p>
                Money Reset is Pink Fleur Foundation&apos;s flagship financial empowerment initiative designed to help women build healthier relationships with money.
              </p>
              <p>
                Through masterclasses, workshops, practical tools, and expert-led conversations, participants learn how to budget, save, invest, build businesses, and create lasting financial stability.
              </p>
            </div>
          </div>
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Focus Areas</p>
            <div className="flex flex-col">
              {moneyResetFocus.map((area) => (
                <p key={area} className="border-b border-black/10 py-3 font-body text-sm text-black/70">
                  {area}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The One Million Scarves Campaign */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Initiatives
            </p>
            <h2 className="font-display text-4xl mb-6">The One Million Scarves Campaign</h2>
            <div className="space-y-6 font-body text-base text-white/70 leading-relaxed">
              <p>
                The One Million Scarves (1MS) Campaign is Pink Fleur Foundation&apos;s flagship storytelling and impact initiative. Every scarf purchased represents a woman&apos;s story. Each scarf is connected to the story of a woman whose journey reflects courage, resilience, hope, and determination. Customers can discover her story and see how their purchase contributes to creating new opportunities for women and girls.
              </p>
              <p>
                Our long term vision is to sell one million scarves while building one of Africa&apos;s largest archives of women&apos;s stories and funding life changing interventions across communities.
              </p>
            </div>
            <Link
              href="/1ms"
              className="mt-8 inline-flex items-center justify-center bg-[#E79489] px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-black transition-colors hover:bg-white"
            >
              Explore the 1MS Movement
            </Link>
          </div>
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">How It Works</p>
            <div className="flex flex-col gap-6">
              {oneMSSteps.map((step, index) => (
                <div key={step} className="flex gap-5 items-start">
                  <span className="font-display text-3xl text-white/25 leading-none shrink-0">0{index + 1}</span>
                  <p className="font-body text-sm text-white/75 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Sunrise Ladies */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
              Our Initiatives
            </p>
            <h2 className="font-display text-4xl text-black mb-6">The Sunrise Ladies</h2>
            <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
              <p>
                The Sunrise Ladies is a community that supports women in becoming the fullest expression of themselves through learning, mentorship, and entrepreneurship.
              </p>
              <p>
                The initiative creates spaces for women to connect, learn practical skills, build meaningful relationships, and access opportunities that foster personal and professional growth.
              </p>
            </div>
          </div>
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Focus Areas</p>
            <div className="flex flex-col">
              {sunriseFocus.map((area) => (
                <p key={area} className="border-b border-[#E79489]/20 py-3 font-body text-sm text-black/70">
                  {area}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
            Support the Foundation
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-black mb-6">
            Not ready to buy a scarf?
          </h2>
          <p className="font-body text-base text-black/70 max-w-md mx-auto mb-10 leading-relaxed">
            You can also support the movement directly through a donation. Every contribution goes toward funding the women in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?subject=Donation"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-xs tracking-widest uppercase font-body font-medium hover:bg-[#E79489] hover:text-black transition-colors"
            >
              Get in touch to donate
            </Link>
            <Link
              href="/1ms"
              className="inline-flex items-center justify-center px-8 py-4 border border-black text-black text-xs tracking-widest uppercase font-body font-medium hover:bg-black hover:text-white transition-colors"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
