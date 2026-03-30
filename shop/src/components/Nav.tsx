'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/orders', label: 'Track Order' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const linkClass = (href: string) =>
    pathname === href
      ? 'text-amber-300 font-semibold transition'
      : 'text-white hover:text-amber-200 transition'

  return (
    <nav className="bg-roast text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-amber-200 transition"
        >
          Ember & Roast
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="bg-ember hover:bg-orange-700 px-3 py-1.5 rounded transition text-xs font-semibold"
          >
            Admin
          </Link>
        </div>

        {/* Hamburger button */}
        <button
          className="flex md:hidden items-center justify-center w-9 h-9 text-white"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-roast mt-2 -mx-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 px-6 border-b border-amber-900/40 text-sm ${linkClass(href)}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-6 border-b border-amber-900/40 text-sm text-white hover:text-amber-200 transition"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
