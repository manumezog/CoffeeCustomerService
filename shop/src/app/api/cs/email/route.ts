import { Resend } from 'resend'
import { createHmac, timingSafeEqual } from 'crypto'
import { csContext } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

async function verifyResendSignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return false // fail-closed: unconfigured secret must block, not approve

  // Resend uses Svix for webhook delivery.
  // Svix signs: "{svix-id}.{svix-timestamp}.{body}" — NOT just the body.
  const msgId = req.headers.get('svix-id')
  const msgTimestamp = req.headers.get('svix-timestamp')
  const msgSignature = req.headers.get('svix-signature')

  if (!msgId || !msgTimestamp || !msgSignature) return false

  // Reject requests older than 5 minutes to prevent replay attacks
  const ts = parseInt(msgTimestamp, 10)
  if (isNaN(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false

  const signedContent = `${msgId}.${msgTimestamp}.${rawBody}`
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const computed = Buffer.from(
    `v1,${createHmac('sha256', secretBytes).update(signedContent).digest('base64')}`
  )

  // Use constant-time comparison to prevent timing attacks
  return msgSignature.split(' ').some(part => {
    const partBuf = Buffer.from(part)
    return partBuf.byteLength === computed.byteLength && timingSafeEqual(partBuf, computed)
  })
}

// Handles two modes:
// 1. Resend inbound webhook (email.received event) — body contains { type, data: { email_id } }
// 2. Direct POST for testing — body contains { from, subject, text }

interface ResendWebhookPayload {
  type: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    text?: string   // inbound body — present in webhook payload
    html?: string   // inbound body (HTML variant)
  }
}

interface DirectTestPayload {
  from: string
  to: string[]
  subject: string
  text: string
}

interface EmailContent {
  from: string
  subject: string
  text: string
}

function extractOrderId(text: string): string | undefined {
  const match = text.match(/ER-\d{4,6}/i)
  return match ? match[0].toUpperCase() : undefined
}

function extractSenderName(from: string): string | undefined {
  const match = from.match(/^(.+?)\s*</)
  return match ? match[1].trim() : undefined
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const rawBody = await req.text()

    // Verify Resend webhook signature — svix-id header is authoritative evidence of a Svix delivery
    const isWebhook = !!req.headers.get('svix-id')
    if (isWebhook && !(await verifyResendSignature(req, rawBody))) {
      console.warn('[email] Invalid webhook signature — request blocked')
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = JSON.parse(rawBody) as ResendWebhookPayload | DirectTestPayload

    // Determine email content based on payload type
    let email: EmailContent | null = null

    if ('type' in body && body.type === 'email.received') {
      const d = body.data
      // Resend inbound webhooks include text/html directly in the payload.
      // The /emails/{id} endpoint is for outbound emails only — do not use it here.
      const text = d.text ?? d.subject
      console.log('[email] inbound body:', text?.slice(0, 100))
      email = { from: d.from, subject: d.subject, text }
    } else {
      // Direct test POST
      const direct = body as DirectTestPayload
      email = { from: direct.from, subject: direct.subject, text: direct.text }
    }

    const { from, subject, text } = email
    const customerName = extractSenderName(from)
    const customerEmail = from.includes('<') ? from.replace(/.*<(.+)>/, '$1').trim() : from.trim()
    const orderId = extractOrderId(subject + ' ' + text)

    // Include subject in message so complaint/escalation keywords in subject are detected
    const fullMessage = subject ? `Subject: ${subject}\n\n${text}` : text

    const result = await csContext({
      channel: 'email',
      message: fullMessage,
      orderId,
      customerName,
      customerEmail,
    })

    let sendResult = null
    let sendError = null
    if (apiKey) {
      const resend = new Resend(apiKey)
      const { data, error } = await resend.emails.send({
        from: 'Ember & Roast Support <support@mezapps.com>',
        to: [customerEmail],
        subject: `Re: ${subject}`,
        text: buildEmailReply(result.response, customerName, result.escalationNeeded),
      })
      sendResult = data
      sendError = error
      if (error) console.error('[email] Resend error:', error)
    }

    return Response.json({ data: { sent: !!sendResult, sendError, customerEmail }, error: null })
  } catch (err) {
    console.error('[email] ERROR:', err)
    return Response.json({ data: null, error: 'Failed to process email' }, { status: 500 })
  }
}

function buildEmailReply(
  response: string,
  customerName: string | undefined,
  escalated: boolean
): string {
  const greeting = customerName ? `Hi ${customerName},\n\n` : 'Hi there,\n\n'
  const signature = [
    '',
    'Warm regards,',
    'Ember & Roast Customer Care',
    'support@mezapps.com',
    '',
    escalated
      ? 'A member of our team will be in touch shortly with personal attention to your situation.'
      : 'Feel free to reply to this email if you need anything else.',
  ].join('\n')

  return greeting + response + signature
}
