# Ember & Roast - Demo Script for Interview

This is the step-by-step walkthrough for demoing the project to Sierra.AI interviewers.

**Duration**: ~20-30 minutes (adjust based on interviewer interest)

## Setup Before Demo

- [ ] Book a laptop with good internet
- [ ] Have the Vercel/Firebase URL open and tested
- [ ] Test the voice agent with headphones (Retell.ai requires audio)
- [ ] Have Jira board open in a separate window/tab
- [ ] Have GitHub repo open in a separate window/tab
- [ ] Have this script handy for reference
- [ ] Record a backup video as fallback (especially for voice demo)
- [ ] Have a few order IDs memorized: ER-10042, ER-10038, ER-10045, ER-10031

## Demo Narrative

### Part 1: Context & Architecture (3-5 min)

**Start with the big picture.**

*"This project demonstrates how AI can solve customer service challenges while maintaining human oversight and empathy. It's built for Sierra.AI specifically—a company that understands voice-first customer service."*

Show the architecture diagram (use the one in README or docs/architecture.md):

*"The project has three layers:*
- *Development layer (AI agents building the shop)*
- *Cloud infrastructure (Firebase, Firestore)*
- *Customer service layer (voice, webchat, email)"*

### Part 2: Professional Infrastructure (2-3 min)

**Show Jira board first (if available)**

Open the Jira EMBER project in a browser tab:

*"Let's start with how a real team would organize this work. This is the Jira board where the development team tracks their work."*

Highlight:
- **Epics** at the top: "Product Catalog", "Customer Service Layer", "Voice Agent"
- **Sprint board** showing task flow
- **Agent comments** on tickets showing what each agent worked on

*"Notice that each agent is assigned tasks matching their role. The PM creates epics and stories, the designers take UI stories, engineers pick up backend and frontend work."*

### Part 3: GitHub Repository (1-2 min)

*"The code lives in GitHub with professional CI/CD practices."*

Open the GitHub repo:
- Click **Actions** tab
  - *"See the CI pipeline? On every PR, we lint and type-check. On merge, we build and deploy to Firebase."*
- Click **Pull Requests** tab
  - *"Each PR is linked to a Jira ticket (EMBER-###). The agents create feature branches and open PRs."*
  - *"This is not automated—the agents are actually engaging with real development tools."*

### Part 4: The Shop (3-5 min)

*"Now let's see what was actually built. This is Ember & Roast—a specialty coffee roaster with premium positioning."*

Open the live shop:

#### 4a. Homepage
Scroll the homepage:
- Hero section with brand story
- Featured products
- Call-to-action buttons

*"The design feels warm and artisanal. That's intentional. Coffee customers want to feel the craft."*

#### 4b. Product Catalog
Click **Browse Products**:

*"Here's the full catalog. 8 specialty coffees from around the world. Notice each one has origin, roast level, tasting notes. This is the kind of detail that makes specialty coffee customers trust you."*

Point out:
- Product cards with images, names, prices
- Responsive design (mention it works on mobile)
- Pricing from $16-25 for single-origin, bundles, subscriptions

#### 4c. Order Tracking
Click **Track Order**:

*"One of the key customer service features. Let me look up an order: ER-10042"*

Type in the order ID and search:

*"Here we see:*
- *Order status (shipped)*
- *Tracking number and carrier*
- *Order date and estimated delivery*
- *All items with prices*

*This same data is available through the voice agent, the webchat, and email. That's the key insight: all channels access the same backend."*

Try another order (ER-10031 with "return_requested" status):

*"This order has a return requested. The system knows the customer's intent and can automatically process it or escalate if needed."*

### Part 5: Customer Service - Webchat Demo (3-5 min)

**This is the polished, easier demo. Do this one first.**

Look for the **Voiceflow webchat widget** at the bottom-right of the shop (if implemented):

*"This is the webchat powered by Voiceflow. It's embedded right on the shop, available 24/7. Let me interact with it."*

Click the chat widget and try:

**Interaction 1: Order Lookup**
- Type: "What's the status of my order ER-10042?"
- Expected response: Agent should look up the order and provide tracking info

**Interaction 2: Product Question**
- Type: "What's the difference between the Ethiopian and the Colombian?"
- Expected response: Agent should use knowledge base to compare flavor profiles

**Interaction 3: Return Request**
- Type: "I'd like to return an order"
- Expected response: Agent should explain return policy and ask for order ID

**Interaction 4: Escalation**
- Type: "This coffee tastes stale and I'm really upset" (express frustration)
- Expected response: Agent should recognize frustration and offer escalation to human

*"Notice the transitions. The AI is helpful and warm, but when it detects frustration, it doesn't keep trying—it escalates. That's empathy."*

### Part 6: Customer Service - Voice Demo (5-10 min) ⭐ THE SHOWSTOPPER

**This is the impressive part. Have a backup video ready in case of issues.**

*"Now the star of the show: voice customer service. This is what Sierra.AI does. Let me call the system."*

Click the **"Call Us"** button (Retell.ai Web SDK):

*"The browser will open a call interface. I can literally call the AI agent from the website."*

**Have a real conversation** (be natural, don't script it too much):

```
You: "Hi, I'd like to check on my order"
Agent: [Responds warmly, asks which order]
You: "Order number ER-10042"
Agent: [Looks up order, provides tracking info, estimated delivery]
You: "Actually, I need to return it. Can you help with that?"
Agent: [Checks return window, processes return, confirms]
You: [Try expressing mild frustration about delivery time]
Agent: [Acknowledges, escalates with context preserved]
```

*Key moments to highlight:*
- The voice is warm and conversational, not robotic
- The agent handles context switching (order → tracking → return) smoothly
- Sentiment detection triggers escalation
- When escalating, it promises full context will be preserved

**If voice agent has issues**, play the backup video instead:

*"Let me show you a recording of the voice interaction in action..."*

### Part 7: Admin Dashboard - Escalation Queue (2 min)

If implemented, show the `/admin` escalation dashboard:

*"When an interaction escalates, it appears here with full context: customer name, order info, conversation transcript, why it escalated."*

*"The human agent can see everything the AI saw. No need for the customer to repeat themselves."*

### Part 8: Behind-the-Scenes - CrewAI Dev Team (2-3 min)

*"Here's the meta part: this entire shop was built by AI agents."*

Show the CrewAI directory structure and explain:

*"The crew has 4 agents:*
- *PM writes requirements and user stories*
- *Designer creates design system and layouts*
- *Backend engineer builds APIs and data models*
- *Frontend engineer implements components and pages"*

Run the crew (or show output from a previous run):

```bash
cd crew
python main.py
```

*"Watch as the agents work together. The PM's output becomes input for the designer. The designer's specs guide the engineers. It's like watching a real team collaborate."*

Point out the outputs:
- `docs/product_requirements.md` - PM's work
- `docs/design_system.md` - Designer's work
- `docs/api_routes.md` - Backend engineer's work
- Generated components and pages - Frontend engineer's work

*"This is a simulation of how AI can amplify human engineering capacity. The PM doesn't write code, but the AI team it creates does."*

## Q&A Talking Points

### If asked: "How would you scale this?"

*"The architecture is designed for scale from day one:*
- *Firestore scales automatically*
- *Voice/chat agents can handle concurrent conversations*
- *The CS context layer is stateless and can be cached*
- *Jira and GitHub workflows scale with the team"*

### If asked: "What about accuracy?"

*"The voice agent has guardrails:*
- *It knows which orders are in the system (not hallucinating)*
- *Return policy is hardcoded in the knowledge base*
- *If it doesn't know something, it escalates*
- *All conversations are logged for quality review"*

### If asked: "Why focus on voice?"

*"Voice is the future of customer service because:*
- *It's the fastest way to resolve issues*
- *Customers prefer calling for complex problems*
- *It's harder to do well than chat (more real-time, no typing)*
- *Sierra.AI gets this. That's why I led with it."*

### If asked about Jira integration:

*"The agents actually interact with Jira via the API. They:*
- *Create epics and stories*
- *Move tickets through the workflow*
- *Add comments with their work*
- *Link PRs to tickets"*

*"It's not just a nice visualization—the agents are genuinely working within professional tools."*

## Backup Plans

If anything breaks during demo:

- **Voice agent down**: Play backup video or show Voiceflow webchat instead
- **Firestore connection down**: Show static product/order data in the code
- **Vercel down**: Open GitHub, show the code and architecture
- **Jira access denied**: Explain the integration conceptually with screenshots
- **Network issues**: Show screenshots of each feature

## Closing (1 min)

*"To summarize: This project demonstrates how voice-first customer service, multi-channel consistency, professional infrastructure, and AI-driven development can come together. It's built specifically for Sierra.AI because I understand that the future of customer service is voice-first, but human-empowered. The AI knows when to hand off. The human agent has full context. That's the model that wins."*

Ask if they have questions or want to dive deeper into any part.

---

## Time Breakdown

- Context & Architecture: 3 min
- Professional Infra (Jira, GitHub): 3 min
- Shop demo: 5 min
- Webchat demo: 5 min
- Voice demo: 10 min ⭐
- Admin/Escalation: 2 min
- CrewAI: 3 min
- Q&A: 5 min

**Total: 36 minutes** (trim if shorter slots)

## Pro Tips

1. **Speak from the customer's perspective first** - "As a customer, I want to..." then show how the system solves it
2. **Be honest about simulation** - "This is a prototype, but the architecture is production-ready"
3. **Emphasize the voice experience** - It's what makes Sierra special
4. **Show your thinking** - Explain why you made each choice (architecture, design, escalation rules)
5. **Stay curious** - Ask them questions about their system too
6. **Practice with live audience** - Have a friend do a dry run
