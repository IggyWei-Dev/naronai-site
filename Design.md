# Naronai — Design Specification
> "Leave an Impression" · Luxury Hair & Beauty · Website Design System

This document is the single source of truth for implementing the Naronai website. It covers design tokens, typography, animation, responsive behaviour, components, and all page layouts.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Brand name | NARONAI |
| Tagline | Leave an Impression |
| Industry | Luxury human hair wigs & beauty |
| Tone | Soft luxury — refined, elegant, elevated, intimate |
| Logo | Feminine silhouette in crescent moon form + spaced wordmark |
| Logo files | `/assets/logo/logo-rose-gold.svg` (light bg) · `/assets/logo/logo-ivory.svg` (dark bg) · `/assets/logo/favicon.svg` |

---

## 2. Design Tokens

### 2.1 Colour — Light Mode (default when system = light)

```css
--color-bg-page:          #F7F2EC;   /* Warm White — page background */
--color-bg-surface:       #F0E8E0;   /* Slightly deeper surface */
--color-bg-card:          #FFFFFF;   /* Card background */
--color-bg-elevated:      #E8B8AA;   /* Soft Nude Pink — elevated / featured */

--color-border-subtle:    #E5D2C6;   /* Champagne Cream — dividers, inputs */
--color-border-medium:    #D7B2A5;   /* Soft Blush Nude — card borders */

--color-text-primary:     #2E1D1B;   /* Midnight Cocoa — headings, body */
--color-text-secondary:   #5A443F;   /* Cocoa Brown — muted labels */
--color-text-muted:       #B69E96;   /* Warm Taupe — placeholders, captions */

--color-accent-primary:   #7A2F4B;   /* Deep Burgundy Pink — primary CTA */
--color-accent-secondary: #B9939D;   /* Dusty Mauve — hover states, tags */
--color-accent-gold:      #C3A05B;   /* Antique Gold — metallic accent (use sparingly) */

--color-gradient-hero:    linear-gradient(135deg, #2E1D1B 55%, #4A1F2B 100%);
--color-gradient-primary: linear-gradient(160deg, #D7B2A5, #7A2F4B);
--color-gradient-accent:  linear-gradient(160deg, #F4ECE5, #E5D2C6);
--color-gradient-gold:    linear-gradient(135deg, #C3A05B, #B88D47);
```

### 2.2 Colour — Dark Mode (active when system = dark)

```css
--color-bg-page:          #2E1D1B;   /* Midnight Cocoa */
--color-bg-surface:       #3A2220;   /* Slightly lighter surface */
--color-bg-card:          #4A1F2B;   /* Deep Burgundy */
--color-bg-elevated:      #6E3947;   /* Wine Rose */

--color-border-subtle:    #4A1F2B;   /* Deep Burgundy — dividers */
--color-border-medium:    #5A443F;   /* Cocoa Brown — card borders */

--color-text-primary:     #F4ECE5;   /* Warm Ivory */
--color-text-secondary:   #D7B2A5;   /* Soft Blush Nude */
--color-text-muted:       #8D6E74;   /* Mauve Taupe */

--color-accent-primary:   #C3A05B;   /* Antique Gold becomes primary in dark mode */
--color-accent-secondary: #8D6E74;   /* Mauve Taupe */
--color-accent-gold:      #B88D47;   /* Aged Gold */

--color-gradient-hero:    linear-gradient(135deg, #2E1D1B 55%, #4A1F2B 100%);
--color-gradient-primary: linear-gradient(160deg, #8D6E74, #4A1F2B);
--color-gradient-accent:  linear-gradient(160deg, #3A2220, #4A1F2B);
--color-gradient-gold:    linear-gradient(135deg, #B88D47, #C3A05B);
```

### 2.3 Typography

```css
/* Font stack — load via Google Fonts */
--font-display:  'Cormorant Garamond', Georgia, serif;   /* headings, hero, display */
--font-ui:       'Montserrat', sans-serif;               /* nav, labels, buttons, badges */
--font-body:     'Inter', sans-serif;                    /* body copy, descriptions */

/* Scale */
--text-display:  clamp(40px, 6vw, 72px);   font-weight: 300; line-height: 1.05;
--text-h1:       clamp(28px, 4vw, 48px);   font-weight: 400; line-height: 1.1;
--text-h2:       clamp(22px, 3vw, 36px);   font-weight: 400; line-height: 1.2;
--text-h3:       clamp(18px, 2.5vw, 26px); font-weight: 400; line-height: 1.3;
--text-label:    10px–11px;  font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
--text-body:     15px–16px;  font-weight: 400; line-height: 1.75;
--text-caption:  12px–13px;  font-weight: 400; line-height: 1.6; color: var(--color-text-muted);

/* All display/heading text uses --font-display */
/* All nav, buttons, labels, badges use --font-ui */
/* All body copy uses --font-body */
```

### 2.4 Spacing Scale

```
4px   xs   — icon gaps, tight padding
8px   sm   — inline spacing
12px  md   — component internal padding
16px  lg   — card padding, section items
24px  xl   — section gaps
40px  2xl  — between major blocks
64px  3xl  — section top/bottom padding (desktop)
96px  4xl  — hero vertical padding
```

### 2.5 Border Radius

```css
--radius-sharp:  2px;    /* buttons — luxury angular feel */
--radius-sm:     4px;    /* badges, pills, tags */
--radius-md:     8px;    /* inputs, small cards */
--radius-lg:     12px;   /* product cards */
--radius-xl:     16px;   /* feature panels, modals */
--radius-round:  9999px; /* icon buttons, avatar circles */
```

### 2.6 Shadows & Elevation

```css
--shadow-card:    0 2px 16px rgba(46,29,27,0.08);
--shadow-hover:   0 8px 32px rgba(46,29,27,0.14);
--shadow-modal:   0 24px 64px rgba(46,29,27,0.22);
/* Dark mode: use rgba(0,0,0,0.4/0.6/0.8) equivalents */
```

---

## 3. Animation System

All animations are **subtle, smooth, and luxury-paced**. Nothing bouncy or aggressive. Prefer ease-out curves.

### 3.1 Duration Tokens

```css
--duration-instant:  80ms;   /* micro feedback — button press */
--duration-fast:    200ms;   /* hover states, colour transitions */
--duration-base:    350ms;   /* element entrances */
--duration-slow:    600ms;   /* section reveals, hero fade */
--duration-crawl:  1200ms;   /* hero image parallax, gradient shifts */
```

### 3.2 Easing Tokens

```css
--ease-out:       cubic-bezier(0.16, 1, 0.3, 1);   /* most transitions */
--ease-in-out:    cubic-bezier(0.45, 0, 0.55, 1);  /* modals, drawers */
--ease-spring:    cubic-bezier(0.34, 1.4, 0.64, 1); /* subtle spring on hover lift */
```

### 3.3 Transition Presets

```css
/* Applied to interactive elements globally */
--transition-color:     color var(--duration-fast) var(--ease-out),
                        background-color var(--duration-fast) var(--ease-out),
                        border-color var(--duration-fast) var(--ease-out);

--transition-lift:      transform var(--duration-fast) var(--ease-spring),
                        box-shadow var(--duration-fast) var(--ease-out);

--transition-opacity:   opacity var(--duration-base) var(--ease-out);
```

### 3.4 Scroll-Triggered Entrance Animations

Use IntersectionObserver. Elements start invisible and slide/fade in when they enter the viewport.

```css
/* Base state — applied via JS class before element is visible */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

/* Active state — applied by IntersectionObserver when in view */
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Stagger delay for grids: each child gets `transition-delay: calc(var(--i) * 80ms)` where `--i` is the child index (0, 1, 2…).

### 3.5 Hover Interactions

| Element | Hover effect |
|---|---|
| Product card | translateY(-6px), shadow upgrades to `--shadow-hover` |
| Button (primary) | Slight brighten (filter: brightness(1.08)), no movement |
| Button (ghost) | Background fills to `var(--color-accent-primary)`, text flips to ivory |
| Nav link | Underline slides in from left (pseudo-element scaleX 0→1) |
| Logo | Gentle opacity pulse (1 → 0.85 → 1) on click, not hover |
| Collection card | Overlay darkens slightly, label slides up 4px |
| Feature icon | Icon scales to 1.1, colour transitions to gold |
| Gold accent text | Subtle shimmer (background-position animation on gradient) |

### 3.6 Page Transitions

Use a thin gold bar (2px, full width) that sweeps across the top of the viewport on route change — 300ms in, content fades in at 200ms delay. Implemented via a root-level progress bar component.

### 3.7 Hero Parallax

Hero background image moves at 40% the scroll rate (`transform: translateY(scrollY * 0.4)`). Subtle, not dramatic. Disable on mobile (performance).

### 3.8 Gold Shimmer (Accent Only)

For the gold accent token and metallic elements:

```css
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.gold-shimmer {
  background: linear-gradient(90deg, #C3A05B 30%, #F0D890 50%, #C3A05B 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
```

Use only on: hero tagline accent word, section divider ornaments, premium badge labels.

---

## 4. Responsive Breakpoints

```css
/* Mobile first */
--bp-mobile:  0px;      /* < 768px  — single column, bottom nav */
--bp-tablet:  768px;    /* 768–1199px — 2 column, compact nav */
--bp-desktop: 1200px;   /* ≥ 1200px — full layout, split nav */
```

Max content width: **1440px**, centred with `margin: 0 auto`.
Content padding: `16px` mobile · `32px` tablet · `64px` desktop.

---

## 5. Navigation

### 5.1 Desktop (≥ 1200px)

Layout: centred logo, nav links split left/right, icons right-most.

```
[ Shop  Experiences  Membership ]  [ NARONAI logo ]  [ The Impact  About Us ]  [ 🔍 👤 🛒 ]
```

- Announcement bar above nav: `12px`, burgundy text on deep cocoa background, dismissible.
- Nav bar: `background: var(--color-bg-page)`, `border-bottom: 0.5px solid var(--color-border-subtle)`.
- Nav links: `--font-ui`, `10px`, `letter-spacing: 0.12em`, uppercase. Hover: gold underline slides in.
- Nav is **sticky** — stays at top on scroll. On scroll > 80px, nav gains `backdrop-filter: blur(12px)` and reduces padding slightly (transition 200ms).
- Cart icon shows item count badge (gold circle, `10px` number).

### 5.2 Tablet (768–1199px)

Layout: hamburger left, logo centre, cart + account icons right.

- Logo centred.
- Hamburger opens a **full-height right drawer** (80vw max, dark bg `#2E1D1B`), links stacked vertically with serif font at larger size.
- Drawer animates in: `translateX(100%) → translateX(0)`, 350ms ease-out, with a dark overlay behind it.

### 5.3 Mobile (< 768px)

Layout: hamburger left, logo centre, cart icon right. **Bottom tab bar** for primary navigation.

- Top nav: minimal — logo + hamburger + cart only.
- Bottom tab bar (fixed): Home · Shop · [Logo icon, centre, circular, gold] · Wishlist · Account.
- Bottom bar background: `var(--color-bg-page)` with top border `0.5px` gold.
- Hamburger still opens drawer for secondary pages.

---

## 6. Component Library

### 6.1 Buttons

```
Primary   — bg: --color-accent-primary (#7A2F4B light / #C3A05B dark)
            text: warm ivory, --font-ui, 11px, letter-spacing: 0.12em, uppercase
            padding: 12px 28px, border-radius: --radius-sharp
            hover: brightness(1.08)

Ghost     — bg: transparent
            border: 1px solid --color-accent-primary
            text: --color-accent-primary
            hover: bg fills to --color-accent-primary, text → ivory
            transition: all 250ms ease-out

Gold      — bg: --color-accent-gold
            text: --color-text-primary (#2E1D1B)
            hover: brightness(1.05) + shimmer once

Text link — no border, no bg
            text: --color-accent-gold, underline offset 3px
            → arrow "→" after label
            hover: letter-spacing widens slightly (0.06 → 0.1em) over 200ms
```

### 6.2 Product Card

```
Container:
  background: var(--color-bg-card)
  border: 0.5px solid var(--color-border-medium)
  border-radius: --radius-lg
  overflow: hidden
  transition: --transition-lift
  hover: translateY(-6px), --shadow-hover

Image area:
  aspect-ratio: 3/4
  object-fit: cover
  position: relative
  overlay: linear-gradient(to top, rgba(46,29,27,0.7) 0%, transparent 50%)

Badge (tier):
  position: absolute, bottom-left
  --font-ui, 9px, letter-spacing: 0.14em, uppercase
  padding: 4px 10px, border-radius: --radius-sm
  light bg on dark image / dark bg on light image

Body:
  padding: 14px 16px
  Name: --font-display, 16px, --color-text-primary
  Price: --font-ui, 11px, --color-text-muted, letter-spacing: 0.06em
  Add button: 28px circle, --color-accent-primary bg, ivory +, bottom right
```

### 6.3 Feature Icon Strip

4-column strip (2×2 on mobile).

```
Each item:
  Icon: Tabler outline, 24px, --color-accent-gold
  Label: --font-ui, 9px, letter-spacing: 0.14em, uppercase, --color-text-secondary
  Padding: 20px 16px
  Separator: 0.5px border right (except last)
  hover: icon scales to 1.1, colour stays gold
```

### 6.4 Form Inputs

```
Label: --font-ui, 10px, letter-spacing: 0.12em, uppercase, --color-text-secondary
Input:
  border: 0.5px solid var(--color-border-subtle)
  border-radius: --radius-md
  padding: 12px 16px
  background: transparent (shows page bg)
  font: --font-body, 15px, --color-text-primary
  focus: border-color → --color-accent-gold, outline: none
  transition: border-color 200ms ease-out
```

### 6.5 Section Divider Ornament

Between major page sections, use a centred ornament:

```html
<div class="ornament">
  <span class="ornament__line"></span>
  <span class="ornament__diamond">◆</span>
  <span class="ornament__line"></span>
</div>
```

```css
.ornament { display: flex; align-items: center; gap: 12px; margin: 48px auto; width: fit-content; }
.ornament__line { width: 60px; height: 0.5px; background: var(--color-accent-gold); opacity: 0.5; }
.ornament__diamond { color: var(--color-accent-gold); font-size: 8px; }
```

### 6.6 Announcement Bar

```
background: #2E1D1B (always dark, both modes)
text: #D7B2A5, --font-ui, 10px, letter-spacing: 0.14em, uppercase, centred
padding: 8px
dismiss: × icon right, fades bar out on click (opacity 0, height 0, 250ms)
```

### 6.7 Modal / Overlay

```
Overlay: rgba(46,29,27,0.7), backdrop-filter: blur(4px)
Modal panel:
  background: var(--color-bg-card)
  border-radius: --radius-xl
  max-width: 560px, padding: 40px
  animation: scale(0.96)→scale(1) + opacity 0→1, 300ms ease-out
  close: × top right, --color-text-muted
```

### 6.8 Badge / Tag

```
padding: 4px 12px
border-radius: --radius-sm
--font-ui, 9px, letter-spacing: 0.14em, uppercase, font-weight: 600

Variants:
  Tier label:  bg: rgba(195,160,91,0.15), text: --color-accent-gold
  New:         bg: rgba(122,47,75,0.15), text: --color-accent-primary
  Sold out:    bg: var(--color-border-subtle), text: --color-text-muted
```

---

## 7. Page Specifications

### 7.1 Home

**Sections in order:**

1. **Announcement Bar** — "Free worldwide shipping over ₦500K · Book your private consultation" with dismiss.

2. **Hero** — Full-viewport height (100svh). Dark background (`--color-gradient-hero`). Large editorial model photo, right-aligned. Left: eyebrow label → display headline (serif, light weight) → subtext → two CTAs (primary + ghost). Parallax on scroll (desktop/tablet only). Headline uses `--text-display`. Accent word rendered with gold shimmer class. Dot-indicator carousel if multiple hero slides.

3. **Feature Strip** — 4 columns: Book Consultation · Bespoke Experience · VIP Membership · Worldwide Delivery.

4. **Collections Intro** — eyebrow label + serif h2 "Find Your Perfect Crown" + text link "View All →". Then a 3-column card grid (Signature, Couture, Bespoke). Cards reveal with staggered scroll animation.

5. **Brand Story Panel** — Full-width, split layout (60/40). Left: large serif quote in burgundy, body copy. Right: editorial image with soft gradient overlay. Dark background panel.

6. **Experience Section** — "More Than A Wig. It's An Experience." — Luxury packaging image left, copy right. Dark card treatment. CTA: "Discover the Experience →"

7. **Testimonials** — 3 quote cards, subtle carousel on mobile, 3-column on desktop. Soft rose gradient bg.

8. **Community / Join CTA** — Full-width gold-tinted section. Serif headline, body copy, email input + subscribe button.

9. **Footer** — see section 7.8.

---

### 7.2 Shop / Collections

**Layout:**

- **Sticky filter sidebar** (desktop, 240px width) | **Main product grid** (flex grow).
- Tablet: filters in collapsible top bar. Mobile: filters in bottom sheet drawer.
- Filter options: Collection tier · Hair type · Length · Colour · Price range.

**Filter sidebar:**
```
border-right: 0.5px solid --color-border-subtle
padding: 32px 24px
position: sticky; top: nav-height

Filter group heading: --font-ui, 10px, letter-spacing: 0.14em, uppercase, gold
Filter item: checkbox styled as a small square (--color-accent-primary fill on check)
Price range: custom dual-handle slider, gold thumb colour
```

**Product grid:**
- Desktop: 3 columns. Tablet: 2 columns. Mobile: 2 columns (smaller cards) or 1 column list view.
- Sort bar above grid: "Showing X products · Sort by: [dropdown]"
- Infinite scroll or "Load More" gold ghost button at bottom.
- Out-of-stock cards show a greyed overlay + "Notify Me" label.
- Reveal animation: cards cascade in as page loads (stagger 80ms).

---

### 7.3 Product Detail

**Layout (desktop): 60/40 split — images left, details right.**

**Image gallery (left):**
- Main image (large, 60% viewport height). Thumbnail strip below (scrollable row).
- Click to open lightbox (fullscreen modal with zoom).
- Mobile: horizontal swipe carousel.

**Product details (right):**
```
Tier badge (top)
Product name: --font-display, h1 size
Price: --font-ui, 20px, --color-accent-gold
Divider ornament
Short description: --font-body, 15px
Hair specs grid: Length · Density · Cap Type · Origin (2×2, labelled cells)
Divider
Colour/variant selector: swatch circles (actual hair-colour dots), labelled
Length selector: radio pills (styled as ghost buttons)
Quantity: +/− stepper
Primary CTA: "Add to Cart" (full width, --radius-sharp)
Secondary CTA: "Book a Private Consultation" (ghost, full width)
Divider
Accordion: Description · Care Instructions · Shipping & Returns · Authenticity
```

Mobile: images stack above details, full width.

---

### 7.4 Book a Consultation

**Layout:** Centred, max-width 720px, generous vertical padding.

```
Eyebrow: "PRIVATE CONSULTATION"
Serif h1: "Let's Find Your Perfect Crown"
Body copy: 2–3 sentences on what to expect
Divider ornament

Multi-step form (3 steps, progress indicator at top):
  Step 1 — Personal details: Name, Email, Phone, Instagram (optional)
  Step 2 — Hair details: Current hair situation, Desired style, Budget range, Occasion
  Step 3 — Scheduling: Preferred date picker, Preferred time slots, Notes
  
Step navigation: Back (ghost) | Next / Submit (primary)
Progress: 3 dots or thin step bar in gold

Success state: Serif headline "We'll be in touch shortly ✦", confirmation details card, CTA back to Shop.
```

Background: subtle `--color-gradient-accent` across full page. All cards on `--color-bg-card`.

---

### 7.5 About

**Section 1 — Hero:** Full-width editorial image (dark overlay). Large serif quote "Timeless Beauty. Lasting Impression." centred, ivory text.

**Section 2 — Our Story:** 2-column (image left, copy right). Rich editorial serif headings, body copy in Inter. Reveal on scroll.

**Section 3 — Our Mission:** 3-column icon cards (rose-tinted bg). Each: Tabler icon (gold), heading, 2-line description.

**Section 4 — The Founder:** Photo (circular or portrait), name, founder's note in italic serif.

**Section 5 — Values:** 4-column grid. Each: ornament diamond, heading, short body copy.

**Section 6 — Impact CTA:** "Join the Naronai Community" — full-width dark section, serif headline, membership CTA button.

---

### 7.6 Membership (VIP)

**Layout:** Centred, premium feel. Dark page background.

```
Hero: Gold shimmer heading "Naronai VIP" + subheadline + tier overview strip

Tier cards (3 columns — Blush, Rose, Gold tiers):
  Each card:
    Gradient top bar (tier colour)
    Tier name (serif, large)
    Price / membership fee
    Features list (checkmarks in gold)
    CTA button
    Recommended tier: slightly larger scale, thin gold border glow

Benefits section: Icon grid (8 items) — exclusive drops, early access, concierge, events, etc.

FAQ accordion (max-width 720px, centred)

CTA section: "Ready to Join?" — email input + join button
```

---

### 7.7 Contact

**Layout:** 2-column (desktop). Left: contact info. Right: form.

**Left column:**
```
Eyebrow + serif heading "Get in Touch"
Short intro copy
Contact details:
  Email icon + address
  Instagram icon + handle
  WhatsApp icon + number
  Location (city/country)
Hours of operation (label grid)
```

**Right column:**
```
Form fields: Name, Email, Subject dropdown, Message textarea
Submit: primary button, full width
```

Mobile: stacked single column, form second.

Map or brand editorial image below on mobile (optional).

---

### 7.8 Footer

```
Background: #2E1D1B (always dark)
Text: --color-text-secondary (#D7B2A5)

Layout (desktop — 4 columns):
  Col 1: Logo (ivory) + tagline + social icons (Instagram, TikTok, Pinterest)
  Col 2: Shop — Collections, New Arrivals, Sale, Bundles
  Col 3: Company — About, Membership, The Impact, Careers
  Col 4: Help — Contact, Book Consultation, Shipping, Returns

Bottom bar (below divider):
  Left: © 2025 Naronai. All rights reserved.
  Right: Privacy Policy · Terms of Service

Mobile: 2×2 grid of columns, logo centred above.
Links: --font-ui, 11px, letter-spacing: 0.1em, hover → --color-accent-gold transition 200ms.
Social icons: Tabler outline, 18px, hover → gold + scale 1.1.
```

---

## 8. Dark / Light Mode Implementation

```css
/* Automatically follows OS preference */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override all --color-* tokens with dark mode values (see Section 2.2) */
  }
}
```

- No manual toggle required (system preference only, per spec).
- Images: dark mode variants use the dark-background logo (`logo-ivory.svg`).
- Hero section is always dark regardless of mode.
- Announcement bar is always dark regardless of mode.
- Footer is always dark regardless of mode.

---

## 9. Accessibility

- All interactive elements must be keyboard navigable.
- Focus rings: `outline: 2px solid var(--color-accent-gold); outline-offset: 3px`.
- Colour contrast: all body text must meet WCAG AA (4.5:1). Gold on cocoa: ✅ (5.2:1).
- `prefers-reduced-motion`: wrap all animations in `@media (prefers-reduced-motion: no-preference)`. Users with this set see instant transitions only.
- All images require descriptive `alt` text.
- Icons used decoratively get `aria-hidden="true"`.
- Form inputs: all have `<label>` with matching `for` / `id`.

---

## 10. Assets & File Structure

```
/assets
  /logo
    logo-rose-gold.svg       ← primary logo (light backgrounds)
    logo-ivory.svg           ← reversed logo (dark backgrounds)
    favicon.svg              ← icon mark only (no wordmark)
  /fonts
    (loaded via Google Fonts: Cormorant Garamond, Montserrat, Inter)
  /images
    /hero                    ← hero model images (WebP, ≥ 2000px wide)
    /products                ← product photography (WebP, 3:4 ratio)
    /editorial               ← brand/lifestyle shots
    /packaging               ← Naronai packaging shots
```

**Image formats:** WebP preferred. Fallback JPEG. Use `srcset` for responsive images.
**Lazy loading:** all below-fold images use `loading="lazy"`.

---

## 11. Tech Notes for Claude Code

- Framework: React (Next.js preferred for SSR/SEO) or plain HTML/CSS/JS.
- CSS: CSS custom properties (tokens above). No CSS-in-JS required.
- Animations: CSS transitions + `IntersectionObserver` for scroll reveals. No heavy animation libraries needed — optionally use `framer-motion` for page transitions only.
- Google Fonts: load Cormorant Garamond (300, 400, 500 italic) + Montserrat (400, 500) + Inter (400, 500) via `<link rel="preconnect">` + stylesheet.
- Responsive images: `<picture>` with `srcset` + `sizes`.
- Reduced motion: respect via CSS `@media (prefers-reduced-motion)`.
- Colour scheme: `<meta name="color-scheme" content="light dark">` in `<head>`.
- Scroll parallax: `requestAnimationFrame` loop, only on desktop, with `will-change: transform` on the hero image element.
