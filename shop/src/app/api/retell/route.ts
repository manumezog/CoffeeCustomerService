import { csContext } from '@/lib/cs-context'
import type { Message } from '@/lib/cs-context'

export const dynamic = 'force-dynamic'

// Retell Custom LLM webhook
// Docs: https://docs.retell.ai/custom-llm-websocket
// Retell sends conversation state; we return the agent's next utterance.

interface RetellTranscriptItem {
  role: 'agent' | 'user'
  content: string
}

interface RetellRequest {
  interaction_type: 'response_required' | 'reminder_required' | 'ping_pong'
  response_id: number
  transcript: RetellTranscriptItem[]
  call: {
    call_id: string
    agent_id: string
    metadata?: Record<string, unknown>
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RetellRequest

    // Retell health check
    if (body.interaction_type === 'ping_pong') {
      return Response.json({ interaction_type: 'ping_pong' })
    }

    // Map Retell transcript to cs-context history (exclude last user turn — that's the current message)
    const transcript = body.transcript ?? []
    const lastUserMsg = [...transcript].reverse().find(t => t.role === 'user')
    const historyItems = lastUserMsg
      ? transcript.slice(0, transcript.lastIndexOf(lastUserMsg))
      : transcript

    const conversationHistory: Message[] = historyItems.map(t => ({
      role: t.role,
      content: t.content,
    }))

    const currentMessage = lastUserMsg?.content ?? ''

    // Extract metadata passed from Retell agent config (optional)
    const meta = body.call.metadata ?? {}
    const customerName = typeof meta.customerName === 'string' ? meta.customerName : undefined
    const customerEmail = typeof meta.customerEmail === 'string' ? meta.customerEmail : undefined

    const result = await csContext({
      channel: 'voice',
      message: currentMessage,
      conversationHistory,
      customerName,
      customerEmail,
    })

    return Response.json({
      response_type: 'response',
      response_id: body.response_id,
      content: result.response,
      content_complete: true,
      end_call: result.escalationNeeded,
    })
  } catch {
    return Response.json({
      response_type: 'response',
      response_id: 0,
      content: "I'm sorry, I'm having trouble right now. Please call us directly at 1-800-EMBER-CO.",
      content_complete: true,
      end_call: false,
    }, { status: 500 })
  }
}
