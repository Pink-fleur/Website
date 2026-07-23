import { cityPins } from '@/lib/brand'

export default function GlobalPresenceStrip() {
  return (
    <section className="py-8 bg-[#0C0D31] overflow-hidden">
      <div className="flex items-center gap-0 animate-none">
        <div className="flex items-center gap-8 px-6 flex-wrap justify-center w-full">
          <p className="text-xs tracking-[0.3em] uppercase text-[#FEFDE4]/40 shrink-0 font-body">
            Global Reach
          </p>
          {cityPins.map((city) => (
            <span key={city} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#F8E8E5]" />
              <span className="font-body text-xs tracking-widest uppercase text-[#FEFDE4]/70">
                {city}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
