# Project Guidelines for Claude Code

This document provides guidance for working on the Ember & Roast project.

## Project Context

**What:** A Sierra.AI interview showcase project demonstrating:
- Multi-agent AI team (CrewAI) building an e-commerce platform
- Professional DevOps (GitHub Actions, Jira, GCP)
- Voice-first customer service with multi-channel support
- Cloud infrastructure on Firebase/Firestore

**Why:** Interview preparation for Sierra.AI (agentic customer service company)

**For whom:** Software engineer interviewing at Sierra.AI

**Timeline:** ~13 days for full implementation (currently in Phase 1)

## Current Status

- ✅ Phase 1: Project Infrastructure (Git, Next.js, Firebase, GitHub Actions, CrewAI setup)
- 🔄 Phase 2-7: In progress

## Key Files & Directories

### Architecture
- **Plan file**: `C:\Users\manum\.claude\plans\wiggly-plotting-hennessy.md` - Implementation roadmap
- **Memory**: `C:\Users\manum\.claude\projects\C--Users-manum-Desktop-IA-Projects-CustomerService\memory\` - Project context

### Critical Implementation Files (When Reached)

**Phase 3: CS Backend** (Days 5-6)
- `shop/src/lib/cs-context.ts` - **CRITICAL**: Shared CS brain for all channels
  - Implements order lookup, policy retrieval, sentiment analysis, escalation rules
  - Used by voice, webchat, and email channels
  - Must be rock-solid - the architectural centerpiece

**Phase 4: Voice Agent** (Days 8-9) - **THE SHOWSTOPPER**
- `shop/src/app/api/retell/route.ts` - Retell Custom LLM webhook
  - Receives conversation state from Retell
  - Calls `cs-context.ts` for intelligent responses
  - Detects escalation triggers
  - Returns natural, warm responses

**Phase 5: CrewAI Dev Team** (Days 10-11)
- `crew/crew.py` - Orchestrates 4-agent team
- `crew/config/agents.yaml` - Agent definitions
- `crew/config/tasks.yaml` - Task definitions
- `crew/tools/jira_tool.py` - Jira API integration
- `crew/tools/github_tool.py` - GitHub API integration

### Documentation Stubs

These files exist but need content:
- `docs/architecture.md` - System architecture with diagrams
- `docs/sierra-alignment.md` - How project maps to Sierra's values
- `docs/demo-script.md` - Step-by-step demo walkthrough

## Development Principles

1. **Voice-first** - Every decision prioritizes the voice experience
2. **Consistency** - All CS channels share the same backend brain
3. **Empathy** - AI knows when to hand off, escalation preserves context
4. **Professional** - GitHub CI/CD, Jira, proper infra - not a toy demo
5. **Completeness** - Every feature works end-to-end, not half-finished

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Cloud Functions
- **Database**: Firestore (NoSQL, serverless)
- **Voice CS**: Retell.ai
- **Webchat CS**: Voiceflow
- **Email CS**: Resend
- **Dev Team**: CrewAI, Python
- **CI/CD**: GitHub Actions
- **Project Mgmt**: Jira Cloud
- **Hosting**: Firebase Hosting

## Common Tasks

### Running the Shop
```bash
cd shop
npm install  # First time only
npm run dev  # http://localhost:3000
```

### Running the Dev Team
```bash
cd crew
pip install -r requirements.txt  # First time
python main.py
```

### Deploying
```bash
cd shop
npm run build
firebase deploy
```

### Creating a Commit
Use descriptive messages that explain the WHY:
```bash
git commit -m "Implement cs-context.ts with sentiment analysis and escalation

Shared CS brain used by voice, webchat, and email channels.
Detects customer frustration and triggers human escalation proactively.
Preserves full conversation context in Firestore during handoff."
```

## Priorities

1. **Get Phase 2-3 working** - Foundation is critical
2. **Make voice work** - It's the showstopper for Sierra interview
3. **Beautiful demo flow** - Should feel like a real product, not a demo
4. **Jira board clean** - Interview audience should see professional workflow
5. **Escalation working** - This is where you show empathy and maturity

## What NOT to Do

- ❌ Don't add unnecessary features beyond the plan
- ❌ Don't over-engineer - aim for simple, working solutions
- ❌ Don't skip the empathy layer - escalation is the core value prop
- ❌ Don't skip documentation - explain your thinking
- ❌ Don't commit incomplete work - each phase should be demo-ready

## Interview Talking Points

When discussing with Sierra:

1. **Architecture**: "Voice is the primary channel, but customers want consistency across chat and email. So I built a unified `cs-context.ts` that all channels call."

2. **Empathy**: "The AI knows its limits and hands off gracefully. When frustration is detected, it doesn't keep trying—it escalates with full context preserved so the customer never repeats themselves."

3. **Team Simulation**: "The CrewAI agents show how AI can multiply engineering capacity. The PM defines requirements, designer creates specs, and engineers build—all driven by the same platform."

4. **Professionalism**: "GitHub CI/CD, Jira board, proper infrastructure—this should look like a real product team, not a hobby project."

5. **Voice-First**: "Everything is optimized for voice. The conversational tone, the escalation triggers, the data model—it's all designed with voice interaction as the primary experience."

## Next Steps (When Ready to Continue)

1. **Install shop dependencies**: `cd shop && npm install`
2. **Set up Firebase**: Create Firebase project, get credentials
3. **Configure env vars**: Copy `.env.example` to `.env.local`
4. **Create Jira project**: EMBER project with Scrum board
5. **Configure Retell.ai**: Create agent, get webhook URL
6. **Configure Voiceflow**: Create agent, get embed code
7. **Implement Phase 2-3**: CS backend layer
8. **Implement Phase 4**: Voice agent (the showstopper)

## Contact/Questions

Refer to the plan file for detailed implementation strategies for each phase.

---

**Last Updated**: 2026-03-29
**Status**: Phase 1 complete, ready for Phase 2
**Effort Level**: Low (quick, straightforward implementation with minimal overhead)
