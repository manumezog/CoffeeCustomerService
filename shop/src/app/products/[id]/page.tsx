import { notFound } from 'next/navigation'
import Link from 'next/link'
import productsJson from '@/data/products.json'
import { getProduct } from '@/lib/firestore'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params

  let product = null
  try {
    product = await getProduct(id)
  } catch {
    // Firestore unavailable — fall through to JSON fallback
  }

  if (!product) {
    product = productsJson.find(p => p.id === id) ?? null
  }

  if (!product) {
    notFound()
  }

  const roastLabel: Record<string, string> = {
    light: 'Light Roast',
    medium: 'Medium Roast',
    dark: 'Dark Roast',
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/products"
            className="text-sm text-amber-700 hover:text-ember transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey rounded"
          >
            &larr; All Coffees
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image placeholder */}
          <div className="w-full md:w-1/2 shrink-0">
            <div className="bg-gradient-to-br from-amber-100 to-orange-50 aspect-square rounded-2xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-24 h-24 text-amber-400 opacity-60"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 21v-2h2V3h16v16h2v2H2zm4-2h12V5H6v14zm2-2h2v-2H8v2zm4 0h2v-2h-2v2zm-4-4h2v-2H8v2zm4 0h2v-2h-2v2zm-4-4h2V7H8v2zm4 0h2V7h-2v2z" />
              </svg>
            </div>
          </div>

          {/* Product details */}
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-bold text-roast mb-4">
              {product.name}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                {product.origin}
              </span>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
                {roastLabel[product.roastLevel] ?? product.roastLevel}
              </span>
              <span className="bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                {product.type}
              </span>
            </div>

            {/* Tasting notes */}
            {product.notes && product.notes.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Tasting Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map(note => (
                    <span
                      key={note}
                      className="bg-honey/20 text-roast text-xs px-2 py-1 rounded-full"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Price + CTA */}
            <div className="flex items-center gap-6">
              <span className="text-2xl font-semibold text-roast">
                ${product.price.toFixed(2)}
              </span>
              <button className="bg-ember hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
