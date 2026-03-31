# Ember & Roast — AI-Powered Customer Service

Voice-first customer service platform for a specialty coffee roastery. Multi-channel AI that handles orders, returns, and escalations across voice, webchat, and email.

**Live demo:** https://coffee-cs.vercel.app

---

## Overview

Ember & Roast is a specialty coffee roastery with a fully working AI customer service system:

- **Voice agent** — Retell.ai with real-time Firestore order lookup via function calling
- **Webchat** — Voiceflow widget embedded in the shop
- **Unified CS brain** — `cs-context.ts` handles sentiment analysis, escalation rules, and order lookups across all channels
- **Admin dashboard** — Real-time escalation tracking with full conversation transcripts
- **Claude Code agent team** — PM, Designer, Backend, Frontend agents that built this codebase

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         Claude Code Agent Dev Team          │
│   PM → Designer → Backend → Frontend        │
│              ↓ Jira + GitHub                │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   Vercel (hosting)  │
        │   Next.js 15 App    │
        └──────────┬──────────┘
                   │
   ┌───────────────┼────────────────┐
   │               │                │
┌──▼──────┐  ┌─────▼──────┐  ┌─────▼─────┐
│  Voice  │  │  Webchat   │  │   Email   │
│ Retell  │  │ Voiceflow  │  │  Resend   │
└──┬──────┘  └────────────┘  └───────────┘
   │
   └──► /api/orders/lookup ──► Firestore
```

All CS channels share the same `cs-context.ts` backend for consistent responses.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Database | Firebase Firestore |
| Hosting | Vercel (auto-deploys on push to main) |
| Voice CS | Retell.ai (Single Prompt Agent + function calling) |
| Webchat CS | Voiceflow |
| Email CS | Resend |
| Dev Team | Claude Code custom agents |
| Project Mgmt | Jira Cloud |
| CI/CD | GitHub Actions |

---

## Demo Orders

| Order ID | Status | Customer |
|----------|--------|----------|
| ER-10042 | Shipped (UPS) | Alice Johnson |
| ER-10031 | Return Requested | David Wilson |
| ER-10050 | Delivered | Emma Brown |
| ER-10038 | Delivered | Bob Smith |
| ER-10045 | Roasting | Carol Davis |

---

## Project Structure

```
CustomerService/
├── shop/                        # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Homepage with voice + chat
│   │   │   ├── products/        # Product catalog + detail pages
│   │   │   ├── orders/          # Order tracking page
│   │   │   ├── admin/           # Escalation dashboard
│   │   │   └── api/
│   │   │       ├── retell/      # Retell webhook + token endpoint
│   │   │       ├── orders/      # Order CRUD + lookup for Retell
│   │   │       ├── products/    # Product listing
│   │   │       └── cs/          # CS webhook, email, escalation
│   │   ├── components/
│   │   │   ├── CallButton.tsx   # Retell Web SDK integration
│   │   │   └── VoiceflowWidget.tsx
│   │   ├── lib/
│   │   │   ├── cs-context.ts    # Unified CS brain (all channels)
│   │   │   ├── firestore.ts     # Firestore helpers
│   │   │   └── firebase.ts      # Firebase config
│   │   └── data/
│   │       ├── products.json    # 8 specialty coffees
│   │       └── orders.json      # Demo orders
│   └── scripts/
│       └── seed-firestore.ts    # DB seed script
├── .claude/agents/              # Claude Code agent definitions
│   ├── product-manager.md
│   ├── ui-designer.md
│   ├── backend-engineer.md
│   └── frontend-engineer.md
├── docs/
│   ├── architecture.md
│   ├── demo-script.md
│   └── sierra-alignment.md
└── .github/workflows/           # CI/CD (lint + Vercel deploy)
```

---

## Local Development

```bash
cd shop
npm install
cp .env.example .env.local   # Fill in your credentials
npm run dev                  # http://localhost:3000
```

### Seed Firestore

```bash
cd shop
npx tsx --env-file=.env.local scripts/seed-firestore.ts
```

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=
NEXT_PUBLIC_RETELL_AGENT_ID=
NEXT_PUBLIC_RETELL_API_KEY=
RETELL_API_KEY_PRIVATE=
NEXT_PUBLIC_VOICEFLOW_PROJECT_ID=
RESEND_API_KEY=
```

---

## Deployment

Push to `main` — Vercel auto-deploys. No manual steps needed.

Add all environment variables in **Vercel → Project → Settings → Environment Variables**.

---

## How It Works

### Voice Channel
The voice agent (Retell.ai) uses function calling to hit `/api/orders/lookup` mid-conversation. When a customer gives their order number, the agent fetches real data from Firestore and responds with live status, tracking info, and return eligibility.

When a customer is frustrated or asks for a human, the agent calls `report_escalation` which saves the conversation to Firestore. The escalation appears on the admin dashboard within seconds.

### CS Brain (`cs-context.ts`)
All non-voice channels run through `cs-context.ts` which:
- Detects sentiment across the full conversation history
- Extracts order IDs from natural language
- Applies escalation rules (frustration, high-value refunds, repeated contact)
- Generates channel-appropriate responses (brief for voice, detailed for chat/email)

### Admin Dashboard
Polls Firestore every 5 seconds for open escalations. Shows channel, customer, order, sentiment score, recommended action, and full transcript. Agents can claim or resolve escalations directly from the dashboard.

---

## Roadmap

### Sprint 4 — Stability & CS Polish
| Story | Priority |
|-------|----------|
| EMBER-34: Fix Resend inbound email body fetch | P1 |
| EMBER-35: Webhook signature validation (Retell + Resend) | P1 |
| EMBER-36: Fix sentiment negation bug in cs-context.ts | P1 |
| EMBER-37: UI polish — product cards, hero, Badge component | P2 |
| EMBER-38: CallButton error handling and retry UX | P2 |
| EMBER-39: Link escalation to cs-interaction record | P3 |

### Sprint 5 — E-Commerce Core
| Story | Priority |
|-------|----------|
| EMBER-40: Add to cart with localStorage | P1 |
| EMBER-41: Checkout page + order creation in Firestore | P1 |
| EMBER-42: Order confirmation email via Resend | P1 |
| EMBER-43: Mobile nav accessibility (focus trap, keyboard) | P2 |

---

*Built with Next.js, Firebase, Retell.ai, Voiceflow, and Claude Code*
