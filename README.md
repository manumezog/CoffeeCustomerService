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
│   │   │   ├── firestore.ts     # Firestore helpers (Admin SDK)
│   │   │   ├── firebase.ts      # Firebase client config (frontend only)
│   │   │   └── firebase-admin.ts # Firebase Admin SDK (server-side)
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
# Firebase (client — public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=

# Firebase Admin SDK (server — keep secret)
FIREBASE_SERVICE_ACCOUNT=          # JSON from Firebase Console → Service Accounts

# Retell
NEXT_PUBLIC_RETELL_AGENT_ID=
RETELL_API_KEY=                    # From Retell dashboard
RETELL_WEBHOOK_SECRET=             # From Retell dashboard → Agent → Webhook Secret

# Voiceflow
NEXT_PUBLIC_VOICEFLOW_PROJECT_ID=
VOICEFLOW_WEBHOOK_SECRET=          # Optional

# Resend
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=             # From Resend dashboard → Webhooks

# Internal secrets
ESCALATION_SECRET=                 # Protects escalation API
NEXT_PUBLIC_ESCALATION_SECRET=     # Same value — used by admin dashboard
LOOKUP_ORDER_KEY=                  # Must match header set in Retell function tool
ORDER_ADMIN_SECRET=                # Protects order status PATCH
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

## Security

All server-side Firestore access uses the Firebase Admin SDK (bypasses client security rules). Firestore Security Rules deny all direct client reads/writes. API endpoints are protected as follows:

| Endpoint | Auth method |
|---|---|
| `POST /api/retell` | HMAC-SHA256 (`RETELL_WEBHOOK_SECRET`) |
| `POST /api/orders/lookup` | Static header (`LOOKUP_ORDER_KEY`) |
| `PATCH /api/orders/[id]` | Bearer token (`ORDER_ADMIN_SECRET`) |
| `GET/POST/PATCH /api/cs/escalation` | Static header (`ESCALATION_SECRET`) |
| `POST /api/cs/webhook` | Origin allowlist + optional Bearer (`VOICEFLOW_WEBHOOK_SECRET`) |
| `POST /api/cs/email` | HMAC-SHA256 (`RESEND_WEBHOOK_SECRET`) |
| `POST /api/retell/token` | Origin allowlist |

---

## Roadmap

### Sprint 4 — Security & Infrastructure ✅
| Story | Status |
|-------|--------|
| EMBER-35: Webhook signature validation (Retell + Resend) | ✅ Done |
| Migrate Firestore to Admin SDK | ✅ Done |
| Lock down all API endpoints with auth | ✅ Done |
| Fix admin dashboard 403 on escalation fetch | ✅ Done |

### Sprint 5 — Polish & Reliability
| Story | Priority |
|-------|----------|
| Fix Resend inbound email body fetch | P1 |
| Fix sentiment negation bug in cs-context.ts | P1 |
| Order GET rate limiting (prevent enumeration) | P2 |
| Add to cart + checkout flow | P2 |
| Order confirmation email via Resend | P2 |
| Mobile nav accessibility | P3 |

---

*Built with Next.js, Firebase, Retell.ai, Voiceflow, and Claude Code*
