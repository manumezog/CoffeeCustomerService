import { getEscalations, updateEscalationStatus, createEscalation } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const escalations = await getEscalations()
    return Response.json({ data: escalations, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to fetch escalations' }, { status: 500 })
  }
}

// Called by Retell as a function tool when the agent decides to escalate
export async function POST(req: Request) {
  // Simple bearer token check — set ESCALATION_SECRET in Vercel + Retell custom header
  const secret = process.env.ESCALATION_SECRET
  if (secret) {
    const auth = req.headers.get('x-escalation-secret') ?? req.headers.get('authorization')?.replace('Bearer ', '')
    if (auth !== secret) {
      console.warn('[escalation] Unauthorized POST blocked')
      return Response.json({ result: 'Unauthorized' }, { status: 403 })
    }
  }

  try {
    const body = await req.json() as {
      args?: {
        reason?: string
        customer_name?: string
        order_id?: string
        transcript_summary?: string
      }
    }
    const args = body.args ?? {}

    await createEscalation({
      interactionId: 'retell-voice',
      channel: 'voice',
      customerName: args.customer_name,
      orderId: args.order_id?.toUpperCase(),
      reason: args.reason ?? 'Customer requested human agent',
      sentiment: 0.2,
      transcript: args.transcript_summary ?? 'Voice call escalation',
      recommendedAction: args.order_id
        ? `Review order ${args.order_id.toUpperCase()} — customer requested human support`
        : 'Customer requested human support on voice call',
      status: 'open',
    })

    return Response.json({ result: 'Escalation recorded. A human agent will follow up shortly.' })
  } catch (err) {
    console.error('[escalation] POST error:', err)
    return Response.json({ result: 'Escalation noted. Our team will be in touch.' })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json() as { id: string; status: 'claimed' | 'resolved' }
    if (!body.id || !body.status) {
      return Response.json({ data: null, error: 'id and status are required' }, { status: 400 })
    }
    await updateEscalationStatus(body.id, body.status)
    return Response.json({ data: { updated: true }, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to update escalation' }, { status: 500 })
  }
}
