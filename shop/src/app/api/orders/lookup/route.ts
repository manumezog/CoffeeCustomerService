import { getOrder } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

async function handleLookup(body: { args?: { order_id?: string } }): Promise<Response> {
  const orderId = body.args?.order_id?.toUpperCase()

  if (!orderId) {
    return Response.json({ result: "I couldn't find an order ID in your request. Please provide your order number in the format ER-XXXXX." })
  }

  const order = await getOrder(orderId)

  if (!order) {
    return Response.json({ result: `I couldn't find order ${orderId}. Please double-check the number — it should be in the format ER followed by 5 digits, like ER-10042.` })
  }

  const statusMessages: Record<string, string> = {
    confirmed: 'confirmed and being prepared for roasting',
    roasting: 'currently being roasted fresh for you',
    shipped: `shipped${order.carrier ? ` via ${order.carrier}` : ''}${order.trackingNumber ? ` with tracking number ${order.trackingNumber}` : ''}`,
    delivered: 'delivered',
    return_requested: 'being processed for return',
    refunded: 'fully refunded',
  }

  const statusText = statusMessages[order.status] ?? order.status
  const delivery = order.estimatedDelivery
    ? ` Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`
    : ''
  const items = order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')
  const daysSinceOrder = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const returnEligible = daysSinceOrder <= 30

  return Response.json({
    result: `Order ${order.id} for ${order.customerName} is ${statusText}.${delivery} Items: ${items}. Total: $${order.total.toFixed(2)}. ${returnEligible ? 'This order is within the 30-day return window.' : 'This order is outside the 30-day return window.'}`,
  })
}

// Retell function calling endpoint
export async function POST(req: Request) {
  try {
    const lookupKey = process.env.LOOKUP_ORDER_KEY
    if (lookupKey) {
      const provided = req.headers.get('lookup_order_key')
      if (provided !== lookupKey) {
        console.warn('[order-lookup] Invalid lookup_order_key header')
        return Response.json({ result: 'Unauthorized' }, { status: 403 })
      }
    }

    const rawBody = await req.text()
    const body = JSON.parse(rawBody) as { args?: { order_id?: string } }
    return await handleLookup(body)
  } catch (err) {
    console.error('[order-lookup] ERROR:', err)
    return Response.json({ result: "I'm having trouble looking up that order right now. Please try again in a moment." })
  }
}
