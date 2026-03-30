# Ember & Roast — Design System

Version 1.0 | Author: UI/UX Designer Agent | Date: 2026-03-30

---

## 1. Brand Philosophy

Ember & Roast is a specialty coffee brand built on craft, warmth, and trust. Every design decision should communicate that a human being cared about the details — from the roast profile to the pixel. The visual language is warm and premium without being precious or corporate. It should feel like a well-lit, thoughtfully arranged coffee bar: spacious, confident, and inviting.

---

## 2. Color Palette

All hex values are authoritative. Tailwind tokens must match exactly.

| Token         | Hex       | Usage                                                   |
|---------------|-----------|---------------------------------------------------------|
| `ember`       | `#8B4513` | Primary CTA buttons, price text, active nav indicator   |
| `roast`       | `#3E2723` | Page headings, nav background, body text on light bg    |
| `cream`       | `#FAF8F3` | Page backgrounds, card fills, hero backgrounds          |
| `honey`       | `#D4A96A` | Accent borders, badge backgrounds, hover highlights     |
| `success`     | `#4CAF50` | Delivered status, resolved escalations, success states  |
| `error`       | `#F44336` | Error states, return-requested status, form validation  |
| `roast-light` | `#6D4C41` | Secondary text on dark backgrounds, disabled text       |

### Tailwind Config (authoritative)

```js
colors: {
  ember:       '#8B4513',
  roast:       '#3E2723',
  cream:       '#FAF8F3',
  honey:       '#D4A96A',
  'roast-light': '#6D4C41',
  success:     '#4CAF50',
  error:       '#F44336',
}
```

### Contrast Ratios (WCAG 2.1 AA)

| Foreground    | Background | Ratio  | Pass AA |
|---------------|------------|--------|---------|
| `#FAF8F3`     | `#3E2723`  | 12.3:1 | Yes     |
| `#FAF8F3`     | `#8B4513`  | 5.2:1  | Yes     |
| `#3E2723`     | `#FAF8F3`  | 12.3:1 | Yes     |
| `#3E2723`     | `#D4A96A`  | 4.7:1  | Yes     |
| `#FFFFFF`     | `#8B4513`  | 5.7:1  | Yes     |

Do not place `#D4A96A` honey text on white backgrounds — ratio is 2.6:1 (fail). Use it only as a border, background fill, or paired with `#3E2723` text.

---

## 3. Typography

### Font Stack

| Role     | Family               | Weights    | Fallback           |
|----------|----------------------|------------|--------------------|
| Headings | Playfair Display     | 600, 700   | Georgia, serif     |
| Body     | Inter                | 400, 500   | system-ui, sans    |
| Mono     | JetBrains Mono       | 400        | monospace          |

Load via `next/font/google` in `app/layout.tsx`:

```tsx
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700'] })
const inter    = Inter({ subsets: ['latin'], weight: ['400', '500'] })
const mono     = JetBrains_Mono({ subsets: ['latin'], weight: ['400'] })
```

Apply via CSS variables and map in `tailwind.config.js`:
```js
fontFamily: {
  heading: ['var(--font-playfair)', 'Georgia', 'serif'],
  body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
  mono:    ['var(--font-mono)', 'monospace'],
}
```

### Type Scale

All sizes in rem. Base: 16px.

| Token     | rem    | px  | Tailwind class  | Usage                        |
|-----------|--------|-----|-----------------|------------------------------|
| `4xl`     | 2.25   | 36  | `text-4xl`      | Page hero heading (H1)       |
| `3xl`     | 1.875  | 30  | `text-3xl`      | Section headings (H2)        |
| `2xl`     | 1.5    | 24  | `text-2xl`      | Card headings, modal titles  |
| `xl`      | 1.25   | 20  | `text-xl`       | Sub-section labels (H3)      |
| `lg`      | 1.125  | 18  | `text-lg`       | Lead body text               |
| `base`    | 1.0    | 16  | `text-base`     | Body copy                    |
| `sm`      | 0.875  | 14  | `text-sm`       | Supporting text, meta        |
| `xs`      | 0.75   | 12  | `text-xs`       | Captions, legal, badges      |

Heading font applies to H1–H3. Body font applies to all other text. Mono font applies to order IDs and tracking numbers only.

---

## 4. Spacing

Base unit: 4px. All spacing is a multiple of 4px.

| Token | px  | Tailwind   | Usage                         |
|-------|-----|------------|-------------------------------|
| 1     | 4   | `p-1`      | Tight internal padding        |
| 2     | 8   | `p-2`      | Badge padding, icon gaps      |
| 3     | 12  | `p-3`      | Button padding (compact)      |
| 4     | 16  | `p-4`      | Card internal padding (sm)    |
| 6     | 24  | `p-6`      | Card internal padding (std)   |
| 8     | 32  | `p-8`      | Section padding               |
| 12    | 48  | `p-12`     | Page vertical rhythm          |
| 16    | 64  | `p-16`     | Hero section padding          |
| 20    | 80  | `p-20`     | Hero section padding (lg)     |

---

## 5. Border Radius

| Token   | Value   | Tailwind         | Usage                        |
|---------|---------|------------------|------------------------------|
| sm      | 4px     | `rounded`        | Inputs, badges               |
| md      | 8px     | `rounded-lg`     | Buttons, chips               |
| lg      | 12px    | `rounded-xl`     | Cards                        |
| xl      | 16px    | `rounded-2xl`    | Modals, hero widgets         |
| full    | 9999px  | `rounded-full`   | Status pills, avatar circles |

---

## 6. Shadows

| Token     | Value                                      | Tailwind        | Usage                   |
|-----------|--------------------------------------------|-----------------|-------------------------|
| sm        | `0 1px 3px rgba(62,39,35,0.08)`            | `shadow-sm`     | Resting cards           |
| md        | `0 4px 12px rgba(62,39,35,0.12)`           | `shadow-md`     | Hovered cards           |
| lg        | `0 8px 24px rgba(62,39,35,0.16)`           | `shadow-lg`     | Modals, dropdowns       |
| focus     | `0 0 0 3px rgba(212,169,106,0.5)`          | custom          | Focus ring (honey glow) |

Use `shadow-sm` as the resting state on ProductCard. Transition to `shadow-md` on hover. This uses `#3E2723` (roast) as the shadow color tint so shadows feel warm, not grey.

---

## 7. Component Specifications

### 7.1 ProductCard

**Structure (mobile-first):**
```
[image: aspect-ratio 4/3, rounded-xl, object-cover]
[padding: p-5]
  [type badge: honey bg, roast text, xs, font-semibold, uppercase, tracking-wide]
  [name: text-xl, font-heading, font-semibold, roast, mt-2]
  [description: text-sm, text-gray-600, mt-1, line-clamp-2]
  [footer: flex justify-between items-center, mt-4]
    [price: text-2xl, font-bold, ember]
    [Add to Cart button]
```

**States:**
- Resting: `shadow-sm`, `border border-honey/30`
- Hover: `shadow-md`, `border-honey`, translate-y `-1px` (CSS transition 200ms ease)
- Focus (keyboard): `ring-2 ring-honey ring-offset-2`
- Disabled: `opacity-50 cursor-not-allowed`

**Image placeholder** (until real images exist):
Use a warm gradient: `bg-gradient-to-br from-honey/20 to-ember/10` with a centered SVG coffee cup icon in `#D4A96A`. Do not use gray boxes or "No image" text in any user-facing state.

**Responsive:**
- Mobile (375px): single column, full-width card
- Tablet (768px): 2-column grid, `gap-6`
- Desktop (1280px): 3-column grid, `gap-8`

---

### 7.2 Button

Three variants, two sizes.

**Primary:**
```
bg-ember text-cream font-semibold rounded-lg px-6 py-3
hover: bg-roast transition-colors duration-150
focus-visible: ring-2 ring-honey ring-offset-2
active: scale-95 transition-transform
disabled: opacity-40 cursor-not-allowed pointer-events-none
```

**Secondary (outlined):**
```
border-2 border-ember text-ember bg-transparent font-semibold rounded-lg px-6 py-3
hover: bg-ember text-cream
focus-visible: ring-2 ring-honey ring-offset-2
```

**Ghost:**
```
text-ember font-medium underline-offset-2
hover: underline
focus-visible: ring-2 ring-honey ring-offset-2
```

**Sizes:**
- Default: `px-6 py-3 text-base`
- Small: `px-4 py-2 text-sm`

**Loading state:** Replace label with an animated spinner (CSS border-spin). Disable pointer events. Preserve button dimensions.

---

### 7.3 Input / Search Field

```
border border-honey/40 rounded-lg px-4 py-3 bg-cream text-roast
placeholder: text-roast-light
focus: outline-none ring-2 ring-honey border-honey
error: border-error ring-error/30
```

Always pair with a visible `<label>`. Use `aria-describedby` to associate error messages.

---

### 7.4 Badge / Status Pill

```
rounded-full px-3 py-1 text-xs font-semibold
```

| Status            | Background         | Text           |
|-------------------|--------------------|----------------|
| delivered         | `#DCFCE7` (green-100) | `#166534` (green-800) |
| shipped           | `#DBEAFE` (blue-100)  | `#1E40AF` (blue-800)  |
| roasting          | `bg-honey/20`      | `text-roast`   |
| return_requested  | `#FEE2E2` (red-100)   | `#991B1B` (red-800)   |
| processing        | `#F3F4F6` (gray-100)  | `#374151` (gray-700)  |

---

### 7.5 Nav

**Desktop (768px+):**
```
bg-roast, sticky top-0, z-50, shadow-sm
px-8 py-4 flex items-center justify-between
```
- Logo: Playfair Display, text-xl, cream, hover: honey, with a small flame/coffee icon SVG prefix
- Links: Inter, text-sm, cream/80, hover: cream, focus-visible: ring-2 ring-honey
- Active link: underline decoration-honey decoration-2 underline-offset-4
- CTA (Admin): only visible to authenticated users in production; for demo, use a lock icon prefix and `text-xs` label
- Cart icon: right side, relative positioned with item count badge (ember bg, cream text, rounded-full, w-5 h-5, text-xs, absolute -top-1 -right-1)

**Mobile (375px):**
- Hamburger icon button (3 lines, 24x24px), right-aligned
- Drawer: slides in from right, full-height, bg-roast, 280px wide
- Links stacked vertically, py-4 each, text-lg
- Close button: top-right of drawer, X icon

---

### 7.6 Footer

**Structure:**
```
bg-roast text-cream/70
px-8 py-12
grid grid-cols-1 md:grid-cols-3 gap-8
```

Columns:
1. Brand — logo, one-line tagline, social icons (Instagram, Twitter)
2. Shop — links: Coffee, About, Wholesale
3. Support — links: Track Order, FAQ, Contact; voice CS callout

Bottom bar:
```
border-t border-cream/10 mt-8 pt-6 flex justify-between text-xs text-cream/40
```
- Left: "2026 Ember & Roast"
- Right: "Privacy Policy · Terms"

---

### 7.7 Empty States

Every list or search result must have a designed empty state. Never show a blank page.

**No orders found:**
- Icon: SVG magnifying glass, honey color, 48px
- Heading: "We couldn't find that order" (text-xl, font-heading, roast)
- Body: "Double-check your order ID — it should look like ER-10042." (text-sm, gray-600)
- Do not expose internal sample order IDs in production or demo views.

**No escalations (admin):**
- Icon: SVG checkmark circle, success green, 48px (replace emoji)
- Heading: "All clear" (text-xl, font-heading, roast)
- Body: "No open escalations. The AI is handling everything smoothly." (text-sm, gray-500)

**Loading state:**
- Use skeleton cards (animated pulse, bg-honey/10, same dimensions as real content)
- Never show raw "Loading escalations..." text without a visual indicator

---

## 8. Responsive Breakpoints

| Name    | Min-width | Tailwind prefix |
|---------|-----------|-----------------|
| Mobile  | 375px     | (default)       |
| Tablet  | 768px     | `md:`           |
| Desktop | 1280px    | `lg:`           |
| Wide    | 1536px    | `2xl:`          |

Design mobile-first. All layout grids start as single-column and expand.

---

## 9. Accessibility Standards (WCAG 2.1 AA)

1. **Focus visible**: Every interactive element must show a visible focus ring. Use `focus-visible:ring-2 ring-honey ring-offset-2`. Never use `outline-none` without a replacement.
2. **Color not sole indicator**: Status badges use both color and text label. Icons have `aria-label` or adjacent visible text.
3. **Contrast**: All text meets 4.5:1 minimum (see Section 2). Honey on white is prohibited for text.
4. **Motion**: Any translate/scale animation must respect `prefers-reduced-motion`. Use `motion-safe:` Tailwind prefix.
5. **Form labels**: Every input has an associated `<label>`. Error messages use `role="alert"`.
6. **Images**: Product images require meaningful `alt` text describing the coffee (origin, roast level). Placeholder images use `alt=""` (decorative).
7. **Keyboard navigation**: Tab order follows visual reading order. Modals trap focus. Drawers return focus to trigger on close.

---

## 10. Interaction Timing

| Interaction      | Duration | Easing              |
|------------------|----------|---------------------|
| Button hover     | 150ms    | ease-in-out         |
| Card hover lift  | 200ms    | ease-out            |
| Nav drawer       | 250ms    | ease-in-out         |
| Skeleton pulse   | 1500ms   | ease-in-out (loop)  |
| Toast appear     | 200ms    | ease-out            |
| Modal enter      | 200ms    | ease-out            |
| Modal exit       | 150ms    | ease-in             |
