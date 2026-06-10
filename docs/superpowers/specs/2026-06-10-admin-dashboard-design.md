# Naronai Admin Dashboard — Design Spec
**Date:** 2026-06-10
**Status:** Approved for implementation

---

## Overview

A protected admin section (`/admin/*`) built inside the existing Next.js app. Primary users are non-technical staff. Primary daily task is order management; secondary task is product management. All destructive actions require explicit confirmation.

**Not in scope:** checkout flow, customer-facing order tracking, email template design, analytics beyond basic counts.

---

## Architecture

### Approach
Route group inside the existing app at `src/app/admin/`. Shares all existing Supabase types, client code, and auth infrastructure. Separate visual layout from the storefront.

### Route Structure

```
src/app/admin/
  layout.tsx                  — sidebar nav + server-side auth guard
  page.tsx                    — redirects to /admin/orders
  orders/
    page.tsx                  — order list with filters and search
    [id]/
      page.tsx                — order detail + status controls
  products/
    page.tsx                  — product list with inline stock toggle
    new/
      page.tsx                — create product form
    [id]/
      page.tsx                — edit product form
  customers/
    page.tsx                  — customer list (read-only)
  newsletter/
    page.tsx                  — subscriber list (superadmin only)
```

### Auth & Access Control

- `middleware.ts` intercepts all `/admin/*` routes on every request
- Checks Supabase session server-side; unauthenticated users redirect to `/auth/sign-in`
- After session check, queries `admins` table via `is_admin()` function; non-admins redirect to `/` with an error toast
- Session is re-validated on each admin page load — no client-side trust

**Role permissions:**

| Action | editor | superadmin |
|--------|--------|------------|
| View orders | ✓ | ✓ |
| Update order status | ✓ | ✓ |
| Cancel order | ✓ | ✓ |
| Revert order status | — | ✓ |
| View products | ✓ | ✓ |
| Create / edit products | ✓ | ✓ |
| Toggle stock (inline) | ✓ | ✓ |
| Delete product | — | ✓ |
| View customers | ✓ | ✓ |
| View newsletter | — | ✓ |
| Export newsletter CSV | — | ✓ |

### Admin Layout

- Fixed left sidebar (240px): Naronai wordmark top, nav links (Orders, Products, Customers; Newsletter for superadmin), user email + role badge at bottom, sign out button
- Main content area: right side, scrollable
- Sidebar highlights active route with gold (`#c9a96e`) left border and text
- Mobile: sidebar collapses to icon-only rail (tablet) or hamburger (mobile) — admin is desktop-primary but must not break on mobile

---

## Section 1 — Orders

### Order List (`/admin/orders`)

- Status filter tabs across top: All · Pending · Paid · Processing · Shipped · Delivered · Cancelled
- Each tab has a count badge showing live totals
- Search input: filters by customer email or Paystack reference (debounced, client-side filter on loaded data)
- Table columns: Order ref (short ID), Customer (name + email), Items (summary e.g. "2 items"), Total (₦), Status badge, Date placed
- Sort: newest first by default; columns for Total and Date are sortable
- Clicking any row navigates to `/admin/orders/[id]`
- Empty state: clear message per filter tab ("No shipped orders yet")

### Order Detail (`/admin/orders/[id]`)

**Customer block:** Full name, email, phone, shipping address (formatted)

**Items block:** Table of line items — product name, selected color, selected length, quantity, unit price (₦), line total (₦). Subtotal, shipping fee, order total at bottom.

**Payment block:** Paystack reference, payment method, timestamp of payment confirmation.

**Status block:**
- Current status shown as a large coloured badge
- Status progression: `pending` → `paid` → `processing` → `shipped` → `delivered`
- Dropdown of valid next statuses (forward only for editors). "Update Status" button triggers a confirmation modal: "Move this order to [status]?" with Confirm / Cancel.
- On confirm: status updates in Supabase, a Resend transactional email fires automatically to the customer.
- "Cancel order" is a separate red button. Requires typed confirmation: staff must type `CANCEL` before the button activates.
- Superadmin sees an additional "Revert status" option in a dropdown.

**Status timeline:** Chronological list at the bottom of every status transition with timestamp and (future) the admin user who made the change.

**Status badge colours:**
- pending — grey (`#6b7280`)
- paid — blue (`#3b82f6`)
- processing — amber (`#f59e0b`)
- shipped — indigo (`#6366f1`)
- delivered — green (`#22c55e`)
- cancelled — red (`#ef4444`)

---

## Section 2 — Products

### Product List (`/admin/products`)

- Filter bar: Tier (All / Signature / Couture / Bespoke), Category, Stock status (All / In Stock / Out of Stock)
- Table/card rows: thumbnail, name, tier badge, category, price (₦), in-stock toggle (editable inline — optimistic update with rollback on error)
- "Add product" button (top right) → `/admin/products/new`
- Click row → edit form at `/admin/products/[id]`
- Empty state with prompt to add first product

### Product Form (shared by create + edit)

**Basic info:**
- Name (required)
- Slug (auto-generated from name using `kebab-case`, editable; validated unique on blur)
- Tier (select: Signature / Couture / Bespoke, required)
- Category (select with existing categories + free-text option)
- Price in ₦ (integer input; stored as kobo = value × 100)

**Description:** Textarea for brand-voice copy. Character count shown.

**Attributes:** Hair type, density, cap type, origin — all optional text fields.

**Variants:**
- Length options: multi-select chip group (12" through 30" in 2" increments)
- Colors: repeating rows of [color name text input] + [hex color picker] + [optional swatch image upload]. Add row / remove row buttons.

**Images:**
- Drag-and-drop upload zone accepting JPG/PNG/WebP, max 5MB per file
- Files upload to Supabase Storage bucket `product-images` on selection
- Thumbnails appear in upload order; first image is the hero image
- Drag to reorder; × button to remove
- Shows upload progress per file

**Flags:** In stock (toggle), New arrival (toggle)

**Actions:**
- Save button (creates or updates). Disabled while uploading images.
- Unsaved-change guard: browser `beforeunload` + in-app navigation warning if form is dirty
- Delete button (superadmin only, bottom of form, red). Opens a confirmation modal: "Delete [product name]? This cannot be undone." Confirm button is red and activates after a 1.5s delay (prevents accidental click-through).

### Data Migration

Products currently hardcoded in `src/lib/data/products.ts`. A one-time seed script (`scripts/seed-products.ts`) will push all 12 existing products into the Supabase `products` table. After the admin is live and products are confirmed in the database, `products.ts` is removed and all product queries switch to Supabase.

---

## Section 3 — Customers

Read-only for all roles. Staff can look up but not modify customer records.

**List view (`/admin/customers`):**
- Table: full name, email, phone, date joined, order count, total spent (₦)
- Search by name or email
- Sort by date joined or total spent

**Detail (expandable row or modal):**
- Order history with links to order detail pages
- Wishlist items (product names only)
- Shipping addresses used across orders

No edit, no delete. Intentional — prevents accidental data damage.

---

## Section 4 — Newsletter

Superadmin only. Not visible in editor nav.

**List view (`/admin/newsletter`):**
- Table: email, first name, source (site / checkout), status (active / unsubscribed), date subscribed
- Filter by status
- "Export CSV" button (downloads all active subscribers as CSV for Resend import; columns: email, first_name, subscribed_at)
- No bulk delete. Unsubscribed records are retained for compliance; status is toggled, not erased.

---

## Visual Design

### Palette

| Token | Value | Use |
|-------|-------|-----|
| Background | `#0f0f0f` | Page background |
| Sidebar bg | `#161616` | Sidebar surface |
| Surface | `#1a1a1a` | Cards, table rows |
| Border | `#2a2a2a` | Dividers, input borders |
| Gold accent | `#c9a96e` | Active nav, primary buttons, focus rings |
| Text primary | `#f5f0e8` | Headings, body |
| Text muted | `#8a8070` | Secondary labels, timestamps |

### Typography

Same typefaces as storefront but tighter weights — information density over presence. No display sizing in the admin.

### Components

shadcn/ui as the base (already installed): Table, Dialog, Select, Switch, Badge, Tabs, Input, Button. No custom animations. No GSAP. Interactions should feel instant.

### Tone

Functional and clear. Every label tells staff exactly what will happen. Error messages name the problem and suggest the fix ("Price must be a number greater than 0"). Success states are brief ("Order updated", "Product saved").

---

## Open Questions / Future Scope

- **Order status email templates** — Resend templates need designing separately (not in this spec)
- **Admin activity log** — recording which admin made which status change (superadmin audit trail, post-MVP)
- **Analytics dashboard** — revenue charts, top products, conversion (post-MVP)
- **Bespoke order flow** — custom consultation requests (post-MVP)
- **Inventory counts** — quantity tracking beyond binary in_stock flag (post-MVP)
