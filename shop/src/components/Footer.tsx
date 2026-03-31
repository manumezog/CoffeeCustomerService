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
                  href="mailto:support@mezapps.com"
                  className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
                >
                  support@mezapps.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-amber-900">
        {/* Row 1: Brand tagline + copyright */}
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-100/50">
          <span>Roasted with care, served with pride.</span>
          <span>© 2026 Ember &amp; Roast</span>
        </div>

        {/* Row 2: Developer credit */}
        <div className="border-t border-amber-900/40">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-100/40">
            <span>Developed by Manuel Mezo as a demo in March 2026.</span>
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a
                href="https://github.com/manumezog"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Manuel Mezo on GitHub"
                className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/manuelmezo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Manuel Mezo on LinkedIn"
                className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:manumezog@gmail.com"
                aria-label="Email Manuel Mezo"
                className="hover:text-amber-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-roast rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
