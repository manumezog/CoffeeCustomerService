import { csContext } from '@/lib/cs-context'
import type { CsInput } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

const ALLOWED_ORIGINS = [
  'https://coffee-cs.vercel.app',
  'http://localhost:3000',
]

export async function POST(req: Request) {
  const origin = req.headers.get('origin') ?? ''
  const voiceflowSecret = process.env.VOICEFLOW_WEBHOOK_SECRET
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '')
    ?? req.headers.get('x-vf-signature')

  // Allow if valid origin OR valid Voiceflow secret
  const authorized = ALLOWED_ORIGINS.includes(origin)
    || (voiceflowSecret && authHeader === voiceflowSecret)

  if (!authorized) {
    console.warn('[cs/webhook] Blocked request from origin:', origin)
    return Response.json({ data: null, error: 'Forbidden' }, { status: 403 })
  }

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
