import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Cookie Policy — Pink Fleur Foundation' }
export default function CookiesPage() {
  return (
    <main className="pt-16">
      <section className="py-16 bg-white max-w-3xl mx-auto px-6">
        <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Legal</p>
        <h1 className="font-display text-4xl text-black mb-8">Cookie Policy</h1>
        <p className="font-body text-xs text-black/40 mb-10">Last updated: June 2026</p>
        <div className="font-body text-sm text-black/70 leading-relaxed space-y-6">
          <p>This website uses a minimal set of cookies necessary for the shopping cart to function.</p>
          <h2 className="font-display text-2xl text-black">Essential Cookies</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="font-medium">Shopify session cookie</strong> — maintains your shopping cart between page loads. Required for purchase functionality. Duration: session.</li>
          </ul>
          <h2 className="font-display text-2xl text-black mt-8">Analytics</h2>
          <p>If analytics are enabled, anonymous usage data may be collected to help us improve the site. No personally identifiable information is collected in analytics.</p>
          <h2 className="font-display text-2xl text-black mt-8">How to opt out</h2>
          <p>You can disable cookies in your browser settings. Note that disabling essential cookies will prevent the shopping cart from working correctly.</p>
        </div>
      </section>
    </main>
  )
}
