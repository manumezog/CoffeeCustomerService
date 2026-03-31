# Ember & Roast — Product Philosophy

## Voice-First Customer Service

Every design decision prioritizes voice as the primary support channel. The "Call Us" button is prominent on every page, not buried in a dropdown. Voice enables real-time empathy and faster resolution for complex problems.

**Code-level decisions:**
- `/api/retell` is optimized for low-latency responses (critical for voice)
- Response generation prioritizes brevity — voice conversations work better with concise replies
- Errors are handled gracefully: if the system can't help, it escalates rather than fabricates

## Multi-Channel Consistency

Customers shouldn't have to repeat themselves across channels. Whether a customer reaches out via voice, webchat, or email, they get the same underlying intelligence.

```
┌─────────────────────────────────┐
│   cs-context.ts (The Brain)     │
│ - Order lookup                  │
│ - Policy retrieval              │
│ - Sentiment analysis            │
│ - Escalation rules              │
│ - Response generation           │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
  Voice     Webchat     Email
  (Retell)  (Voiceflow) (Resend)
```

All three channels call the same `cs-context.ts` module. Response format adapts to channel (voice: conversational, email: formal), but the underlying logic is identical.

## Empathetic AI

Good customer service AI must know when to stop and hand off. Escalation is deterministic, not left to chance.

**Escalation triggers (from `cs-context.ts`):**
- Sentiment score < 0.3 → frustration detected
- Refund amount > $50 → high-value approval needed
- Repeat contact > 2 turns → recurring issue
- Explicit request for a human

When escalating, the AI doesn't keep trying — it transitions warmly and immediately.

## Seamless Human Handoff

The worst experience: customer explains their problem to an AI, gets escalated to a human, and has to explain everything again.

When escalation is triggered, Firestore captures:
1. Full conversation transcript
2. Order context and history
3. Customer sentiment score
4. What the AI attempted
5. Recommended next action

The human agent opens the dashboard and has everything they need. The customer never repeats themselves.

## Outcome-Driven

Support should resolve issues, not just provide information.

- Bad: "Your order is on the way."
- Good: "Your order should arrive Thursday. If it doesn't, here's what happens next."
- Better: "I can see your order is delayed. I've flagged it for priority review."

The CS agents in this project look up orders and process returns, explain policy and offer alternatives, detect frustration and escalate with context — taking action, not just answering.

## AI-Powered Development

The development team itself is powered by AI agents defined in `.claude/agents/`:
- **PM agent** — requirements and planning
- **UI Designer agent** — design system and component specs
- **Backend Engineer agent** — APIs, Firestore layer, cs-context.ts
- **Frontend Engineer agent** — components and pages

One engineer directing four specialized agents — each with distinct roles, domain knowledge, and constraints — flowing through Jira and GitHub CI/CD like a real engineering team.
