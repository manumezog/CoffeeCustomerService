import { getOrder, updateOrderStatus } from '@/lib/firestore'
import type { OrderStatus } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await getOrder(id)
    if (!order) {
      return Response.json({ data: null, error: 'Order not found' }, { status: 404 })
    }
    return Response.json({ data: order, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json() as { status: OrderStatus; notes?: string }
    await updateOrderStatus(id, body.status, body.notes)
    return Response.json({ data: { updated: true }, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to update order' }, { status: 500 })
  }
}
