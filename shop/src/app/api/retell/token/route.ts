import Retell from 'retell-sdk'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { agentId } = await req.json() as { agentId: string }
    if (!agentId) {
      return Response.json({ data: null, error: 'agentId required' }, { status: 400 })
    }

    const apiKey = process.env.RETELL_API_KEY_PRIVATE
    if (!apiKey) {
      return Response.json({ data: null, error: 'Retell not configured' }, { status: 503 })
    }

    const client = new Retell({ apiKey })
    const webCall = await client.call.createWebCall({ agent_id: agentId })

    return Response.json({ data: { accessToken: webCall.access_token }, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to create call token' }, { status: 500 })
  }
}
