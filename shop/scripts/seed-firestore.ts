/**
 * Seed Firestore with products and orders from local JSON files.
 *
 * HOW TO RUN:
 *   1. Make sure your Firebase credentials are in shop/.env.local
 *   2. From the `shop` directory:
 *        npx ts-node --project tsconfig.json -e "require('dotenv').config({ path: '.env.local' })" scripts/seed-firestore.ts
 *      Or with tsx (simpler):
 *        npx tsx --env-file=.env.local scripts/seed-firestore.ts
 *
 * IDEMPOTENT: Uses product/order ID as the Firestore doc ID.
 * Running multiple times is safe — it will overwrite with identical data.
 */

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Load env from .env.local when running outside Next.js
// (tsx --env-file handles this; dotenv fallback shown in usage above)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getFirestore(app, 'coffee-cs-db')

// ── Data ──────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string
  roastLevel: 'light' | 'medium' | 'dark'
  origin: string
  notes: string[]
  image: string
}

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: string
  items: OrderItem[]
  total: number
  trackingNumber?: string
  carrier?: string
  createdAt: string
  estimatedDelivery?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  notes?: string
}

// Use require so this script can run directly with ts-node / tsx without
// needing to configure JSON module resolution in tsconfig.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const products: Product[] = require('../src/data/products.json')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const orders: Order[] = require('../src/data/orders.json')

// ── Seed helpers ──────────────────────────────────────────────────────────────

async function seedCollection<T extends { id: string }>(
  collectionName: string,
  records: T[]
): Promise<void> {
  console.log(`\nSeeding ${collectionName} (${records.length} records)...`)
  for (const record of records) {
    const { id, ...data } = record
    await setDoc(doc(db, collectionName, id), data)
    console.log(`  ✓ ${collectionName}/${id}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Ember & Roast — Firestore seed script')
  console.log(`Project: ${firebaseConfig.projectId ?? '(not set — check .env.local)'}`)

  if (!firebaseConfig.projectId) {
    console.error('\nERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.')
    console.error('Copy .env.example to .env.local and fill in your Firebase credentials.')
    process.exit(1)
  }

  await seedCollection('products', products)
  await seedCollection('orders', orders)

  console.log('\nSeed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
