import Link from 'next/link'
import Image from 'next/image'
import { InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, YouTubeIcon } from '@/components/icons/SocialIcons'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/1ms' },
  { label: 'Pink Fleur Foundation', href: '/impact' },
  { label: 'Our Founder', href: '/founder' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Shipping', href: '/legal/shipping' },
  { label: 'Returns', href: '/legal/returns' },
  { label: 'Cookies', href: '/legal/cookies' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/pinkfleur?utm_source=qr', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@PinkFleurFoundation', Icon: YouTubeIcon },
  { label: 'Newsletter', href: 'http://eepurl.com/iLR6sY', Icon: MailIcon },
]

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-black/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo-new.png"
              alt="Pink Fleur"
              width={160}
              height={107}
              className="h-16 w-auto self-start object-contain md:h-20"
            />
            <p className="text-sm text-black/60 leading-relaxed max-w-xs">
              Pink Fleur is a premium fashion brand dedicated to creating timeless, modest fashion for women who value elegance, confidence, and intentional living.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="mailto:info@mypinkfleur.com"
                className="flex items-center gap-2 text-sm text-black/70 hover:text-[#E79489] transition-colors"
              >
                <MailIcon className="h-4 w-4 shrink-0" />
                info@mypinkfleur.com
              </a>
              <a
                href="tel:+2348180410119"
                className="flex items-center gap-2 text-sm text-black/70 hover:text-[#E79489] transition-colors"
              >
                <PhoneIcon className="h-4 w-4 shrink-0" />
                +234 818 041 0119
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs tracking-widest uppercase text-black/40 mb-4">Explore</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/70 hover:text-[#E79489] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs tracking-widest uppercase text-black/40 mb-4">Social Media</p>
            <div className="flex flex-row gap-5 md:flex-col md:gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 text-black/70 hover:text-[#E79489] transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden md:inline text-sm">{label}</span>
                </a>
              ))}
              <span aria-label="LinkedIn" className="flex items-center gap-2 text-black/40">
                <LinkedInIcon className="h-5 w-5 shrink-0" />
                <span className="hidden md:inline text-sm">LinkedIn</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} Pink Fleur Foundation. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-black/40 hover:text-black/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
