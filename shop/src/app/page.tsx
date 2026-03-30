import CallButton from '@/components/CallButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-roast to-amber-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">Ember & Roast</h1>
        <p className="text-xl text-amber-100 mb-4">Premium Specialty Coffee, Roasted Fresh</p>
        <p className="text-amber-200 mb-10 max-w-xl">
          Questions about your order? Need a recommendation? Our AI coffee concierge is available
          24/7 — by voice, chat, or email.
        </p>

        <div className="flex flex-wrap gap-4 mb-16">
          <a
            href="/products"
            className="bg-ember hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Coffee
          </a>
          <a
            href="/orders"
            className="bg-amber-700 hover:bg-amber-800 px-6 py-3 rounded-lg font-semibold transition"
          >
            Track Order
          </a>
        </div>

        {/* Voice CS — the showstopper */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-bold mb-2">Need Help?</h2>
          <p className="text-amber-200 text-sm mb-6">
            Talk to our AI barista — she knows your orders, our policies, and every bean we roast.
          </p>
          <CallButton />
          <p className="text-amber-300 text-xs mt-4">
            Or chat using the widget below ↘
          </p>
        </div>
      </div>
    </main>
  )
}
