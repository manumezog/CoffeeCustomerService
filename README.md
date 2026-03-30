# Ember & Roast — AI-Powered Customer Service Showcase

A Sierra.AI interview showcase project demonstrating voice-first customer service, multi-channel AI, and professional engineering practices.

**Live demo:** https://coffee-cs.vercel.app

---

## What This Is

Ember & Roast is a specialty coffee roastery with a fully working AI customer service system. The project shows:

- **Voice-first CS** — Retell.ai voice agent with real-time Firestore order lookup via function calling
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
| Project Mgmt | Jira Cloud (EMBER project) |
| CI/CD | GitHub Actions |

---

## Demo Orders

These orders are seeded in Firestore for demo purposes:

| Order ID | Status | Customer |
|----------|--------|----------|
| ER-10042 | Shipped (UPS) | Alice Johnson |
| ER-10031 | Return Requested | David Wilson |
| ER-10050 | Delivered | Emma Brown |
| ER-10038 | Delivered | Bob Smith |
| ER-10045 | Roasting | Carol Davis |

Try saying "Check my order ER-10042" to the voice agent.

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

## Sierra.AI Alignment

| Sierra Value | How This Project Demonstrates It |
|-------------|----------------------------------|
| **Voice-First** | Retell voice agent is the primary channel, with real order lookup via function calling |
| **Multi-Channel** | Same `cs-context.ts` brain serves voice, chat, and email consistently |
| **Empathetic AI** | Sentiment analysis detects frustration; escalation preserves full context |
| **Seamless Handoff** | Transcript + order data saved to Firestore before human agent takes over |
| **Outcome-Driven** | Agent processes returns, provides tracking — not just answers |
| **Professional Engineering** | GitHub CI/CD, Jira EMBER project, Vercel infra |
| **Agent-Building Agents** | Claude Code team (PM, Designer, BE, FE) built this codebase |

---

## Interview Talking Points

1. **"Voice is the primary channel"** — every architectural decision optimizes for voice first, then adapts to chat and email
2. **"The AI knows its limits"** — escalation triggers on frustration, high-value refunds, or repeated contact; always with full context preserved
3. **"Consistency across channels"** — `cs-context.ts` is called by all three channels; customer always gets the same answer
4. **"Function calling bridges AI and data"** — Retell's built-in LLM calls `/api/orders/lookup` to fetch real Firestore data mid-conversation
5. **"AI multiplies the team"** — four Claude Code agents (PM, Designer, BE, FE) drove the build autonomously

---

*Built as a Sierra.AI interview showcase — March 2026*
