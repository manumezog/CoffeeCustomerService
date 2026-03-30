import { csContext } from '@/lib/cs-context'
import type { CsInput } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json() as CsInput
    if (!body.message || !body.channel) {
      return Response.json({ data: null, error: 'message and channel are required' }, { status: 400 })
    }
    const result = await csContext(body)
    return Response.json({ data: result, error: null })
  } catch {
    return Response.json({ data: null, error: 'Failed to process message' }, { status: 500 })
  }
}
