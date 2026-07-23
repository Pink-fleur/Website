import Image from 'next/image'

export const featuredLogos = [
  { name: 'ESSENCE Magazine', src: '/images/press/essence.png', width: 160, height: 58 },
  { name: 'Netflix', src: '/images/press/netflix.png', width: 140, height: 45 },
  { name: 'Amazon Prime', src: '/images/press/amazon.png', width: 150, height: 45 },
  { name: 'DSTV', src: '/images/press/dstv.png', width: 110, height: 45 },
  { name: 'Pure London', src: '/images/press/pure-logo.webp', width: 150, height: 55 },
]

const track = [...featuredLogos, ...featuredLogos]

export default function LogoMarquee() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-20 hover:[animation-play-state:paused]">
        {track.map((brand, i) => (
          <div key={`${brand.name}-${i}`} className="flex shrink-0 items-center justify-center">
            <Image
              src={brand.src}
              alt={brand.name}
              width={brand.width}
              height={brand.height}
              className="h-9 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-11"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
