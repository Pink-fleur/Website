import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Shipping Policy — Pink Fleur Foundation' }
export default function ShippingPage() {
  return (
    <main className="pt-16">
      <section className="py-16 bg-white max-w-3xl mx-auto px-6">
        <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Legal</p>
        <h1 className="font-display text-4xl text-black mb-8">Shipping Policy</h1>
        <p className="font-body text-xs text-black/40 mb-10">Last updated: June 2026</p>
        <div className="font-body text-sm text-black/70 leading-relaxed space-y-6">
          <h2 className="font-display text-2xl text-black">Dispatch</h2>
          <p>Orders are dispatched within 3–5 working days of payment confirmation. You will receive a tracking notification by email once your order has shipped.</p>
          <h2 className="font-display text-2xl text-black mt-8">Delivery Estimates</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>United Kingdom: 3–5 working days</li>
            <li>Europe: 5–10 working days</li>
            <li>Nigeria and West Africa: 7–14 working days</li>
            <li>Rest of World: 10–21 working days</li>
          </ul>
          <p className="text-xs text-black/40">Delivery estimates are indicative. International deliveries may be subject to customs clearance delays outside our control.</p>
          <h2 className="font-display text-2xl text-black mt-8">Shipping Costs</h2>
          <p>Shipping costs are calculated at checkout based on your location and order weight.</p>
          <h2 className="font-display text-2xl text-black mt-8">Contact</h2>
          <p>For shipping enquiries, please contact us via the Contact page.</p>
        </div>
      </section>
    </main>
  )
}
