# System Architecture - Ember & Roast

## High-Level Overview

Ember & Roast is a multi-layered system designed around three core principles:
1. **Voice-first** - Voice customer service is the primary and most polished channel
2. **Multi-channel consistency** - All channels (voice, chat, email) access the same backend
3. **Human-empowered** - AI escalates gracefully when it reaches its limits

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT LAYER                             │
│                    (CrewAI Agents)                               │
│                                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │    PM    │→ │ Designer │→ │  Backend │→ │ Frontend │      │
│   │ (Agents) │  │ (Agents) │  │ (Agents) │  │ (Agents) │      │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│         ↓             ↓             ↓             ↓             │
│      Jira Board  ←────────────────────────────  GitHub Repo    │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                  GitHub Actions CI/CD
                           │
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                  CLOUD INFRASTRUCTURE (GCP)                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          Firebase Hosting + Cloud Functions             │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Next.js Application (SSR)              │   │   │
│  │  │  ┌──────────────────────────────────────────┐   │   │   │
│  │  │  │   Shop Frontend                          │   │   │   │
│  │  │  │ - Product Catalog                        │   │   │   │
│  │  │  │ - Order Tracking                         │   │   │   │
│  │  │  │ - Cart & Checkout                        │   │   │   │
│  │  │  │ - CS Widgets (Chat, Voice buttons)       │   │   │   │
│  │  │  └──────────────────────────────────────────┘   │   │   │
│  │  │                                                   │   │   │
│  │  │  ┌──────────────────────────────────────────┐   │   │   │
│  │  │  │   API Routes (/api/*)                    │   │   │   │
│  │  │  │ - /api/products                          │   │   │   │
│  │  │  │ - /api/orders                            │   │   │   │
│  │  │  │ - /api/retell (Voice webhook)            │   │   │   │
│  │  │  │ - /api/cs/webhook (Voiceflow)            │   │   │   │
│  │  │  │ - /api/cs/escalation (Human handoff)     │   │   │   │
│  │  │  └──────────────────────────────────────────┘   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│        ┌──────────────────┼──────────────────┐                  │
│        │                  │                  │                  │
│  ┌─────▼────────┐  ┌─────▼─────┐    ┌──────▼──────┐            │
│  │   Firestore  │  │  Functions │    │  App Engine  │           │
│  │              │  │            │    │              │           │
│  │ Collections: │  │ LLM Routes │    │ (Optional)   │           │
│  │ - /products  │  │ cs-context │    │              │           │
│  │ - /orders    │  │ generation │    │              │           │
│  │ - /cs-intx   │  │            │    │              │           │
│  │ - /escalate  │  │            │    │              │           │
│  └──────────────┘  └────────────┘    └──────────────┘           │
└──────────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
    │  Retell.ai │  │ Voiceflow  │  │   Resend   │
    │  (Voice)   │  │  (Webchat) │  │   (Email)  │
    └────────────┘  └────────────┘  └────────────┘
          │                │                │
          └────────────────┴────────────────┘
                   All use cs-context.ts
```

## Layer 1: Development Layer (CrewAI)

**Purpose**: Simulate a professional development team building the shop.

### Components

#### 4 AI Agents

1. **Product Manager Agent**
   - Defines product catalog and requirements
   - Writes user stories and acceptance criteria
   - Organizes work into epics and sprints
   - Creates/updates Jira tickets

2. **UI/UX Designer Agent**
   - Creates design system (colors, typography, spacing)
   - Designs page layouts for all routes
   - Specifies component behavior and interactions
   - Ensures accessibility and responsiveness

3. **Backend Engineer Agent**
   - Defines data models (products, orders, customers)
   - Creates API routes and specifications
   - Implements business logic
   - Handles database design

4. **Frontend Engineer Agent**
   - Builds React components
   - Implements pages using design specifications
   - Handles state management and API integration
   - Ensures responsive design

#### Workflow

Sequential process with dependencies:

```
PM Agent writes requirements
    ↓
Designer Agent creates specs from requirements
    ↓
Backend Engineer builds API from specs
    ↓
Frontend Engineer implements UI with API specs
```

Each agent outputs:
- Documentation (markdown files)
- Code (TypeScript/React files)
- Jira tickets updated with progress

#### Integration Points

- **Jira**: Agents create issues, add comments, transition through workflow
- **GitHub**: Agents create feature branches, commit code, open PRs
- **Firestore**: Results stored for production use

### Execution Flow

```python
crew.kickoff() {
  1. PM tasks (product catalog, user stories)
  2. Designer tasks (design system, layouts) - depends on PM
  3. Backend tasks (APIs, data models) - independent
  4. Frontend tasks (components, pages) - depends on design + backend
}
```

## Layer 2: Cloud Infrastructure (Google Cloud Platform)

**Purpose**: Provide production-ready infrastructure for the shop and customer service.

### Firebase Hosting

Hosts the Next.js application with:
- Automatic HTTPS and CDN
- Zero-configuration deployment from GitHub
- Serverless functions for API routes
- Environment variables for secrets

### Firestore Database

NoSQL database for data persistence:

```
/products
  ├── /1: { name, price, origin, roast_level, ... }
  ├── /2: { ... }
  └── ...

/orders
  ├── /ER-10042: { customer, items, status, tracking, ... }
  ├── /ER-10038: { ... }
  └── ...

/cs-interactions
  ├── /voice-12345: { customer_id, transcript, sentiment, ... }
  ├── /chat-67890: { ... }
  └── ...

/escalations
  ├── /esc-001: { order_id, reason, context, assigned_to, ... }
  ├── /esc-002: { ... }
  └── ...
```

### Cloud Functions (Optional)

For intensive operations:
- LLM calls for response generation (can offload to Functions)
- Webhook handlers for external services
- Background jobs (email notifications, escalation reminders)

### API Routes (Next.js API Routes)

Deployed as serverless functions:

#### Product APIs
```
GET /api/products
  → Returns all products from Firestore
  → Supports: pagination, filtering by roast_level, price range

GET /api/products/:id
  → Returns single product details
```

#### Order APIs
```
GET /api/orders/:id
  → Returns order details with items and tracking

PATCH /api/orders/:id
  → Updates order (status, return request, etc.)

POST /api/orders
  → Creates new order (checkout flow)
```

#### Customer Service APIs

**Voice (Retell.ai)**
```
POST /api/retell
  ← Request: { conversation_history, current_turn, ... }
  → Response: { next_response, sentiment_score, escalate: boolean, ... }

  Logic:
  1. Extract customer query from conversation
  2. Determine intent (order lookup, return, etc.)
  3. Call cs-context.ts with relevant data
  4. Format response for voice (concise, natural)
  5. Detect escalation triggers
  6. Return response + metadata
```

**Webchat (Voiceflow)**
```
POST /api/cs/webhook
  ← Request: { user_id, message, context, ... }
  → Response: { bot_response, actions, escalate: boolean, ... }

  Logic:
  1. Parse intent from user message
  2. Call cs-context.ts with Voiceflow-specific formatting
  3. Execute API calls (order lookup, etc.)
  4. Format response for chat
  5. Handle escalation transition
```

**Email (Resend)**
```
POST /api/cs/email
  ← Request: { from, subject, body, ... }
  → Response: { reply_sent: boolean, ticket_id, ... }

  Logic:
  1. Parse email for intent
  2. Call cs-context.ts
  3. Send reply via Resend
  4. Log interaction to Firestore
  5. If escalation needed, create ticket
```

#### Escalation API
```
POST /api/cs/escalation
  ← Request: { order_id, conversation_id, reason, context, ... }
  → Response: { escalation_id, ticket_created, assigned_to: null, ... }

  Logic:
  1. Create escalation record in Firestore
  2. Package conversation context
  3. Notify admin dashboard
  4. Wait for human to claim
```

## Layer 3: Customer Service Layer

**Purpose**: Provide multi-channel customer service with consistent experience.

### The Unified Brain: cs-context.ts

**File**: `shop/src/lib/cs-context.ts`

The architectural centerpiece. All customer service channels call this module.

#### Responsibilities

1. **Intent Recognition**
   ```typescript
   Intent = "order_lookup" | "return_request" | "product_question" | "escalation"
   ```

2. **Data Retrieval**
   - Query Firestore for orders
   - Fetch knowledge base (policies, FAQs)
   - Load product information

3. **Business Logic**
   - Check return eligibility (30-day window)
   - Apply policies (return allowed? refund amount?)
   - Generate recommendations

4. **Sentiment Analysis**
   - Parse customer message for emotional tone
   - Score from -1 (angry) to +1 (happy)
   - Trigger escalation if < 0.3

5. **Response Generation**
   - Create empathetic, natural response
   - Include action items (process return, send tracking)
   - Suggest next steps

6. **Escalation Logic**
   ```typescript
   ESCALATION_RULES = [
     sentiment < 0.3 → "Customer frustrated",
     refund > $50 → "High-value refund",
     repeat_contact > 2 → "Recurring issue",
     explicit_request → "Customer asked for human"
   ]
   ```

#### Function Signature

```typescript
async function csContext(input: {
  channel: "voice" | "chat" | "email",
  customerId: string,
  orderId?: string,
  message: string,
  conversationHistory?: Message[],
}): Promise<{
  response: string,
  sentiment: number,
  actions: Action[],
  escalationNeeded: boolean,
  escalationReason?: string,
  context: ContextPackage,
}>
```

#### Example Flow

**User**: "Where's my order? It should have arrived by now!"

```
cs-context.ts:
1. Intent: "order_lookup"
2. Sentiment: 0.2 (slightly frustrated)
3. Fetch order ER-10042 from Firestore
4. Status: "shipped", tracking available
5. Escalation triggered? Sentiment low, check retry count
6. If first contact: respond with tracking info
7. If repeated: escalate immediately

Response: "I see order ER-10042 is with [Carrier],
tracking [####]. Should arrive by March 27.
If it doesn't arrive by then, we'll sort it out right away."
```

### Channel-Specific Implementations

#### 1. Voice (Retell.ai)

**Architecture**:
- Custom LLM webhook at `/api/retell`
- Receives conversation state from Retell
- Returns next AI response
- Executes CS logic via cs-context.ts

**Workflow**:
```
1. Customer calls the "Call Us" number (Retell Web SDK)
2. Retell connects to custom webhook
3. Webhook calls cs-context.ts
4. Response sent back to Retell
5. Retell speaks response via TTS
6. Customer responds
7. Loop continues
```

**Voice-Specific Optimizations**:
- Responses keep to ~2-3 sentences (faster speech)
- Pauses indicate thinking (human-like)
- Tone is conversational and warm
- Escalation message is extra empathetic

#### 2. Webchat (Voiceflow)

**Architecture**:
- Voiceflow visual bot builder
- API steps call `/api/cs/webhook`
- Embedded as widget on shop pages
- Handles intents via dialog flows

**Workflow**:
```
1. Customer opens chat widget
2. Bot greeting: "Hi! How can we help?"
3. Customer asks question
4. Voiceflow parses intent
5. API step calls cs-context.ts
6. Response returned to widget
7. Bot continues conversation
```

**Chat-Specific Features**:
- Rich cards for product recommendations
- Buttons for common actions ("Track order", "Return item")
- Typing indicators for conversational feel
- Escalation transition to "connecting to specialist"

#### 3. Email (Resend)

**Architecture**:
- Resend inbound webhook at `/api/cs/email`
- Parses email body for intent
- Calls cs-context.ts
- Sends reply via Resend API

**Workflow**:
```
1. Customer emails support@emberandroast.com
2. Resend webhook notifies `/api/cs/email`
3. Email parsed for intent and order reference
4. cs-context.ts generates response
5. Reply sent via Resend
6. If escalation needed, ticket created
```

**Email-Specific Features**:
- Formal tone (more professional than chat)
- Detailed explanations (email allows longer text)
- Links to support docs
- Ticket number for escalation reference

### Admin Escalation Dashboard

**Route**: `/admin`

**Purpose**: Display escalation queue for human agents.

**Display**:
```
┌────────────────────────────────────────┐
│ ESCALATION QUEUE                       │
├────────────────────────────────────────┤
│ ✓ ESC-001: Alice Johnson (URGENT)     │
│   Order: ER-10042                      │
│   Reason: Quality complaint            │
│   Sentiment: -0.8 (very upset)         │
│   [View Context] [Claim] [Resolve]    │
│                                        │
│ □ ESC-002: Bob Smith                   │
│   Order: ER-10031                      │
│   Reason: High-value return ($87)      │
│   Sentiment: 0.1 (neutral)             │
│   [View Context] [Claim] [Resolve]    │
│                                        │
│ □ ESC-003: Carol Davis                 │
│   Reason: Repeat contact (3 times)     │
│   Sentiment: 0.3 (frustrated)          │
│   [View Context] [Claim] [Resolve]    │
└────────────────────────────────────────┘
```

**Context Package** (for each escalation):
- Full conversation transcript
- Order details and history
- Customer sentiment score
- AI's previous attempts to resolve
- Recommended action
- Estimated resolution time

## Data Flow Examples

### Example 1: Voice Order Lookup

```
Customer calls "Call Us" button
    ↓
Retell.ai initiated (Web SDK)
    ↓
Customer: "What's my order status?"
    ↓
/api/retell webhook receives: { message: "status", conversation: [...] }
    ↓
cs-context.ts:
  1. Extract order ID from conversation (or ask customer)
  2. Query Firestore /orders/ER-10042
  3. Generate response: "Order shipped, tracking #####, arrives March 27"
  4. Check sentiment: 0.8 (satisfied)
  5. No escalation needed
    ↓
Return: { response: "...", sentiment: 0.8, escalation: false }
    ↓
Retell.ai speaks response
    ↓
Call ends (or continues if customer has more questions)
    ↓
Conversation logged to Firestore /cs-interactions
```

### Example 2: Chat Return Request with Escalation

```
Customer opens webchat widget
    ↓
Bot: "Hi, how can we help?"
Customer: "I need to return an order. It tastes terrible and I'm fed up with this."
    ↓
Voiceflow parses intent: "return_request"
    ↓
API step calls /api/cs/webhook: { intent: "return", sentiment: "negative" }
    ↓
cs-context.ts:
  1. Intent: "return_request"
  2. Sentiment: -0.6 (frustrated)
  3. Ask for order ID (in chat)
  4. Customer: "ER-10031"
  5. Query Firestore /orders/ER-10031
  6. Check 30-day window: ELIGIBLE for return
  7. Check sentiment again: still -0.6
  8. ESCALATION TRIGGERED (repeated quality complaint + frustration)
    ↓
Return: {
  response: "I understand your frustration. Let me connect you with our specialist who can resolve this immediately.",
  escalation: true,
  escalationPackage: {
    conversationHistory: [...],
    orderDetails: { id: "ER-10031", ... },
    sentiment: -0.6,
    reason: "Quality complaint + customer frustration",
    recommendedAction: "Process return, offer replacement or refund"
  }
}
    ↓
Voiceflow transitions: "Connecting to a specialist..."
    ↓
Escalation record created in Firestore /escalations/esc-001
    ↓
Admin dashboard updated (human agent sees notification)
    ↓
Human agent claims ticket, sees full context, resolves issue
    ↓
Customer doesn't have to repeat anything
```

## Deployment Architecture

### GitHub Actions Pipeline

```yaml
On: Push to main
├── Checkout code
├── Install dependencies
├── Build Next.js app
├── Run tests (lint, type check)
├── Build artifacts
└── Deploy to Firebase Hosting

Result: Live at https://firebase-project.web.app
```

### Environment Variables

**Secrets stored in GitHub**:
- FIREBASE_SERVICE_ACCOUNT (JSON key)
- FIREBASE_API_KEY
- FIREBASE_PROJECT_ID
- RETELL_API_KEY (private)
- OPENROUTER_API_KEY

**Runtime configuration**:
- Loaded from environment in Next.js
- Injected by Firebase Hosting
- Never exposed to client (private keys)

### Monitoring (Optional)

In production, monitor:
- API response times (/api/retell, /api/cs/*)
- Firestore query latency
- Sentiment analysis accuracy
- Escalation rate (should be low)
- Voice agent call duration
- Customer satisfaction (CSAT)

## Security Considerations

1. **API Rate Limiting**: Prevent abuse of voice/chat endpoints
2. **Authentication**: Admin dashboard requires auth
3. **Data Privacy**: Customer data encrypted in Firestore
4. **Escalation Context**: Sensitive details only shown to authorized staff
5. **Audit Logging**: All interactions logged for compliance

## Scaling Considerations

**Current Design Scales Because**:
- Firestore handles millions of reads/writes
- Firebase Hosting is globally distributed
- API routes are stateless (can replicate)
- Voice/chat agents are independent per customer
- No single point of failure

**To scale further**:
- Add caching layer (Redis) for product data
- Use Firestore index optimization
- Add Cloud CDN for assets
- Scale voice agent concurrency
- Add load balancing for API routes

---

## Summary

The three-layer architecture ensures:
1. **Development Layer**: Professional team simulation with AI agents
2. **Infrastructure Layer**: Production-ready GCP/Firebase stack
3. **Service Layer**: Voice-first, multi-channel, empathy-driven customer service

All three work together to demonstrate Sierra.AI's vision of the future of customer service.
