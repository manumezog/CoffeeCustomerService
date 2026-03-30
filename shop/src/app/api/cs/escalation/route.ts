import { getEscalations, updateEscalationStatus } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const escalations = await getEscalations()
    return Response.json({ data: escalations, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to fetch escalations' }, { status: 500 })
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
