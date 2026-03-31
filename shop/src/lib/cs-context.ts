import { getOrder, createEscalation, saveCsInteraction } from '@/lib/firestore'
import type { Order } from '@/lib/firestore'

// ── Types ────────────────────────────────────────────────────────────────────

export type Channel = 'voice' | 'chat' | 'email'

export interface Message {
  role: 'user' | 'agent'
  content: string
}

export interface CsInput {
  channel: Channel
  message: string
  conversationHistory?: Message[]
  orderId?: string
  customerName?: string
  customerEmail?: string
}

export interface CsOutput {
  response: string
  sentiment: number
  escalationNeeded: boolean
  escalationReason?: string
  actions: CsAction[]
  context: ContextPackage
}

export interface CsAction {
  type: 'process_return' | 'provide_tracking' | 'suggest_product' | 'escalate'
  data?: Record<string, unknown>
}

export interface ContextPackage {
  order?: Order
  conversationHistory: Message[]
  sentiment: number
  channel: Channel
  customerName?: string
  customerEmail?: string
}

// ── Escalation Rules ─────────────────────────────────────────────────────────

interface EscalationRule {
  check: (sentiment: number, refundAmount?: number, historyLen?: number) => boolean
  reason: string
}

const ESCALATION_RULES: EscalationRule[] = [
  { check: (s) => s < 0.3,                                 reason: 'Customer frustration detected' },
  { check: (_s, r) => (r ?? 0) > 50,                       reason: 'High-value refund requires approval' },
  // Rule 3: conversation has exceeded 6 turns (3 back-and-forth exchanges)
  // without resolution — indicates a recurring or complex issue.
  { check: (_s, _r, h) => (h ?? 0) > 6,                    reason: 'Recurring issue — multiple turns without resolution' },
]

const EXPLICIT_ESCALATION_PHRASES = [
  // Voice/chat style
  'speak to a human', 'talk to a person', 'real person', 'human agent',
  'manager', 'supervisor', 'escalate', 'not helpful',
  // Email complaint/reimbursement language
  'complaint', 'reimbursement', 'compensation', 'unacceptable', 'demand a refund',
  'this is ridiculous', 'very disappointed', 'extremely unhappy', 'demand',
  'legal action', 'chargeback', 'dispute', 'BBB', 'better business',
]

// ── Sentiment Analysis (simple keyword-based) ─────────────────────────────────

function analyzeSentiment(text: string): number {
  const lower = text.toLowerCase()
  const negative = ['frustrated', 'angry', 'terrible', 'awful', 'horrible', 'upset',
    'unhappy', 'disappointed', 'furious', 'ridiculous', 'unacceptable', 'worst',
    'broken', 'wrong', 'bad', 'never again', 'scam', 'useless']
  const positive = ['thank', 'great', 'love', 'excellent', 'perfect', 'happy',
    'satisfied', 'wonderful', 'amazing', 'good', 'helpful', 'appreciate']

  let score = 0.5
  negative.forEach(w => { if (lower.includes(w)) score -= 0.15 })
  positive.forEach(w => { if (lower.includes(w)) score += 0.1 })
  return Math.max(-1, Math.min(1, score))
}

// ── Intent Detection ─────────────────────────────────────────────────────────

type Intent = 'order_lookup' | 'return_request' | 'product_question' | 'shipping_question' | 'general'

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase()
  if (/order|track|status|where.*package|shipment|delivery/.test(lower)) return 'order_lookup'
  if (/return|refund|exchange|send back|money back/.test(lower)) return 'return_request'
  if (/coffee|roast|blend|origin|taste|flavor|brew|grind|espresso/.test(lower)) return 'product_question'
  if (/ship|deliver|how long|arrival|when/.test(lower)) return 'shipping_question'
  return 'general'
}

// ── Order ID Extraction ───────────────────────────────────────────────────────

function extractOrderId(text: string): string | null {
  const match = text.match(/ER-\d{4,6}/i)
  return match ? match[0].toUpperCase() : null
}

// ── Response Generator ────────────────────────────────────────────────────────

function generateResponse(
  intent: Intent,
  channel: Channel,
  order: Order | null,
  _message: string,
  sentiment: number
): { response: string; actions: CsAction[] } {
  const actions: CsAction[] = []
  const brief = channel === 'voice'

  // Low sentiment preamble
  const empathy = sentiment < 0.4
    ? (brief ? "I'm sorry to hear that. " : "I completely understand your frustration, and I sincerely apologize for the inconvenience. ")
    : ''

  if (intent === 'order_lookup' && order) {
    actions.push({ type: 'provide_tracking', data: { orderId: order.id } })
    const statusMap: Record<string, string> = {
      confirmed: 'confirmed and being prepared for roasting',
      roasting: 'currently being roasted fresh for you',
      shipped: `shipped${order.carrier ? ` via ${order.carrier}` : ''}${order.trackingNumber ? ` — tracking: ${order.trackingNumber}` : ''}`,
      delivered: 'delivered',
      return_requested: 'being processed for return',
      refunded: 'refunded',
    }
    const statusText = statusMap[order.status] ?? order.status
    const delivery = order.estimatedDelivery
      ? ` Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}.`
      : ''

    if (brief) {
      return { response: `${empathy}Order ${order.id} is ${statusText}.${delivery}`, actions }
    }
    return {
      response: `${empathy}Your order **${order.id}** is currently **${statusText}**.${delivery} It contains: ${order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}. Total: $${order.total.toFixed(2)}.`,
      actions,
    }
  }

  if (intent === 'return_request') {
    if (order) {
      const orderDate = new Date(order.createdAt)
      const daysSince = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      const eligible = daysSince <= 30

      if (eligible) {
        actions.push({ type: 'process_return', data: { orderId: order.id, amount: order.total } })
        return {
          response: brief
            ? `${empathy}Order ${order.id} is eligible for a return. I can process that now. Would you like a full refund or store credit?`
            : `${empathy}Great news — order **${order.id}** is within our 30-day return window. I can process this return right away. Would you prefer a full refund or store credit for future orders?`,
          actions,
        }
      } else {
        return {
          response: brief
            ? `${empathy}Order ${order.id} is outside our 30-day return window. I'll escalate this for you.`
            : `${empathy}Unfortunately, order **${order.id}** is outside our 30-day return window. However, I want to make this right — let me connect you with our team to find a solution.`,
          actions,
        }
      }
    }
    return {
      response: brief
        ? `${empathy}I can help with a return. What's your order number?`
        : `${empathy}I'd be happy to help with your return. Could you please provide your order number (format: ER-XXXXX)?`,
      actions,
    }
  }

  if (intent === 'shipping_question') {
    return {
      response: brief
        ? `${empathy}We roast to order in 2-3 days, then ship via USPS Priority (2-3 days). Free shipping over $35.`
        : `${empathy}We roast every order fresh, which takes **2-3 business days**. After roasting, we ship via USPS Priority Mail (2-3 business days). **Free shipping on orders over $35.** Total expected time: 4-6 business days.`,
      actions,
    }
  }

  if (intent === 'product_question') {
    return {
      response: brief
        ? `${empathy}We have light, medium, and dark roasts from Ethiopia, Colombia, Sumatra, and more. What flavor profile interests you?`
        : `${empathy}We offer a curated selection of specialty coffees: **Ethiopian Yirgacheffe** (light, floral), **Colombian Supremo** (medium, balanced), **Sumatra Mandheling** (dark, earthy), and our signature **Ember Blend** (medium, chocolatey). What flavor profile are you looking for?`,
      actions,
    }
  }

  return {
    response: brief
      ? `${empathy}How can I help you today? I can assist with orders, returns, shipping, or product questions.`
      : `${empathy}Welcome to Ember & Roast! I can help you with order tracking, returns, shipping questions, or finding the perfect coffee. What can I do for you?`,
    actions,
  }
}

// ── Main csContext Function ───────────────────────────────────────────────────

export async function csContext(input: CsInput): Promise<CsOutput> {
  const { channel, message, conversationHistory = [], orderId, customerName, customerEmail } = input

  // 1. Analyze sentiment across full conversation
  const allText = [...conversationHistory.map(m => m.content), message].join(' ')
  const sentiment = analyzeSentiment(allText)

  // 2. Extract order ID from message or input
  const detectedOrderId = orderId ?? extractOrderId(message) ??
    extractOrderId(conversationHistory.map(m => m.content).join(' '))

  // 3. Fetch order if we have an ID
  let order: Order | null = null
  if (detectedOrderId) {
    order = await getOrder(detectedOrderId)
  }

  // 4. Detect intent
  const intent = detectIntent(message)

  // 5. Check escalation
  const explicitEscalation = EXPLICIT_ESCALATION_PHRASES.some(p => message.toLowerCase().includes(p))
  const refundAmount = order?.total ?? 0
  const sentimentEscalation = ESCALATION_RULES[0].check(sentiment, refundAmount, conversationHistory.length)
  const valueEscalation = ESCALATION_RULES[1].check(sentiment, refundAmount, conversationHistory.length)
  const repeatContactEscalation = ESCALATION_RULES[2].check(sentiment, refundAmount, conversationHistory.length)

  // Email return/reimbursement requests always get human review
  const emailReturnEscalation = channel === 'email' && intent === 'return_request'

  const escalationNeeded = explicitEscalation || sentimentEscalation || valueEscalation || repeatContactEscalation || emailReturnEscalation
  let escalationReason: string | undefined
  if (explicitEscalation) escalationReason = 'Customer requested human agent'
  else if (emailReturnEscalation) escalationReason = 'Email return/reimbursement request — requires human review'
  else if (sentimentEscalation) escalationReason = 'Customer frustration detected'
  else if (valueEscalation) escalationReason = `High-value refund: $${refundAmount.toFixed(2)}`
  else if (repeatContactEscalation) escalationReason = 'Recurring issue — multiple turns without resolution'

  // 6. Generate response
  const { response: baseResponse, actions } = generateResponse(intent, channel, order, message, sentiment)

  // 7. Override response if escalating
  const finalResponse = escalationNeeded
    ? (channel === 'voice'
        ? `I understand your frustration. Let me connect you with our coffee care team right away. They'll have full context of our conversation.`
        : `I completely understand, and I want to make sure this gets resolved properly. I'm connecting you with a specialist now — they'll have everything we've discussed so there's no need to repeat yourself.`)
    : baseResponse

  if (escalationNeeded) actions.push({ type: 'escalate', data: { reason: escalationReason } })

  // 8. Build context package
  const updatedHistory: Message[] = [
    ...conversationHistory,
    { role: 'user', content: message },
    { role: 'agent', content: finalResponse },
  ]

  const context: ContextPackage = {
    order: order ?? undefined,
    conversationHistory: updatedHistory,
    sentiment,
    channel,
    customerName,
    customerEmail,
  }

  // 9. Log interaction to Firestore (non-blocking)
  saveCsInteraction({
    channel,
    orderId: detectedOrderId ?? undefined,
    messages: updatedHistory,
    sentiment,
    escalated: escalationNeeded,
    createdAt: new Date().toISOString(),
  }).catch(() => {}) // fire and forget

  // 10. Create escalation record if needed
  if (escalationNeeded) {
    createEscalation({
      interactionId: 'pending',
      channel,
      customerName,
      customerEmail,
      orderId: detectedOrderId ?? undefined,
      reason: escalationReason ?? 'Unknown',
      sentiment,
      transcript: updatedHistory.map(m => `${m.role}: ${m.content}`).join('\n'),
      recommendedAction: order
        ? `Review order ${order.id} (status: ${order.status}, total: $${order.total})`
        : 'Review customer inquiry',
      status: 'open',
    }).catch(() => {})
  }

  return {
    response: finalResponse,
    sentiment,
    escalationNeeded,
    escalationReason,
    actions,
    context,
  }
}
