import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="bg-roast text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight hover:text-amber-200 transition">
        Ember & Roast
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/products" className="hover:text-amber-200 transition">
          Shop
        </Link>
        <Link href="/orders" className="hover:text-amber-200 transition">
          Track Order
        </Link>
        <Link href="/admin" className="bg-ember hover:bg-orange-700 px-3 py-1.5 rounded transition text-xs font-semibold">
          Admin
        </Link>
      </div>
    </nav>
  )
}
