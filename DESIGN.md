---
name: Naronai
description: "Luxury human hair wigs & beauty. Leave an impression."
colors:
  crimson-crown:    "#7A2F4B"
  antique-gold:     "#C3A05B"
  midnight-cocoa:   "#2E1D1B"
  warm-white:       "#F7F2EC"
  soft-nude-pink:   "#E8B8AA"
  champagne-cream:  "#E5D2C6"
  dusty-mauve:      "#B9939D"
  warm-taupe:       "#B69E96"
  deep-burgundy:    "#4A1F2B"
  wine-rose:        "#6E3947"
  warm-ivory:       "#F4ECE5"
  aged-gold:        "#B88D47"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(40px, 6vw, 72px)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "normal"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(28px, 4vw, 48px)"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(22px, 3vw, 36px)"
    fontWeight: 400
    lineHeight: 1.2
  subtitle:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(18px, 2.5vw, 26px)"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.15em"
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sharp: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  round: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "40px"
  3xl: "64px"
  4xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.crimson-crown}"
    textColor: "{colors.warm-ivory}"
    rounded: "{rounded.sharp}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.crimson-crown}"
    textColor: "{colors.warm-ivory}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.crimson-crown}"
    rounded: "{rounded.sharp}"
    padding: "12px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.crimson-crown}"
    textColor: "{colors.warm-ivory}"
  button-gold:
    backgroundColor: "{colors.antique-gold}"
    textColor: "{colors.midnight-cocoa}"
    rounded: "{rounded.sharp}"
    padding: "12px 28px"
  badge-tier:
    backgroundColor: "rgba(195,160,91,0.15)"
    textColor: "{colors.antique-gold}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  badge-new:
    backgroundColor: "rgba(122,47,75,0.15)"
    textColor: "{colors.crimson-crown}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  input-field:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  product-card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
---

# Design System: Naronai

## 1. Overview

**Creative North Star: "The Crimson Crown"**

The Crimson Crown is not a visual theme; it is a power statement. Every element on the page carries the weight of a woman who has walked into a room and already owns it. The palette runs warm and rich, the typography is editorial and spare, and the interactions are quiet but deliberate. The product speaks; the UI steps back.

Light mode is an atelier: warm ivory and blush surfaces, accents of deep burgundy appearing only where they matter. Dark mode is the evening event: Midnight Cocoa grounds everything, and Antique Gold moves forward. Both modes answer the same brief from a different hour of day. The tonal shift is the personality shift.

This system rejects three specific traps. First, the generic DTC beauty playbook: soft-pink backgrounds, stock-photo hero shots, grid upon grid of "SHOP NOW." Second, cold Western luxury: white walls, severe black serifs, and clinical spacing that evacuates cultural warmth. Third, the Instagram/TikTok-forward brand that lives in reels and user-generated grids and has no permanence of its own. Naronai is none of these things. It is a brand with an address, not a feed.

**Key Characteristics:**
- **Committed palette:** Crimson Crown and Antique Gold carry 30-60% of surface in hero moments; their restraint everywhere else sets up their arrival.
- **Editorial serif at low weight:** Cormorant Garamond 300 carries the brand's presence. The featherweight serif against solid-weight sans IS the hierarchy.
- **Angular precision:** 2px radius on all interactive elements. The product is the luxury; rounded corners would soften something that should not be soft.
- **Tonal depth:** Surface depth lives in color steps (Warm White → Soft Nude Pink → White card), not in shadows. Shadows are the exception.
- **Atelier-restrained interactions:** Transparent backgrounds, borders that whisper, hover states that shift letter-spacing or brightness rather than flood with color.

## 2. Colors: The Crimson Crown Palette

The palette holds in two modes: a daytime atelier (warm ivory ground, blush surfaces, burgundy accent) and an evening expression (Midnight Cocoa ground, deep wine surfaces, gold forward). Every color has a hue relationship to the brand: no neutral is truly neutral, every tone leans toward rosewood or gold.

### Primary
- **Crimson Crown** (#7A2F4B): The brand's declaration. Primary CTA background, active navigation states, icon fills, the "this matters" signal. In dark mode, Antique Gold takes this role; Crimson Crown becomes surface depth.
- **Antique Gold** (#C3A05B): The luxury confirmation. Focus rings, ornament lines, divider accents, the gold shimmer on hero display text, and the gold button variant for low-hierarchy CTAs. In dark mode, becomes the primary interactive color.

### Secondary
- **Deep Burgundy** (#4A1F2B): Dark mode elevated surfaces (cards, panels, feature sections). Also the darker pole of the hero gradient.
- **Wine Rose** (#6E3947): Dark mode containers and intermediate surfaces between bg and card.

### Tertiary
- **Soft Nude Pink** (#E8B8AA): Light mode elevated surfaces and feature panels. The mid-ground between page background and the primary accent. Used as the surface fill on hero panels, feature strips, and editorial callouts.
- **Dusty Mauve** (#B9939D): Secondary text in light mode, subtle UI labels, brand-colored sub-headings. Never body copy.

### Neutral
- **Midnight Cocoa** (#2E1D1B): Primary body text on light backgrounds. Page background in dark mode. The color of all shadows.
- **Warm White** (#F7F2EC): Page background in light mode. Off-white pulled toward rosewood, chroma deliberately low but present.
- **Champagne Cream** (#E5D2C6): Borders, dividers, the champagne pole of the accent gradient. Perceived as nearly-nothing until contrasted against white.
- **Warm Taupe** (#B69E96): Price labels, metadata, placeholder text, captions. Contrast ratio ~2.8:1 on Warm White — insufficient for reading copy. Restricted to secondary metadata contexts on white (#FFFFFF) surfaces only.
- **Warm Ivory** (#F4ECE5): Body text on dark backgrounds. Reading-comfortable warmth that keeps dark mode from feeling harsh.
- **Aged Gold** (#B88D47): Dark mode secondary gold; slightly more muted than Antique Gold for surfaces where the brighter tone would oversaturate.

### Named Rules
**The Rarity Rule.** Crimson Crown (#7A2F4B) appears on 15% or less of any given screen in light mode. One primary CTA per viewport. When everything is burgundy, nothing is.

**The Antique Gold Rule.** Gold is a material accent, not a fill. Focus rings, ornament lines, badge tints, the hero shimmer. Never used as a background on any surface larger than a badge. The moment gold becomes wallpaper, it becomes ordinary.

**The Warm Taupe Warning.** #B69E96 fails WCAG AA at 4.5:1 for body text on #F7F2EC (Warm White). Use it only for product price and metadata copy that renders on a white card (#FFFFFF), where contrast is approximately 3.8:1 (AA for large text). Never in paragraphs. If the copy is a sentence, use `--color-text` (#2E1D1B) or `--color-text-sub` (#B9939D).

## 3. Typography

**Display Font:** Cormorant Garamond (Georgia, serif fallback)
**Body Font:** Inter (sans-serif)
**Label/UI Font:** Montserrat (sans-serif)

**Character:** Cormorant Garamond at weight 300 sets the brand's editorial register — high-contrast strokes, tapered serifs, a regal thinness that commands without shouting. Montserrat handles all functional UI labeling: geometric, neutral, appropriately invisible. Inter covers reading comfort at body scale. The system never needs a fourth family; the serif-to-sans axis IS the hierarchy.

### Hierarchy
- **Display** (weight 300, clamp(40px, 6vw, 72px), line-height 1.05): Hero headlines and marquee section statements. Reserve for single utterances of maximum 8 words. Apply `text-wrap: balance`.
- **Headline** (weight 400, clamp(28px, 4vw, 48px), line-height 1.1): Page-level headings and product names at full-page scale. Apply `text-wrap: balance`.
- **Title** (weight 400, clamp(22px, 3vw, 36px), line-height 1.2): Section headings, secondary page headings. Apply `text-wrap: balance`.
- **Subtitle** (weight 400, clamp(18px, 2.5vw, 26px), line-height 1.3): Sub-sections, card titles, feature headings.
- **Body** (weight 400, 15px, line-height 1.75): All reading copy. Max 65-75ch line length enforced. Apply `text-wrap: pretty` on paragraphs of 3+ lines.
- **Label** (weight 500, 10px, letter-spacing 0.15em, uppercase, Montserrat): UI controls, navigation links, button text, badge text, form field labels. Hard cap: 4 words maximum in uppercase.
- **Caption** (weight 400, 12px, line-height 1.6, Warm Taupe): Price displays, metadata, helper text. Always on a white (#FFFFFF) card surface.

### Named Rules
**The Weight-300 Privilege.** Display text uses weight 300 exclusively. Body text never drops below weight 400. The contrast between the featherweight headline and the normal-weight body IS the hierarchy signal. Using 300 in body copy collapses the system.

**The Uppercase Ceiling.** Uppercase is reserved for the Label role (4 words max) and button CTAs. Running sentences, sub-headings, and editorial copy are never uppercased. Uppercase is a label, not a voice.

## 4. Elevation

Naronai is tonal, not shadowed. Surface depth moves through color steps: Warm White (#F7F2EC, page bg) → Soft Nude Pink (#E8B8AA, feature panels and elevated surfaces) → Pure White (#FFFFFF, product cards). In dark mode: Midnight Cocoa (#2E1D1B, bg) → Deep Burgundy (#4A1F2B, surfaces) → Wine Rose (#6E3947, elevated areas). No shadow communicates this layering; the palette itself is the elevation system.

Hard shadows appear in two contexts only: a functional hover lift on product cards (where the grid benefits from perceived separation), and the modal overlay (maximum interruption level). Using ambient box shadows on layout containers, editorial panels, or section wrappers is out of scope.

### Shadow Vocabulary
- **Card hover** (`box-shadow: 0 8px 32px rgba(46,29,27,0.14)`): Applied on `.product-card:hover` only. A warm cocoa-tinted lift that confirms interactivity. Not applied at rest.
- **Modal** (`box-shadow: 0 24px 64px rgba(46,29,27,0.22)`): Reserved for dialogs, drawers, and overlay panels at the highest z-index layer.
- **Ambient card** (`box-shadow: 0 2px 16px rgba(46,29,27,0.08)`): Acceptable on product cards at rest where the grid needs visual containment. Not used on editorial layout containers.

### Named Rules
**The Flat-By-Default Rule.** All surfaces are flat at rest. Shadows are responses to interaction state (hover lift) or layer hierarchy (modal). A surface that casts a shadow while nothing is happening is a surface that has forgotten what shadows are for.

## 5. Components

### Buttons

Sharp, angular authority. 2px radius at all sizes. All button text is Montserrat, uppercase, 0.12em tracking. Hover states use brightness or letter-spacing, never a color flood.

- **Shape:** 2px border-radius (sharp). This is non-negotiable. Buttons rounder than 4px read as generic DTC.
- **Primary:** Crimson Crown (#7A2F4B) background, Warm Ivory (#F4ECE5) text, no border. Hover: `filter: brightness(1.08)`. Padding: `12px 28px` (medium), `14px 32px` (large), `8px 16px` (small).
- **Ghost:** Transparent background, 1px Crimson Crown border, Crimson Crown text. Hover: fills solid with Crimson Crown bg and Ivory text. Used for secondary actions alongside a primary button.
- **Gold:** Antique Gold (#C3A05B) background, Midnight Cocoa (#2E1D1B) text. For ceremonial moments: "Book a consultation," membership CTAs. Hover: `filter: brightness(1.05)`.
- **Text / Link:** No background, no border. Antique Gold text with `→` suffix. Hover: letter-spacing expands from 0.12em to 0.18em. Used for inline navigation and editorial "learn more" moments.
- **Focus ring (all variants):** 2px Antique Gold outline, 2px offset.
- **Disabled:** 50% opacity. No other change.

### Badges

Compact status indicators living inside product imagery or adjacent to product names. Never standalone at editorial scale.

- **Tier** (gold-tinted): `rgba(195,160,91,0.15)` bg, Antique Gold text. Identifies product tier (Signature, Couture, Bespoke).
- **New** (burgundy-tinted): `rgba(122,47,75,0.15)` bg, Crimson Crown text. For new arrivals.
- **Sold Out** (neutral): border-subtle background, Warm Taupe text.
- All badges: 4px radius, 9px Montserrat, 0.14em tracking, weight 600, uppercase. Padding: `4px 12px`.

### Products Cards

The primary commercial unit. White surface on warm grounds; the contained white reinforces the sense of looking at something precious.

- **Corner Style:** 12px radius (lg). Softer than buttons — cards hold, buttons act.
- **Background:** Pure white (#FFFFFF) on light mode. Dark mode: Wine Rose (#6E3947) surface.
- **Border:** 0.5px solid Dusty Blush (#D7B2A5). Hairline, not structural.
- **Shadow Strategy:** `box-shadow: 0 2px 16px rgba(46,29,27,0.08)` at rest. Lifts to `0 8px 32px rgba(46,29,27,0.14)` with `translateY(-6px)` on hover.
- **Image:** 3:4 portrait aspect ratio. Always includes a cocoa gradient overlay: `linear-gradient(to top, rgba(46,29,27,0.7) 0%, transparent 50%)`. Badge positioned absolute bottom-left inside the image zone.
- **Body:** Cormorant Garamond 16px product name; Montserrat 11px price in Warm Taupe. Add-to-cart: 28px circle, Crimson Crown fill, ivory plus icon, spring-eased scale on hover.
- **Internal Padding:** 14px vertical, 16px horizontal.

### Inputs / Fields

Transparent-background inputs feel like they belong to the surface rather than sitting on top of it. The gold focus ring confirms the brand's attention.

- **Style:** Transparent background, 1px border in Champagne Cream (#E5D2C6). 8px radius (the only distinctly rounded element in the system — inputs feel approachable; buttons do not).
- **Label:** 10px Montserrat, 0.12em tracking, uppercase, Dusty Mauve (#B9939D) color.
- **Focus:** Border shifts to Antique Gold (#C3A05B). No fill change.
- **Error:** Border shifts to `#e57373`, helper text in `#e57373` at 12px body.
- **Placeholder:** Warm Taupe (#B69E96) text. Acceptable at this scale (inputs on white card surface).

### Navigation

- **Style:** Transparent background at page top; transitions to `rgba(var(--color-bg), 0.92)` with backdrop-blur on scroll.
- **Logo wordmark:** Cormorant Garamond, spaced tracking. Logo icon at left.
- **Nav links:** Montserrat, 11px, 0.1em tracking, uppercase, `--color-text` default. Hover: Antique Gold underline slides in from left (transform: scaleX) over 200ms ease-out-expo.
- **Active link:** Antique Gold underline persisted.
- **CTA in nav:** Ghost button variant.
- **Mobile:** Slide-in drawer from the right (`translateX(100%) → translateX(0)` over 350ms).

### Section Divider / Ornament

A signature micro-pattern that separates major editorial sections.

- **Structure:** `flex` row; 60px horizontal line (0.5px Antique Gold, 50% opacity) flanking a small gold diamond (♦, 8px, Antique Gold). Centered, `margin: 48px auto`.
- **Use:** One per transition between major content sections. Never inside cards, navigation, or utility components. This is an editorial breath, not a decorating habit.

## 6. Do's and Don'ts

### Do:
- **Do** use Crimson Crown (#7A2F4B) for primary CTAs, active nav states, and action indicators. One declaration per screen.
- **Do** use Antique Gold (#C3A05B) only for focus rings, ornament lines, badge tints, and the gold shimmer on hero display text. It is a material accent, not a fill.
- **Do** run Cormorant Garamond at weight 300 for all display-level text. The thinness is the statement.
- **Do** keep button border-radius at 2px. Angular precision is the Naronai signature; anything rounder reads as generic beauty DTC.
- **Do** express surface depth through tonal color steps (Warm White → Soft Nude Pink → White card), not shadow stacking.
- **Do** test body-copy contrast on every surface. `--color-text-muted` (#B69E96) is approximately 2.8:1 on Warm White and fails WCAG AA — never use it for reading copy.
- **Do** apply `text-wrap: balance` to h1-h3 elements and `text-wrap: pretty` to body paragraphs.
- **Do** use portrait aspect ratio (3:4) for all product imagery with the cocoa gradient overlay. The overlay is not optional; it is the card's voice.
- **Do** keep the Section Divider ornament to one per major content transition. Its rarity is its power.

### Don't:
- **Don't** build a generic Shopify DTC experience: soft-pink backgrounds, stock-photo heroes, "SHOP NOW" on every surface, UGC grids as primary proof. This is the first refusal.
- **Don't** build for Instagram or TikTok's aesthetic: motion for motion's sake, ephemeral layout, reel-native grid, social-proof overload. The site needs permanence.
- **Don't** create a wholesale or catalogue feel: spec grids without editorial context, bulk pricing language, utility-first product organization.
- **Don't** adopt cold Western luxury minimalism (Chanel/YSL mode): white-wall backgrounds, severe black serifs, clinical spacing that evacuates cultural warmth. Naronai's warmth is rooted and specific.
- **Don't** use `background-clip: text` with a gradient fill on any element other than the existing hero display `.gold-shimmer` class. Gradient text is an absolute ban for new work.
- **Don't** use `border-left` or `border-right` greater than 1px as a decorative color stripe on cards, list items, or callouts.
- **Don't** use identical icon + heading + text card grids for editorial sections. This is the "identical card grid" pattern; vary the layout by what it contains.
- **Don't** open every section with a tiny uppercase tracked eyebrow label. The `.text-label` class is for specific identifier contexts, not section openers by reflex.
- **Don't** use Antique Gold (#C3A05B) as a fill color on any surface larger than a badge or chip.
- **Don't** round button border-radius beyond 4px. Anything softer erases the brand's angular precision signature.
- **Don't** use #B69E96 (Warm Taupe) for body copy or sentence-level text. Price labels on white (#FFFFFF) cards are the only permitted use at body size.
