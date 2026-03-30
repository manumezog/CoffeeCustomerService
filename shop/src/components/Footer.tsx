import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-roast text-amber-100/70">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand */}
          <div>
            <p className="text-xl font-heading font-bold text-amber-100 mb-2">Ember & Roast</p>
            <p className="text-sm mb-4">Small batch. Big flavor.</p>
            <p className="text-xs">Specialty coffee roasted fresh to order.</p>
          </div>

          {/* Col 2: Shop links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/50 mb-4">Shop</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
                >
                  Coffee
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/50 mb-4">Support</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
                >
                  Call Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@emberandroast.com"
                  className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
                >
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-amber-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-100/50">
          <span>Roasted with care, served with pride.</span>
          <span>© 2025 Ember & Roast</span>
        </div>
      </div>
    </footer>
  )
}
