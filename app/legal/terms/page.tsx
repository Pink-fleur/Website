import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Terms & Conditions — Pink Fleur Foundation' }
export default function TermsPage() {
  return (
    <main className="pt-16">
      <section className="py-16 bg-white max-w-3xl mx-auto px-6">
        <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Legal</p>
        <h1 className="font-display text-4xl text-black mb-8">Terms &amp; Conditions</h1>
        <p className="font-body text-xs text-black/40 mb-10">Last updated: June 2026</p>
        <div className="font-body text-sm text-black/70 leading-relaxed space-y-6">
          <p>By purchasing from Pink Fleur Foundation via the 1MS collection, you agree to these terms.</p>
          <h2 className="font-display text-2xl text-black mt-8">Purchases</h2>
          <p>All sales are processed through Shopify. Prices are displayed inclusive of applicable taxes. Pink Fleur Foundation reserves the right to refuse any order.</p>
          <h2 className="font-display text-2xl text-black mt-8">Beneficiary Selection</h2>
          <p>The beneficiary you select at checkout is indicative. Pink Fleur Foundation and PAGED Initiative will make every reasonable effort to direct funds to your chosen beneficiary. Final allocation may vary based on operational needs.</p>
          <h2 className="font-display text-2xl text-black mt-8">Cancellation Rights</h2>
          <p>Under the UK Consumer Contracts Regulations 2013, you have the right to cancel your order within 14 days of receiving your goods without giving any reason. See our Returns Policy for details.</p>
          <h2 className="font-display text-2xl text-black mt-8">Limitation of Liability</h2>
          <p>Pink Fleur Foundation is not liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of products.</p>
        </div>
      </section>
    </main>
  )
}
