import { csContext } from '@/lib/cs-context'
import type { CsInput } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

function isAuthorized(req: Request): boolean {
  const voiceflowSecret = process.env.VOICEFLOW_WEBHOOK_SECRET
  // If no secret is configured, allow all (dev / demo mode — matches email route pattern)
  if (!voiceflowSecret) return true

  const origin = req.headers.get('origin') ?? ''
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const allowedOrigins = [appUrl, 'http://localhost:3000']

  if (allowedOrigins.includes(origin)) return true

  // Voiceflow calls this server-side (no origin header) — validate by shared secret
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '')
    ?? req.headers.get('x-vf-signature')
  return authHeader === voiceflowSecret
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    console.warn('[cs/webhook] Blocked request from origin:', req.headers.get('origin'))
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
