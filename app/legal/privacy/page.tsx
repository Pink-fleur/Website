import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — Pink Fleur Foundation' }

export default function PrivacyPage() {
  return (
    <main className="pt-16">
      <section className="py-16 bg-white max-w-3xl mx-auto px-6">
        <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Legal</p>
        <h1 className="font-display text-4xl text-black mb-8">Privacy Policy</h1>
        <p className="font-body text-xs text-black/40 mb-10">Last updated: June 2026</p>
        <div className="prose prose-sm max-w-none font-body text-black/70 leading-relaxed space-y-6">
          <p>Pink Fleur Foundation (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data. This policy explains what data we collect, why, and your rights under UK GDPR and the Data Protection Act 2018.</p>
          <h2 className="font-display text-2xl text-black mt-8">Data we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Order data (name, email, shipping address) — collected and processed by Shopify when you purchase a scarf.</li>
            <li>Contact form submissions (name, email, message) — stored temporarily for the purpose of responding to your enquiry.</li>
            <li>Beneficiary data (name, story, photo) — collected and managed by the PAGED Initiative with explicit written consent. Only published with pagedVerified consent confirmed.</li>
          </ul>
          <h2 className="font-display text-2xl text-black mt-8">Your rights</h2>
          <p>Under UK GDPR, you have the right to access, correct, or delete your personal data. To exercise these rights, contact us via the Contact page.</p>
          <h2 className="font-display text-2xl text-black mt-8">Shopify</h2>
          <p>Payment and order processing is handled by Shopify Inc. Their privacy policy applies to all transaction data. No payment card data is processed by this website.</p>
          <h2 className="font-display text-2xl text-black mt-8">Cookies</h2>
          <p>We use session cookies required for the shopping cart. See our Cookie Policy for details.</p>
          <h2 className="font-display text-2xl text-black mt-8">Contact</h2>
          <p>For data protection enquiries, please use the Contact form on this website.</p>
        </div>
      </section>
    </main>
  )
}
