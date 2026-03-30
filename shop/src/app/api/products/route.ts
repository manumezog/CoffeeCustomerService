export const dynamic = 'force-dynamic'

import { getProducts } from '@/lib/firestore'
import type { Product } from '@/lib/firestore'
import productsJson from '@/data/products.json'

export async function GET() {
  try {
    let products: Product[] = await getProducts()

    // Fall back to static JSON if Firestore returns empty (e.g. not yet seeded)
    if (products.length === 0) {
      products = productsJson as Product[]
    }

    return Response.json({ data: products, error: null }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products'
    return Response.json({ data: null, error: message }, { status: 500 })
  }
}
