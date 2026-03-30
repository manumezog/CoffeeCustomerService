import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Product {
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

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export type OrderStatus =
  | 'confirmed'
  | 'roasting'
  | 'shipped'
  | 'delivered'
  | 'return_requested'
  | 'refunded'

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: OrderStatus
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

export interface CsInteraction {
  id?: string
  channel: 'voice' | 'chat' | 'email'
  customerId?: string
  orderId?: string
  messages: Array<{ role: 'user' | 'agent'; content: string }>
  sentiment: number
  escalated: boolean
  createdAt: string
}

export interface Escalation {
  id?: string
  interactionId: string
  channel: 'voice' | 'chat' | 'email'
  customerName?: string
  customerEmail?: string
  orderId?: string
  reason: string
  sentiment: number
  transcript: string
  recommendedAction: string
  status: 'open' | 'claimed' | 'resolved'
  createdAt: string
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, 'products'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, 'products', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function getOrder(id: string): Promise<Order | null> {
  // Try by document ID first, then by 'id' field
  const snap = await getDoc(doc(db, 'orders', id))
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Order

  const q = query(collection(db, 'orders'), where('id', '==', id))
  const results = await getDocs(q)
  if (!results.empty) {
    const d = results.docs[0]
    return { id: d.id, ...d.data() } as Order
  }
  return null
}

export async function updateOrderStatus(id: string, status: OrderStatus, notes?: string) {
  const snap = await getDoc(doc(db, 'orders', id))
  if (snap.exists()) {
    await updateDoc(doc(db, 'orders', id), { status, ...(notes ? { notes } : {}) })
  }
}

// ── CS Interactions ──────────────────────────────────────────────────────────

export async function saveCsInteraction(interaction: CsInteraction): Promise<string> {
  const ref = await addDoc(collection(db, 'cs-interactions'), {
    ...interaction,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

// ── Escalations ──────────────────────────────────────────────────────────────

export async function createEscalation(escalation: Omit<Escalation, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'escalations'), {
    ...escalation,
    status: 'open',
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function getEscalations(): Promise<Escalation[]> {
  const q = query(
    collection(db, 'escalations'),
    where('status', '==', 'open'),
  )
  const snap = await getDocs(q)
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Escalation))
  return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateEscalationStatus(id: string, status: 'claimed' | 'resolved') {
  await updateDoc(doc(db, 'escalations', id), { status })
}
