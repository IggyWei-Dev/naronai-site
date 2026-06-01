# Naronai — Colour Design System
> Extracted strictly from official Naronai brand colour guides and brand effects guide.

---

## Light Mode Palette

| # | Name | Hex | Role |
|---|------|-----|------|
| 1 | Warm White | `#F7F2EC` | Page background |
| 2 | Soft Nude Pink | `#E8B8AA` | Surface / card background |
| 3 | Champagne Cream | `#E5D2C6` | Borders, dividers, subtle overlays |
| 4 | Dusty Mauve | `#B9939D` | Secondary text, tags, muted UI |
| 5 | Warm Taupe | `#B69E96` | Placeholder text, captions |
| 6 | Antique Gold | `#C3A05B` | Metallic accent — use sparingly |
| 7 | Deep Burgundy Pink | `#7A2F4B` | Primary CTA, headings, emphasis |
| 8 | Midnight Cocoa | `#2E1D1B` | Body text, dark contrast |

```css
/* Light Mode CSS Tokens */
--color-lm-bg:            #F7F2EC;
--color-lm-surface:       #E8B8AA;
--color-lm-border:        #E5D2C6;
--color-lm-muted:         #B9939D;
--color-lm-placeholder:   #B69E96;
--color-lm-gold:          #C3A05B;
--color-lm-primary:       #7A2F4B;
--color-lm-text:          #2E1D1B;
```

---

## Dark Mode Palette

| # | Name | Hex | Role |
|---|------|-----|------|
| 1 | Midnight Cocoa | `#2E1D1B` | Page background |
| 2 | Deep Burgundy | `#4A1F2B` | Card / surface background |
| 3 | Wine Rose | `#6E3947` | Elevated surface, hover states |
| 4 | Cocoa Brown | `#5A443F` | Borders, dividers |
| 5 | Mauve Taupe | `#8D6E74` | Muted text, secondary UI |
| 6 | Soft Blush Nude | `#D7B2A5` | Secondary text, labels |
| 7 | Warm Ivory | `#F4ECE5` | Primary text |
| 8 | Aged Gold | `#B88D47` | Metallic accent (dark mode variant) |

```css
/* Dark Mode CSS Tokens */
--color-dm-bg:            #2E1D1B;
--color-dm-surface:       #4A1F2B;
--color-dm-elevated:      #6E3947;
--color-dm-border:        #5A443F;
--color-dm-muted:         #8D6E74;
--color-dm-text-secondary:#D7B2A5;
--color-dm-text:          #F4ECE5;
--color-dm-gold:          #B88D47;
```

---

## Semantic Token Map

These are the tokens your code should reference. They resolve to the correct hex based on mode.

```css
:root {
  --color-bg:         #F7F2EC;
  --color-surface:    #E8B8AA;
  --color-border:     #E5D2C6;
  --color-text:       #2E1D1B;
  --color-text-sub:   #B9939D;
  --color-text-muted: #B69E96;
  --color-primary:    #7A2F4B;
  --color-gold:       #C3A05B;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:         #2E1D1B;
    --color-surface:    #4A1F2B;
    --color-border:     #5A443F;
    --color-text:       #F4ECE5;
    --color-text-sub:   #D7B2A5;
    --color-text-muted: #8D6E74;
    --color-primary:    #C3A05B;   /* Gold becomes primary in dark mode */
    --color-gold:       #B88D47;
  }
}
```

---

## Brand Effects

### 1. Primary Gradient
Use for: hero moments, campaign graphics, premium highlights.

```css
--gradient-primary: linear-gradient(160deg, #D7B2A5, #7A2F4B);
```

### 2. Accent Gradient
Use for: subtle backgrounds, packaging details, soft overlays.

```css
--gradient-accent: linear-gradient(160deg, #F4ECE5, #E5D2C6);
```

### 3. Metallic Accent — Antique Gold `#C3A05B`
Use sparingly for: foil details, dividers, icons, premium emphasis.

```css
--color-metallic: #C3A05B;

/* Shimmer animation for metallic text */
--gradient-metallic: linear-gradient(90deg, #C3A05B 30%, #F0D890 50%, #C3A05B 70%);
```

### 4. Midnight Contrast — `#2E1D1B`
Use for: dark mode backgrounds, contrast text, evening/dark brand expression.

```css
--color-midnight: #2E1D1B;
```

### 5. Opacity & Overlay
Use overlays to add depth, soften imagery, and create atmosphere.

```css
--overlay-light:  rgba(46, 29, 27, 0.20);   /* 20% — barely-there tint */
--overlay-mid:    rgba(46, 29, 27, 0.50);   /* 50% — readable text over image */
--overlay-heavy:  rgba(46, 29, 27, 0.80);   /* 80% — strong atmosphere */
```

---

## Texture & Finish

| Finish | Description | When to use |
|--------|-------------|-------------|
| **Soft Gradient** | Smooth, airy transition between two brand tones | Hero sections, campaign banners, packaging highlights |
| **Matte Flat** | Single solid brand colour, no gradient | Clean UI surfaces, minimal cards, typography backgrounds |
| **Metallic Glow** | Warm gold shimmer, used as accent only | Premium badges, divider ornaments, CTA emphasis |

---

## Usage Rules

- **Gold (`#C3A05B` / `#B88D47`) is an accent** — never use as a large background fill. Reserve for icons, dividers, badges, and one highlight word per section.
- **Never combine Soft Nude Pink and Champagne Cream** as text-on-background — insufficient contrast. Use Midnight Cocoa or Deep Burgundy Pink for text on light surfaces.
- **Avoid harsh neon, glitter textures, or overly busy overlays.** Keep effects soft, refined, and intentional.
- **Prioritise smooth gradients** — transitions between adjacent palette colours only (e.g. Soft Nude Pink → Warm Taupe, not Soft Nude Pink → Deep Burgundy directly).
- The **hero section and footer are always dark** (`#2E1D1B` base) regardless of light/dark system preference.
- The **announcement bar is always dark** (`#2E1D1B` bg, `#D7B2A5` text) in both modes.
