import { Resend } from 'resend'
import { csContext } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

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
    text?: string
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

async function fetchEmailContent(emailId: string, apiKey: string): Promise<EmailContent | null> {
  try {
    const res = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return null
    const data = await res.json() as { from: string; subject: string; text: string }
    return { from: data.from, subject: data.subject, text: data.text }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const body = await req.json() as ResendWebhookPayload | DirectTestPayload

    // Determine email content based on payload type
    let email: EmailContent | null = null

    if ('type' in body && body.type === 'email.received') {
      // Resend webhook — use data from payload, fetch body if missing
      const d = body.data
      let text = d.text
      if (!text && apiKey) {
        const fetched = await fetchEmailContent(d.email_id, apiKey)
        text = fetched?.text ?? ''
      }
      email = { from: d.from, subject: d.subject, text: text ?? '' }
    } else {
      // Direct test POST
      const direct = body as DirectTestPayload
      email = { from: direct.from, subject: direct.subject, text: direct.text }
    }

    const { from, subject, text } = email
    const customerName = extractSenderName(from)
    const customerEmail = from.includes('<') ? from.replace(/.*<(.+)>/, '$1').trim() : from.trim()
    const orderId = extractOrderId(subject + ' ' + text)

    const result = await csContext({
      channel: 'email',
      message: text,
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
