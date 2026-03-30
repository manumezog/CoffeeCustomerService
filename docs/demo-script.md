# Demo Script — Ember & Roast for Sierra.AI Interview

**Duration:** 20–30 minutes
**Goal:** Show voice-first AI customer service with multi-channel consistency, empathetic escalation, and professional engineering practices.

---

## Pre-Demo Checklist

- [ ] Shop running locally (`cd shop && npm run dev`) or live on Firebase
- [ ] Retell agent configured with webhook URL (or ngrok tunnel running)
- [ ] `.env.local` has `NEXT_PUBLIC_RETELL_AGENT_ID` and `RETELL_API_KEY_PRIVATE`
- [ ] Headphones ready — Retell voice requires audio
- [ ] Jira EMBER board open in a tab (if set up)
- [ ] GitHub repo open in a tab
- [ ] Order IDs memorized: **ER-10042** (shipped), **ER-10031** (return requested), **ER-10050** (delivered)
- [ ] Backup video recorded as fallback for the voice demo

---

## Part 1: Context (2–3 min)

Open the architecture diagram and set the scene:

> *"This project is built specifically for Sierra.AI. It demonstrates the three things I think matter most in modern customer service AI: voice-first design, multi-channel consistency, and graceful human handoff.*
>
> *The architecture has three layers: a Claude Code AI dev team that built the shop, Firebase cloud infrastructure, and a customer service layer with voice, webchat, and email — all sharing a single brain."*

---

## Part 2: Professional Infrastructure (2–3 min)

**GitHub first:**

> *"Every feature shipped through a real CI/CD pipeline. On every PR: lint, type check, build. On merge to main: deploy to Firebase Hosting. That's not a demo setup — that's production workflow."*

Show the Actions tab → green pipeline runs.

**Jira (if set up):**

> *"The dev team — four Claude Code agents playing PM, Designer, Backend Engineer, and Frontend Engineer — tracked their work in Jira. The PM wrote epics and user stories. The engineers created branches, wrote code, and moved tickets through the board. Exactly how a real team operates."*

---

## Part 3: The Shop (3–4 min)

Open the shop homepage.

> *"Ember & Roast is a specialty coffee roaster. The brand is warm, artisanal, premium. Every design decision was made by the UI Designer agent following a real design system."*

**Browse Products:**

> *"Eight specialty coffees — Ethiopian Yirgacheffe, Colombian Supremo, Sumatra Mandheling, and more. Each with origin, roast level, and tasting notes. The kind of detail that builds trust with specialty coffee customers."*

**Track Order — try ER-10042:**

> *"This is one of the core CS scenarios. The customer types their order ID and immediately sees status, carrier, tracking number, estimated delivery, and items. The same data the voice agent and webchat will use — it all comes from the same Firestore backend."*

Try **ER-10031**:

> *"This order has a return requested. The system knows the state. When the voice agent handles a return for this order, it checks the 30-day window, processes it, and offers refund or store credit — no human needed unless the value is over $50."*

---

## Part 4: Webchat (2–3 min)

*(Skip this section if Voiceflow project ID not yet configured.)*

Click the Voiceflow chat widget (bottom-right):

> *"The webchat is powered by Voiceflow, embedded directly on the shop. But it's not a dumb FAQ bot — every message routes through the same `cs-context.ts` backend the voice agent uses. Consistent answers, regardless of channel."*

Try the escalation scenario:
- Type: *"I'm really frustrated, my order has been sitting for two weeks"*

> *"Watch the sentiment detection trigger. The AI doesn't keep trying to help — it recognizes frustration below the threshold and escalates immediately. That's intentional."*

---

## Part 5: Voice Agent — The Showstopper (8–10 min) ⭐

Click the **"Call Us"** button on the homepage.

> *"This is what Sierra.AI does. A customer can call from the website — no phone number needed — and talk to an AI that knows their orders, knows the policies, and knows when to hand off."*

**Conversation flow:**

```
You:    "Hi, I need to check on my order"
Agent:  [Warm greeting, asks for order number]
You:    "It's ER-10042"
Agent:  [Looks up order, gives status — shipped, tracking, ETA]
You:    "Actually I want to return it"
Agent:  [Checks 30-day window, confirms eligible, offers refund or store credit]
You:    "This is ridiculous, I've been waiting forever" [express frustration]
Agent:  [Detects frustration → escalates immediately with empathetic message]
```

Key moments to call out:
- **Voice quality** — conversational, not robotic
- **Context switching** — moves from order lookup to return without losing context
- **Escalation message** — warm, reassuring, promises context is preserved
- **No repetition** — the human agent will see everything

---

## Part 6: Admin Escalation Dashboard (2 min)

Open `/admin`:

> *"When a conversation escalates, it appears here in real time. The human agent sees: who the customer is, which order, the full transcript, sentiment score, why it escalated, and a recommended action.*
>
> *The customer never repeats themselves. That's not a nice-to-have — it's the entire point."*

Click **View transcript** on an escalation to show the full conversation.

---

## Part 7: The Architecture Behind It (2 min)

> *"The reason all three channels — voice, chat, email — give consistent answers is this file: `cs-context.ts`. It's about 250 lines. It does sentiment analysis, intent detection, order lookups, return eligibility checks, escalation logic, and response generation. Voice gets short responses. Email gets formal ones. But the logic is identical.*
>
> *This is the architectural decision I'm most proud of. It means a customer who called yesterday, chats today, and emails tomorrow gets consistent answers — and a human agent who picks up an escalation has the full picture."*

---

## Q&A — Key Talking Points

**"How does the voice agent know what I ordered?"**
> *"Retell sends the conversation transcript to our webhook on every turn. We parse out the order ID, hit Firestore, and return the data in the response. Retell speaks it. Total latency under 500ms."*

**"What happens when the AI is wrong?"**
> *"It escalates. The escalation rules are deterministic — sentiment below 0.3, refund over $50, or the customer asks for a human. The AI doesn't guess at the edge cases. It hands off with full context."*

**"Why voice specifically?"**
> *"Voice is the hardest channel to get right and the most impactful. Typing is slow. Voice is natural. For emotional situations — a missing order, a damaged package — voice builds trust faster than chat. Sierra gets this. That's why it's the showstopper here."*

**"How would this scale?"**
> *"Firestore scales automatically. The API routes are stateless. The voice agent handles concurrent calls. The only bottleneck is response latency to Retell — which we keep under 1 second by not using an LLM in the hot path."*

---

## Closing (1 min)

> *"Voice-first, but human-empowered. The AI handles the 80% — order lookups, return processing, policy questions. When it hits the 20% — frustration, edge cases, high-value refunds — it escalates gracefully and hands off full context. The human agent can focus on the hard problems. That's the model that wins.*
>
> *I built this specifically because I think that's Sierra's insight too."*

---

## Time Breakdown

| Section | Time |
|---------|------|
| Context + Architecture | 3 min |
| Infrastructure (GitHub, Jira) | 3 min |
| Shop demo | 4 min |
| Webchat | 3 min |
| **Voice agent** ⭐ | **10 min** |
| Admin dashboard | 2 min |
| Architecture deep-dive | 2 min |
| Q&A | 5 min |
| **Total** | **~32 min** |

---

## Backup Plans

| Problem | Fallback |
|---------|---------|
| Voice agent down | Play backup video, or demo Voiceflow webchat instead |
| Firestore unreachable | Orders page uses local JSON fallback |
| Firebase hosting down | Run locally (`npm run dev`) |
| Network issues | Show code + architecture diagrams from repo |
