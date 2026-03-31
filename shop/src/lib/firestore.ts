import { getAdminDb } from '@/lib/firebase-admin'

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
  const snap = await getAdminDb().collection('products').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getAdminDb().collection('products').doc(id).get()
  return snap.exists ? ({ id: snap.id, ...snap.data() } as Product) : null
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getAdminDb().collection('orders').doc(id).get()
  if (snap.exists) return { id: snap.id, ...snap.data() } as Order

  const results = await getAdminDb().collection('orders').where('id', '==', id).get()
  if (!results.empty) {
    const d = results.docs[0]
    return { id: d.id, ...d.data() } as Order
  }
  return null
}

export async function updateOrderStatus(id: string, status: OrderStatus, notes?: string) {
  const snap = await getAdminDb().collection('orders').doc(id).get()
  if (snap.exists) {
    await getAdminDb().collection('orders').doc(id).update({ status, ...(notes ? { notes } : {}) })
  }
}

// ── CS Interactions ──────────────────────────────────────────────────────────

export async function saveCsInteraction(interaction: CsInteraction): Promise<string> {
  const ref = await getAdminDb().collection('cs-interactions').add({
    ...interaction,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

// ── Escalations ──────────────────────────────────────────────────────────────

export async function createEscalation(escalation: Omit<Escalation, 'id' | 'createdAt'>): Promise<string> {
  const ref = await getAdminDb().collection('escalations').add({
    ...escalation,
    status: 'open',
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function getEscalations(): Promise<Escalation[]> {
  const snap = await getAdminDb().collection('escalations').where('status', '==', 'open').get()
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Escalation))
  return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateEscalationStatus(id: string, status: 'claimed' | 'resolved') {
  await getAdminDb().collection('escalations').doc(id).update({ status })
}
