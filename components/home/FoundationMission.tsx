import Image from 'next/image'

const pillars = [
  {
    label: 'Art',
    description:
      'Photography that captures the world — from the green spaces of Abuja to sacred sites across the globe. Art as a lens for transformation.',
  },
  {
    label: 'Advocacy',
    description:
      'Championing creative industries as viable paths. Calling on governments to preserve green spaces and invest in the people who bring them to life.',
  },
  {
    label: 'Impact',
    description:
      "One Million Scarves — a movement where every purchase funds a named woman's journey from hardship toward hope. Story and commerce, united.",
  },
]

export default function FoundationMission() {
  return (
    <section className="bg-[#FEFDE4]">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
        {/* Image */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src="/images/collections/IMG_6241.JPG"
              alt="Green spaces — Pink Fleur Foundation photography"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-16 font-body font-medium">
            Our mandate
          </p>
          <div className="flex flex-col gap-14">
            {pillars.map((pillar, i) => (
              <div key={pillar.label} className="grid grid-cols-[3rem_1fr] gap-4 items-start">
                <span className="font-display text-xs text-[#0C0D31]/25 tracking-widest pt-1">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-4xl text-[#0C0D31] mb-4">{pillar.label}</h3>
                  <p className="font-body text-sm text-[#0C0D31]/60 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
