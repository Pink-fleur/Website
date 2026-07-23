import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Returns & Refunds — Pink Fleur Foundation' }
export default function ReturnsPage() {
  return (
    <main className="pt-16">
      <section className="py-16 bg-white max-w-3xl mx-auto px-6">
        <p className="font-body text-xs tracking-widest uppercase text-[#E79489] mb-4">Legal</p>
        <h1 className="font-display text-4xl text-black mb-8">Returns &amp; Refunds</h1>
        <p className="font-body text-xs text-black/40 mb-10">Last updated: June 2026</p>
        <div className="font-body text-sm text-black/70 leading-relaxed space-y-6">
          <h2 className="font-display text-2xl text-black">Returns</h2>
          <p>You may return unworn, unwashed items in original packaging within 14 days of receipt. To initiate a return, contact us via the Contact page with your order number.</p>
          <h2 className="font-display text-2xl text-black mt-8">Refunds</h2>
          <p>Once we receive and inspect your return, we will process a refund to your original payment method within 10 working days. Original shipping costs are non-refundable unless the item is faulty.</p>
          <h2 className="font-display text-2xl text-black mt-8">Faulty Items</h2>
          <p>If your scarf arrives damaged or faulty, please contact us within 48 hours of receipt with photos. We will arrange a replacement or full refund including shipping.</p>
          <h2 className="font-display text-2xl text-black mt-8">Impact Proceeds</h2>
          <p>Please note: the beneficiary support element of your purchase is non-refundable regardless of whether the product is returned. This portion is transferred to PAGED Initiative upon order confirmation.</p>
        </div>
      </section>
    </main>
  )
}
