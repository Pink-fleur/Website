import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Our Founder — Pink Fleur',
  description:
    'Meet Zainab Salihijo, Founder and Creative Director of Pink Fleur — building a globally respected African fashion brand rooted in elegance, purpose, and legacy.',
}

const areasOfFocus = [
  {
    title: 'Fashion',
    body: 'Building Pink Fleur into a globally recognised premium African fashion brand.',
  },
  {
    title: 'Financial Empowerment',
    body: "Helping women develop healthy relationships with money through education and practical tools.",
  },
  {
    title: "Women's Leadership",
    body: 'Creating platforms that equip women to lead with confidence, purpose, and excellence.',
  },
  {
    title: 'Social Impact',
    body: 'Designing sustainable initiatives that improve lives through education, entrepreneurship, and community partnerships.',
  },
]

const leadershipRoles = [
  {
    name: 'Salihijo Ahmad Foundation',
    body: 'Advancing access to quality education for orphans and underserved communities.',
  },
  {
    name: 'FlexiSAF Foundation',
    body: 'Supporting initiatives that help bridge the education gap for out-of-school children across Nigeria.',
  },
]

export default function FounderPage() {
  return (
    <main className="pt-16">
      {/* Meet the Founder */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
            Meet the Founder
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="aspect-[3/4] relative overflow-hidden order-2 md:order-1">
              <Image
                src="/images/new-founder.jpeg"
                alt="Zainab Salihijo — Founder, Pink Fleur"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <h1 className="font-display text-5xl md:text-6xl text-black leading-tight mb-8">
                Zainab<br />Salihijo
              </h1>
              <p className="font-display text-2xl text-[#E79489] leading-snug mb-8">
                &ldquo;I believe businesses should do more than generate profit. They should solve real problems, create opportunities, and leave people better than they found them.&rdquo;
              </p>
              <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
                <p>That belief has shaped every chapter of my journey.</p>
                <p>
                  As the Founder and Creative Director of Pink Fleur, I am building a globally respected African fashion brand rooted in elegance, purpose, and legacy. Through timeless elegantly styled modest fashion, we celebrate women who lead with confidence, strength, and authenticity. Every collection is designed to reflect not just beauty but identity.
                </p>
                <p>
                  Beyond fashion, I am passionate about helping women build lives of financial confidence and intentional growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Money Series & Foundation */}
      <section className="py-24 bg-[#F8E8E5]">
        <div className="max-w-7xl mx-auto px-6 max-w-3xl">
          <div className="space-y-6 font-body text-base text-black/70 leading-relaxed">
            <p>
              I founded My Money Series to create safe, practical, and empowering conversations around money. For too long, many women have been taught to avoid financial discussions or leave important decisions to others. Through workshops, courses, and community, we are helping women rewrite their financial stories with clarity, faith, and confidence.
            </p>
            <p>
              My commitment to women extends through the Pink Fleur Foundation, where we invest in mentorship, entrepreneurship, financial empowerment, and storytelling initiatives that restore dignity and expand opportunity.
            </p>
            <p>I also serve in leadership roles across two philanthropic organisations:</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {leadershipRoles.map((role) => (
              <div key={role.name} className="border-l-2 border-[#E79489]/50 pl-5">
                <p className="font-display text-xl text-black mb-2">{role.name}</p>
                <p className="font-body text-sm text-black/60 leading-relaxed">{role.body}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 font-body text-base text-black/70 leading-relaxed mt-10">
            <p>
              As a Harvard-trained entrepreneur, my work sits at the intersection of business, leadership, and social impact. Whether I am designing a collection, mentoring entrepreneurs, speaking on financial empowerment, or building partnerships, my focus remains the same:
            </p>
            <p className="font-display text-2xl text-black leading-snug">
              To build institutions that outlive me and create opportunities that transform lives.
            </p>
          </div>
        </div>
      </section>

      {/* My Philosophy */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-8 font-body font-medium">
            My Philosophy
          </p>
          <div className="space-y-6 font-body text-base text-white/72 leading-relaxed">
            <p>
              I believe that true success is measured not only by what we build, but by the lives we empower along the way. Fashion can restore confidence. Financial knowledge can create freedom.
            </p>
            <p>
              Purpose can transform generations. When these come together, women don&apos;t just succeed—they lead, influence, and leave legacies.
            </p>
          </div>
        </div>
      </section>

      {/* Areas of Focus */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-16 font-body font-medium">
            Areas of Focus
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {areasOfFocus.map((area) => (
              <div key={area.title}>
                <h3 className="font-display text-2xl text-black mb-4">{area.title}</h3>
                <p className="font-body text-sm text-black/60 leading-relaxed">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Note from Zainab */}
      <section className="py-24 bg-[#E79489]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-black/60 mb-8 font-body font-medium">
            A Note from Zainab
          </p>
          <p className="font-display text-2xl md:text-3xl text-black leading-snug">
            &ldquo;I don&apos;t simply want to build beautiful products. I want to build meaningful institutions. My hope is that every woman who encounters our work—whether through a garment, a conversation about money, or one of our foundation initiatives—walks away believing more deeply in her own potential. That is the legacy I hope to leave.&rdquo;
          </p>
        </div>
      </section>
    </main>
  )
}
