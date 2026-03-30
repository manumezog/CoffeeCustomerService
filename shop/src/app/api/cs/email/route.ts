import { Resend } from 'resend'
import { csContext } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

// Inbound email webhook — Resend calls this when a customer emails support@
// Resend inbound docs: https://resend.com/docs/dashboard/emails/inbound

interface ResendInboundPayload {
  from: string
  to: string[]
  subject: string
  text: string
  html?: string
  headers?: Record<string, string>
}

function extractOrderId(text: string): string | undefined {
  const match = text.match(/ER-\d{4,6}/i)
  return match ? match[0].toUpperCase() : undefined
}

function extractSenderName(from: string): string | undefined {
  // "Alice Johnson <alice@example.com>" → "Alice Johnson"
  const match = from.match(/^(.+?)\s*</)
  return match ? match[1].trim() : undefined
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as ResendInboundPayload
    const { from, subject, text } = body

    const customerName = extractSenderName(from)
    const customerEmail = from.replace(/.*<(.+)>/, '$1').trim()
    const orderId = extractOrderId(subject + ' ' + text)

    // Run through the shared CS brain
    const result = await csContext({
      channel: 'email',
      message: text,
      orderId,
      customerName,
      customerEmail,
    })

    // Send reply via Resend
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: 'Ember & Roast Support <onboarding@resend.dev>',
        to: [customerEmail],
        subject: `Re: ${subject}`,
        text: buildEmailReply(result.response, customerName, result.escalationNeeded),
      })
    }

    return Response.json({ data: { sent: !!apiKey, result }, error: null })
  } catch {
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
    'support@emberandroast.com',
    '',
    escalated
      ? 'A member of our team will be in touch shortly with personal attention to your situation.'
      : 'Feel free to reply to this email if you need anything else.',
  ].join('\n')

  return greeting + response + signature
}
