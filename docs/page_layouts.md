# Ember & Roast — Page Layouts

Version 1.0 | Author: UI/UX Designer Agent | Date: 2026-03-30

All measurements in px unless noted. Spacing follows the 4px base unit. See `design_system.md` for tokens.

---

## Layout Shell

Every page wraps in:

```
<Nav />          — sticky, z-50, bg-roast, h-64px desktop / h-56px mobile
<main>           — min-h-screen, bg-cream
  [page content]
</main>
<Footer />       — bg-roast, ~280px tall desktop
```

Max content width: `max-w-6xl` (1152px) centered with `mx-auto px-4 md:px-8`.

---

## 1. Homepage

### Hero Section

**Desktop (1280px):**
```
bg-cream
grid grid-cols-2 gap-16 items-center
px-8 py-20
min-height: 560px
```

Left column:
- Eyebrow label: "Small-batch · Direct trade · Roasted weekly" — text-xs, font-semibold, tracking-widest, uppercase, honey color
- H1: "Coffee worth waking up for" — font-heading, text-5xl, roast, leading-tight, mt-3
- Lead paragraph: text-lg, roast-light, mt-4, max-w-md
- CTA row (mt-8, gap-4): Primary button "Shop Coffee" + Secondary button "Track Order"
- Voice widget card: mt-10, bg-white, border border-honey/30, rounded-2xl, shadow-md, p-8, max-w-sm

Right column:
- Hero image: rounded-2xl, aspect-ratio 4/3, object-cover, shadow-lg
- Fallback: warm gradient bg-gradient-to-br from-honey/30 to-ember/20 with centered brand mark SVG

**Mobile (375px):**
- Single column, stacked
- Hero image moves below CTA row
- py-12, text-4xl heading
- Voice widget is full-width below image

### Featured Products Strip

```
bg-white
py-16 px-8
```
- Section label: "What We're Roasting" — text-xs, uppercase, tracking-widest, honey
- H2: text-3xl, font-heading, roast, mt-2
- 3-card horizontal scroll on mobile, 3-col grid on desktop
- "See all coffee" ghost link, right-aligned below grid

### Brand Story Band

```
bg-roast text-cream
py-16 px-8
grid grid-cols-1 md:grid-cols-3 gap-8
text-center
```
Three value props: "Direct Trade", "Fresh Roasted", "Free Shipping $50+"
Each: icon (SVG, honey, 32px) + bold label (font-heading, text-xl) + supporting sentence (text-sm, cream/70)

---

## 2. Product Catalog (`/products`)

```
bg-cream
pt-12 pb-20 px-4 md:px-8
max-w-6xl mx-auto
```

**Page header:**
- H1: "Our Coffee" — font-heading, text-4xl, roast
- Subheading: text-lg, roast-light, mt-2
- Filter row (mt-8, mb-12): pill buttons for "All", "Single Origin", "Blend", "Decaf" — outlined pills, active state bg-ember text-cream

**Product grid:**
- Mobile: 1 col
- Tablet: 2 col, gap-6
- Desktop: 3 col, gap-8

**ProductCard** (see design_system.md §7.1)

**Empty state** (if no products match filter): centered, honey icon, "Nothing here yet — check back soon"

---

## 3. Order Tracking (`/orders`)

```
bg-cream
pt-12 pb-20 px-4 md:px-8
max-w-3xl mx-auto
```

**Search block:**
```
bg-white border border-honey/30 rounded-2xl shadow-sm p-8
```
- Visible `<label for="order-id">`: "Order ID" — text-sm, font-semibold, roast, mb-2
- Input + Search button side by side (flex-row) on tablet+, stacked on mobile
- Input: full-width on mobile, flex-1 on tablet+
- Placeholder: "e.g. ER-10042"

**Order result card:**
```
bg-white border border-honey/30 rounded-2xl shadow-sm mt-8 overflow-hidden
```
- Header bar: p-6, flex justify-between
  - Order ID: font-mono, text-lg, roast
  - Status badge (see design_system.md §7.4)
- Details grid: 2-col on tablet+, 1-col mobile, px-6 pb-6, gap-4
  - Labels: text-sm, font-semibold, roast
  - Values: text-sm, roast-light; tracking number in font-mono
- Items list: px-6, border-t border-honey/10
  - Each row: flex justify-between, py-3, border-b border-honey/10
- Total bar: bg-cream px-6 py-4, flex justify-between, font-bold

**Visual order timeline (FUTURE):**
A 4-step progress bar (Ordered → Roasting → Shipped → Delivered) with the current step highlighted in ember. Include in the next design iteration; mark as out of scope for MVP.

**Not-found state:**
- Warm amber treatment (NOT red — red implies user error aggressively)
- bg-honey/10, border border-honey/30, rounded-xl, p-6
- Icon: SVG search, honey, 32px
- Heading: "We couldn't find that order" — text-lg, font-heading, roast
- Body: "Double-check the order ID format. It should look like ER-10042. If you need help, our AI concierge can look it up for you." — text-sm, roast-light
- CTA: Ghost link "Ask our AI barista" pointing to homepage voice widget

---

## 4. Admin Escalation Dashboard (`/admin`)

```
bg-gray-50 (or bg-cream)
pt-10 pb-20 px-4 md:px-8
max-w-5xl mx-auto
```

**Dashboard header:**
- Left: H1 "Escalation Dashboard" — font-heading, text-3xl, roast
- Sub: text-sm, gray-500, mt-1
- Right: count badge — bg-error/10, text-error, font-semibold, rounded-full, px-4 py-2

**Stats row (mt-6, mb-8):**
Three small stat cards in a row:
- Open / Claimed / Resolved today
- Each: bg-white, border border-honey/20, rounded-xl, p-4, text-center
- Number: text-3xl, font-bold, roast
- Label: text-xs, uppercase, tracking-wide, roast-light

**Escalation cards:**
Replace emoji channel icons with inline SVGs (phone, chat-bubble, envelope). Same size as current (20px), honey color, with a `title` element for screen readers.

**Transcript panel** (expanded state):
- Agent lines: bg-honey/10, border-l-2 border-honey, pl-4, py-2, rounded-r
- Customer lines: bg-white, border border-gray-200, px-4 py-2, rounded

**Empty state:**
- bg-white, border border-gray-100, rounded-2xl, py-20, text-center
- SVG checkmark circle (48px, success green) — no emoji
- H2: "All clear" — font-heading, text-xl, roast
- Body: "No open escalations. The AI is managing all conversations smoothly." — text-sm, gray-500
- Last refreshed timestamp: text-xs, gray-400, mt-2

---

## 5. Responsive Behavior Summary

| Page            | Mobile (375px)                       | Tablet (768px)               | Desktop (1280px)          |
|-----------------|--------------------------------------|------------------------------|---------------------------|
| Homepage hero   | Stacked, image below CTA             | 2-col, image right           | 2-col, image right, wider |
| Product catalog | 1-col grid, filter pills scroll horiz| 2-col grid                   | 3-col grid                |
| Order tracking  | Input stacked above button           | Input + button inline        | Input + button inline     |
| Admin dashboard | Cards full-width, action buttons wrap| Cards with inline actions    | Full layout               |
| Nav             | Hamburger drawer                     | Full nav inline              | Full nav inline           |
