# Ember & Roast - AI-Powered Customer Service Showcase

A comprehensive Sierra.AI interview showcase project demonstrating:
- **Multi-agent AI team** building an e-commerce platform (CrewAI)
- **Professional DevOps** with GitHub CI/CD and Jira integration
- **Voice-first customer service** with multi-channel support (Retell.ai, Voiceflow)
- **Cloud infrastructure** on Google Cloud Platform (Firebase, Firestore)

## Project Overview

Ember & Roast is a specialty coffee roaster with an advanced customer service system powered by AI agents. The project has two main components:

### 1. Development Layer (CrewAI)
A team of 4 AI agents simulating a real engineering organization:
- **Product Manager** - Defines requirements, user stories, and product strategy
- **UI/UX Designer** - Creates design systems and page layouts
- **Frontend Engineer** - Builds React/TypeScript components and pages
- **Backend Engineer** - Designs APIs and data models

The agents work sequentially, with each agent's output informing the next, demonstrating how AI can autonomously contribute to software development.

### 2. Customer Service Layer
Multi-channel customer service handling:
- **Voice** (Retell.ai) - Phone-based AI customer service agent
- **Webchat** (Voiceflow) - Website chat widget
- **Email** (Resend) - Email integration
- **Unified Backend** - All channels share the same CS brain for consistent answers

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.10+
- Firebase CLI
- GitHub account with gh CLI
- Jira Cloud account (optional, for MCP integration)

### Setup

#### 1. Install Dependencies

**For the Next.js shop:**
```bash
cd shop
npm install
```

**For CrewAI development team:**
```bash
cd crew
pip install -r requirements.txt
cp .env.example .env  # Configure your API keys
```

#### 2. Configure Environment

Create `shop/.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-key>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ember-and-roast
NEXT_PUBLIC_RETELL_API_KEY=<your-retell-key>
```

#### 3. Run the Shop

```bash
cd shop
npm run dev
# Open http://localhost:3000
```

#### 4. Run the Development Team

```bash
cd crew
python main.py
```

The crew will generate:
- Product requirements and user stories
- Design system and layouts
- API specifications
- UI components and pages

## Architecture

```
┌─────────────────────────────────────────┐
│     DEVELOPMENT LAYER (CrewAI)          │
│  PM → Designer → Backend → Frontend      │
│                 ↓                        │
│         Jira (Atlassian)                │
│         GitHub Actions CI/CD            │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   GCP / Firebase    │
        │   Hosting + Store   │
        └──────────┬──────────┘
                   │
   ┌───────────────┼───────────────┐
   │               │               │
┌──▼──┐       ┌────▼────┐     ┌────▼──┐
│Voice│       │ Webchat │     │ Email │
│     │       │         │     │       │
└─────┘       └─────────┘     └───────┘
```

## Project Structure

```
CustomerService/
├── shop/                    # Next.js e-commerce app
│   ├── src/
│   │   ├── app/            # Pages and API routes
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities (Firebase, CS logic)
│   │   └── data/           # Static data (products, orders)
│   └── firebase.json
├── crew/                    # CrewAI agents
│   ├── config/             # agents.yaml, tasks.yaml
│   ├── tools/              # Custom tools for agents
│   ├── main.py
│   └── crew.py
├── docs/                    # Documentation
│   ├── architecture.md
│   ├── demo-script.md
│   └── sierra-alignment.md
├── .github/
│   └── workflows/          # CI/CD pipelines
│       ├── ci.yml
│       └── deploy.yml
└── .firebaserc
```

## Key Features

### E-Commerce Shop
- ✅ Product catalog with 8 specialty coffees
- ✅ Product details and browsing
- ✅ Order tracking (try: ER-10042)
- ✅ Responsive design with Tailwind CSS
- ✅ Firebase Hosting + Firestore integration

### Customer Service
- 🎯 **Voice Agent** - Retell.ai powered conversation
  - Order tracking and returns
  - Product recommendations
  - Escalation to human agents
- 💬 **Webchat** - Voiceflow visual flows
  - Intent detection
  - Order lookup
  - Knowledge base integration
- 📧 **Email** - Resend integration
  - Intelligent responses
  - Escalation routing

### Development Team
- 🤖 **CrewAI Agents** - Autonomous AI team
  - Sequential workflow (PM → Design → Backend → Frontend)
  - Outputs to Jira tickets
  - Pushes to GitHub with feature branches
  - Integrated with CI/CD pipeline

### Infrastructure
- 🔧 **GitHub Actions** - Automated testing and deployment
  - Lint on PR
  - Build and deploy to Firebase on merge
- 📋 **Jira Integration** - Agents manage their own tickets
  - Create stories and epics
  - Update status and add comments
  - Link PRs to tickets
- ☁️ **Firebase/GCP** - Production-ready infrastructure
  - Hosting with SSR support for Next.js
  - Firestore for database
  - Generous free tier

## Demo Script

See [docs/demo-script.md](./docs/demo-script.md) for a step-by-step walkthrough of:
1. Project overview and architecture
2. Jira board showing agent-driven development
3. GitHub repo with professional CI/CD
4. Shop demo (browse products, track orders)
5. Webchat demo (order lookup, escalation)
6. Voice demo (the showstopper - call and interact with the AI)
7. Escalation dashboard
8. CrewAI run output

## Deployment

### Firebase Hosting

```bash
cd shop
npm run build
firebase deploy
```

### GitHub Actions

Push to `main` branch triggers:
- CI pipeline on PR (lint, type check)
- Deploy pipeline on merge (build + Firebase deploy)

### Jira + GitHub Integration

Configure GitHub in Jira to automatically link commits and PRs to issues:
1. Go to Jira Project Settings > Integrations > GitHub
2. Connect your GitHub repo
3. Agents will reference issue keys in commits (e.g., `EMBER-123`)

## Sierra.AI Alignment

This project demonstrates deep understanding of Sierra's core values:

| Value | How Project Demonstrates It |
|-------|---------------------------|
| **Voice-First** | Retell.ai voice agent is the primary, most polished channel |
| **Multi-Channel** | Same CS backend (`cs-context.ts`) serves voice, chat, email consistently |
| **Empathetic AI** | Agents detect frustration and escalate proactively with full context |
| **Seamless Handoff** | Customer conversation preserved in Firestore during escalation |
| **Outcome-Driven** | CS agents resolve issues (process returns, provide tracking) not just answer |
| **Professional Engineering** | GitHub CI/CD, Jira workflow, GCP infrastructure |
| **Agent-Building Agents** | CrewAI team demonstrates AI as a development multiplier |

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Firebase Cloud Functions
- **Database**: Firestore (NoSQL)
- **Hosting**: Firebase Hosting
- **Voice CS**: Retell.ai
- **Webchat CS**: Voiceflow
- **Email CS**: Resend
- **Dev Team**: CrewAI, Python
- **Project Mgmt**: Jira Cloud
- **CI/CD**: GitHub Actions
- **VCS**: GitHub

## Environment Variables

See `shop/.env.example` for all required environment variables:
- Firebase configuration
- Retell.ai API keys
- Voiceflow agent ID
- Resend email API key
- OpenRouter API key (for CS LLM)

## Next Steps

1. **Set up Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)
2. **Create Jira project** (free tier at [atlassian.com](https://atlassian.com))
3. **Configure Retell.ai agent** at [retell.ai](https://retell.ai)
4. **Set up Voiceflow bot** at [voiceflow.com](https://voiceflow.com)
5. **Deploy to Firebase** - see Deployment section
6. **Run CrewAI team** - `python crew/main.py`
7. **Record demo video** as backup

## Interview Tips

- **Lead with architecture** - Explain how voice-first design flows through the system
- **Emphasize the team** - CrewAI agents demonstrate system thinking and AI as a multiplier
- **Show the handoff** - This is where empathy and professionalism shine
- **Ask about their stack** - Be curious about how Sierra's system works differently
- **Connect to outcomes** - Every feature exists to resolve customer issues faster

## Resources

- [Plan Document](./C:\Users\manum\.claude\plans\wiggly-plotting-hennessy.md)
- [Architecture Diagram](./docs/architecture.md)
- [Demo Script](./docs/demo-script.md)
- [Sierra AI Alignment](./docs/sierra-alignment.md)

## License

MIT - Built for educational and interview purposes.

---

**Created for Sierra.AI Interview Showcase**
*Demonstrating advanced understanding of agentic customer service, multi-agent systems, and professional software engineering.*
