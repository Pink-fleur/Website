import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { InstagramIcon, MailIcon, PhoneIcon, YouTubeIcon } from '@/components/icons/SocialIcons'

export const metadata: Metadata = {
  title: 'Contact — Pink Fleur Foundation',
  description: 'Get in touch with Pink Fleur Foundation for partner enquiries, press, purchases, or general questions.',
}

const contactLinks = [
  { label: 'Email', value: 'info@mypinkfleur.com', href: 'mailto:info@mypinkfleur.com', Icon: MailIcon },
  { label: 'Phone', value: '+234 818 041 0119', href: 'tel:+2348180410119', Icon: PhoneIcon },
  { label: 'Instagram', value: '@pinkfleur', href: 'https://www.instagram.com/pinkfleur?utm_source=qr', Icon: InstagramIcon },
  { label: 'YouTube', value: '@PinkFleurFoundation', href: 'https://www.youtube.com/@PinkFleurFoundation', Icon: YouTubeIcon },
  { label: 'Newsletter', value: 'Subscribe to our newsletter', href: 'http://eepurl.com/iLR6sY', Icon: MailIcon },
]

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#E79489] mb-6 font-body font-medium">
                Get in touch
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-black mb-8">Contact</h1>
              <p className="font-body text-base text-black/60 leading-relaxed mb-12 max-w-md">
                Whether you&apos;re a potential partner, press, or simply want to learn more — we&apos;d love to hear from you.
              </p>

              <div className="flex flex-col gap-6">
                {contactLinks.map(({ label, value, href, Icon }) => (
                  <div key={label}>
                    <p className="font-body text-xs tracking-widest uppercase text-black/40 mb-2">{label}</p>
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-2 font-body text-sm text-black hover:text-[#E79489] transition-colors"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
