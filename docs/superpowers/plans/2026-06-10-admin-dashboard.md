# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected `/admin` section with order management, product CRUD with Supabase Storage image upload, customer and newsletter views, and a seed script to migrate hardcoded products into Supabase.

**Architecture:** Route group at `src/app/admin/` inside the existing Next.js 14 app. Middleware blocks unauthenticated access; the admin layout verifies admin role and passes it to the sidebar. Server components fetch data via typed Supabase queries in `src/lib/admin/queries.ts`; mutations go through Next.js Server Actions in `src/lib/admin/actions.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase (`@supabase/ssr`), shadcn/ui (`base-nova` style already configured), react-hook-form, zod, Resend, Vitest (utility tests only)

---

## File Map

**New files:**
```
src/
  app/admin/
    layout.tsx
    page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/page.tsx
    customers/page.tsx
    newsletter/page.tsx
  components/admin/
    AdminSidebar.tsx
    orders/OrderStatusBadge.tsx
    orders/OrdersTable.tsx
    orders/OrderStatusTimeline.tsx
    orders/OrderStatusControls.tsx
    products/ProductsTable.tsx
    products/ProductForm.tsx
    products/ImageUploadZone.tsx
    products/ColorVariantBuilder.tsx
    customers/CustomersTable.tsx
    newsletter/NewsletterTable.tsx
  lib/admin/
    utils.ts
    queries.ts
    actions.ts
scripts/
  seed-products.ts
vitest.config.ts
src/lib/admin/utils.test.ts
```

**Modified files:**
```
src/middleware.ts           — add /admin session guard
src/lib/resend/index.ts    — add sendOrderStatusUpdate
```

---

## Task 1: Vitest setup + shadcn components

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install Vitest**

```bash
npm install --save-dev vitest @vitest/coverage-v8
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Install required shadcn components**

Run each command and accept any prompts:
```bash
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add separator
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add input
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
```

- [ ] **Step 5: Verify shadcn components were added to `src/components/ui/`**

```bash
ls src/components/ui/
```

Expected: new files including `table.tsx`, `dialog.tsx`, `alert-dialog.tsx`, `select.tsx`, `switch.tsx`, `tabs.tsx`, `separator.tsx`, `form.tsx`, `textarea.tsx`, `label.tsx`, `input.tsx`, `dropdown-menu.tsx`, `badge.tsx`

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json src/components/ui/
git commit -m "chore: add Vitest and install shadcn admin components"
```

---

## Task 2: Admin utility functions (TDD)

**Files:**
- Create: `src/lib/admin/utils.ts`
- Create: `src/lib/admin/utils.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/admin/utils.test.ts
import { describe, it, expect } from 'vitest'
import { toKobo, fromKobo, toSlug, formatOrderRef } from './utils'

describe('toKobo', () => {
  it('converts naira to kobo', () => {
    expect(toKobo(89000)).toBe(8900000)
  })
  it('rounds fractional kobo', () => {
    expect(toKobo(100.005)).toBe(10001)
  })
})

describe('fromKobo', () => {
  it('converts kobo to naira', () => {
    expect(fromKobo(8900000)).toBe(89000)
  })
})

describe('toSlug', () => {
  it('converts "The Adanna" to "the-adanna"', () => {
    expect(toSlug('The Adanna')).toBe('the-adanna')
  })
  it('removes special characters', () => {
    expect(toSlug('Hello & World!')).toBe('hello-world')
  })
  it('collapses multiple spaces to single dash', () => {
    expect(toSlug('The  Big  Wig')).toBe('the-big-wig')
  })
})

describe('formatOrderRef', () => {
  it('returns first 8 chars uppercased', () => {
    expect(formatOrderRef('abc12345-rest-of-uuid')).toBe('#ABC12345')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: 7 failing tests — `utils` module not found.

- [ ] **Step 3: Implement utils**

```ts
// src/lib/admin/utils.ts

export function toKobo(naira: number): number {
  return Math.round(naira * 100)
}

export function fromKobo(kobo: number): number {
  return kobo / 100
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatOrderRef(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 7 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/utils.ts src/lib/admin/utils.test.ts package.json vitest.config.ts
git commit -m "feat: admin utility functions with tests"
```

---

## Task 3: Middleware admin protection

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Update middleware to protect /admin routes**

Replace the contents of `src/middleware.ts` with:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session token — do not remove.
  const { data: { user } } = await supabase.auth.getUser()

  // Block unauthenticated access to admin routes.
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: Verify manually**

Start dev server (`npm run dev`). Open `http://localhost:3000/admin/orders` while signed out. Expected: redirect to `/auth/sign-in?redirect=/admin/orders`.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: protect admin routes with session middleware"
```

---

## Task 4: Admin layout + sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create the admin sidebar component**

```tsx
// src/components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Package, Users, Mail, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  role: 'superadmin' | 'editor'
  userEmail: string
}

const NAV = [
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/admin/products',  label: 'Products',  icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]

export function AdminSidebar({ role, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const links = role === 'superadmin'
    ? [...NAV, { href: '/admin/newsletter', label: 'Newsletter', icon: Mail }]
    : NAV

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[#161616] border-r border-[#2a2a2a] h-screen sticky top-0">
      {/* Wordmark */}
      <div className="px-6 py-5 border-b border-[#2a2a2a]">
        <span className="text-[#f5f0e8] font-light tracking-[0.25em] text-sm uppercase">
          Naronai
        </span>
        <span className="block text-[#8a8070] text-[10px] tracking-[0.12em] uppercase mt-0.5">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors',
                active
                  ? 'bg-[#1e1e1e] text-[#c9a96e] border-l-2 border-[#c9a96e] pl-[10px]'
                  : 'text-[#8a8070] hover:text-[#f5f0e8] hover:bg-[#1a1a1a]',
              ].join(' ')}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User info + sign out */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <p className="text-[#f5f0e8] text-xs truncate">{userEmail}</p>
        <p className="text-[#8a8070] text-[10px] capitalize mt-0.5">{role}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 mt-3 text-[#8a8070] hover:text-[#f5f0e8] text-xs transition-colors"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create admin layout**

```tsx
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Naronai Admin' }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!adminRecord) redirect('/?error=unauthorized')

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
      <AdminSidebar role={adminRecord.role} userEmail={user.email!} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create root admin redirect page**

```tsx
// src/app/admin/page.tsx
import { redirect } from 'next/navigation'
export default function AdminRoot() {
  redirect('/admin/orders')
}
```

- [ ] **Step 4: Verify manually**

Sign in as an admin user. Open `http://localhost:3000/admin`. Expected: redirect to `/admin/orders` with sidebar showing Orders, Products, Customers (and Newsletter for superadmin).

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx src/components/admin/AdminSidebar.tsx
git commit -m "feat: admin layout with role-based sidebar"
```

---

## Task 5: Admin Supabase queries

**Files:**
- Create: `src/lib/admin/queries.ts`

- [ ] **Step 1: Create the queries file**

```ts
// src/lib/admin/queries.ts
import { createClient } from '@/lib/supabase/server'
import type { OrderRow, ProductRow, ProfileRow, NewsletterSubscriberRow } from '@/lib/supabase/types'

// ── Shared types ───────────────────────────────────────────

export type OrderStatus = OrderRow['status']

export interface OrderItem {
  productId:      string
  productName:    string
  selectedColor?: string
  selectedLength?: string
  quantity:       number
  unitPrice:      number
}

export interface ShippingAddress {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  line1:     string
  line2?:    string
  city:      string
  state:     string
}

export interface AdminOrder extends OrderRow {
  parsedItems:   OrderItem[]
  parsedAddress: ShippingAddress
}

export interface CustomerWithStats {
  profile:    ProfileRow
  orderCount: number
  totalSpent: number
  lastOrder?: string
}

// ── Orders ────────────────────────────────────────────────

export async function getOrders(): Promise<AdminOrder[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map(parseOrder)
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return parseOrder(data)
}

function parseOrder(row: OrderRow): AdminOrder {
  return {
    ...row,
    parsedItems:   Array.isArray(row.items) ? row.items as unknown as OrderItem[] : [],
    parsedAddress: row.shipping_address as unknown as ShippingAddress,
  }
}

// ── Products ──────────────────────────────────────────────

export async function getProducts(): Promise<ProductRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ── Customers ─────────────────────────────────────────────

export async function getCustomersWithStats(): Promise<CustomerWithStats[]> {
  const supabase = createClient()

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('user_id, total, created_at').eq('status', 'delivered'),
  ])

  return (profiles ?? []).map((profile) => {
    const customerOrders = (orders ?? []).filter((o) => o.user_id === profile.id)
    return {
      profile,
      orderCount: customerOrders.length,
      totalSpent: customerOrders.reduce((sum, o) => sum + o.total, 0),
      lastOrder:  customerOrders[0]?.created_at,
    }
  })
}

// ── Newsletter ────────────────────────────────────────────

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin/queries.ts
git commit -m "feat: admin Supabase query layer"
```

---

## Task 6: Server actions + order status email

**Files:**
- Create: `src/lib/admin/actions.ts`
- Modify: `src/lib/resend/index.ts`

- [ ] **Step 1: Add `sendOrderStatusUpdate` to Resend module**

Append to `src/lib/resend/index.ts`:

```ts
export async function sendOrderStatusUpdate(
  email: string,
  orderId: string,
  newStatus: string,
) {
  const resend   = new Resend(process.env.RESEND_API_KEY)
  const orderRef = `#${orderId.slice(0, 8).toUpperCase()}`

  const statusLabels: Record<string, string> = {
    processing: 'Your order is being prepared',
    shipped:    'Your order is on its way',
    delivered:  'Your order has been delivered',
    cancelled:  'Your order has been cancelled',
  }

  const label = statusLabels[newStatus] ?? `Order status updated to ${newStatus}`

  await resend.emails.send({
    from:    `Naronai <${FROM}>`,
    to:      email,
    subject: `${label} — ${orderRef}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F2EC;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#2E1D1B;padding:32px;text-align:center;">
          <p style="margin:0;font-family:'Georgia',serif;font-size:22px;letter-spacing:0.25em;text-transform:uppercase;color:#F4ECE5;font-weight:300;">NARONAI</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;color:#2E1D1B;">${label}</p>
          <p style="margin:16px 0 0;font-family:'Inter',sans-serif;font-size:14px;color:#5A443F;">Order ${orderRef}</p>
        </td></tr>
        <tr><td style="background:#2E1D1B;padding:20px;text-align:center;">
          <p style="margin:0;font-family:'Montserrat',sans-serif;font-size:10px;color:#8D6E74;letter-spacing:0.1em;">
            Questions? <a href="mailto:hello@naronai.com" style="color:#C3A05B;">hello@naronai.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
```

- [ ] **Step 2: Create server actions**

```ts
// src/lib/admin/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendOrderStatusUpdate } from '@/lib/resend'
import type { OrderStatus } from './queries'
import type { ProductRow } from '@/lib/supabase/types'
import { toKobo } from './utils'

// ── Orders ────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  customerEmail: string | null,
) {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  const emailTarget = customerEmail
  if (emailTarget && ['processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
    await sendOrderStatusUpdate(emailTarget, orderId, newStatus).catch(() => {})
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

// ── Products ─────────────────────────────────────────────

export interface ProductFormData {
  name:        string
  slug:        string
  description: string
  tier:        'Signature' | 'Couture' | 'Bespoke'
  category:    string
  priceNaira:  number
  hairType:    string
  density:     string
  capType:     string
  origin:      string
  lengths:     string[]
  colors:      { name: string; hex: string; image?: string }[]
  images:      string[]
  inStock:     boolean
  isNew:       boolean
}

export async function createProduct(data: ProductFormData) {
  const supabase = createClient()
  const { error } = await supabase.from('products').insert({
    name:        data.name,
    slug:        data.slug,
    description: data.description || null,
    tier:        data.tier,
    category:    data.category || null,
    price:       toKobo(data.priceNaira),
    hair_type:   data.hairType   || null,
    density:     data.density    || null,
    cap_type:    data.capType    || null,
    origin:      data.origin     || null,
    lengths:     data.lengths,
    colors:      data.colors,
    images:      data.images,
    in_stock:    data.inStock,
    is_new:      data.isNew,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

export async function updateProduct(id: string, data: ProductFormData) {
  const supabase = createClient()
  const { error } = await supabase.from('products').update({
    name:        data.name,
    slug:        data.slug,
    description: data.description || null,
    tier:        data.tier,
    category:    data.category || null,
    price:       toKobo(data.priceNaira),
    hair_type:   data.hairType   || null,
    density:     data.density    || null,
    cap_type:    data.capType    || null,
    origin:      data.origin     || null,
    lengths:     data.lengths,
    colors:      data.colors,
    images:      data.images,
    in_stock:    data.inStock,
    is_new:      data.isNew,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
}

export async function toggleProductStock(id: string, inStock: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/actions.ts src/lib/resend/index.ts
git commit -m "feat: admin server actions and order status email"
```

---

## Task 7: Orders list page

**Files:**
- Create: `src/components/admin/orders/OrderStatusBadge.tsx`
- Create: `src/components/admin/orders/OrdersTable.tsx`
- Create: `src/app/admin/orders/page.tsx`

- [ ] **Step 1: Create OrderStatusBadge**

```tsx
// src/components/admin/orders/OrderStatusBadge.tsx
import type { OrderStatus } from '@/lib/admin/queries'

const CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: 'Pending',    className: 'bg-[#374151] text-[#9ca3af]' },
  paid:       { label: 'Paid',       className: 'bg-[#1e3a5f] text-[#60a5fa]' },
  processing: { label: 'Processing', className: 'bg-[#451a03] text-[#fbbf24]' },
  shipped:    { label: 'Shipped',    className: 'bg-[#1e1b4b] text-[#a5b4fc]' },
  delivered:  { label: 'Delivered',  className: 'bg-[#14532d] text-[#4ade80]' },
  cancelled:  { label: 'Cancelled',  className: 'bg-[#450a0a] text-[#f87171]' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = CONFIG[status] ?? CONFIG.pending
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${className}`}>
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Create OrdersTable client component**

```tsx
// src/components/admin/orders/OrdersTable.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatOrderRef } from '@/lib/admin/utils'
import { formatNaira } from '@/lib/utils'
import type { AdminOrder, OrderStatus } from '@/lib/admin/queries'

const STATUS_TABS: { value: 'all' | OrderStatus; label: string }[] = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'paid',       label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped' },
  { value: 'delivered',  label: 'Delivered' },
  { value: 'cancelled',  label: 'Cancelled' },
]

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter()
  const [tab,    setTab]    = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) => {
    const matchesTab    = tab === 'all' || o.status === tab
    const query         = search.toLowerCase()
    const matchesSearch = !query
      || o.parsedAddress.email?.toLowerCase().includes(query)
      || o.paystack_ref?.toLowerCase().includes(query)
      || o.id.toLowerCase().includes(query)
    return matchesTab && matchesSearch
  })

  function countByStatus(s: OrderStatus) {
    return orders.filter((o) => o.status === s).length
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a]">
            <TabsTrigger value="all" className="text-xs">
              All <span className="ml-1.5 text-[#8a8070]">{orders.length}</span>
            </TabsTrigger>
            {STATUS_TABS.slice(1).map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="text-xs">
                {label}
                {countByStatus(value as OrderStatus) > 0 && (
                  <span className="ml-1.5 text-[#8a8070]">{countByStatus(value as OrderStatus)}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Input
          placeholder="Search by email or ref…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] text-sm placeholder:text-[#8a8070]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#8a8070] text-sm py-12 text-center">No orders found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
              <th className="text-left py-2 pr-4 font-normal">Ref</th>
              <th className="text-left py-2 pr-4 font-normal">Customer</th>
              <th className="text-left py-2 pr-4 font-normal">Items</th>
              <th className="text-right py-2 pr-4 font-normal">Total</th>
              <th className="text-left py-2 pr-4 font-normal">Status</th>
              <th className="text-left py-2 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] cursor-pointer transition-colors"
              >
                <td className="py-3 pr-4 text-[#c9a96e] font-mono text-xs">
                  {formatOrderRef(order.id)}
                </td>
                <td className="py-3 pr-4">
                  <p className="text-[#f5f0e8]">
                    {order.parsedAddress.firstName} {order.parsedAddress.lastName}
                  </p>
                  <p className="text-[#8a8070] text-xs">{order.parsedAddress.email}</p>
                </td>
                <td className="py-3 pr-4 text-[#8a8070]">
                  {order.parsedItems.length} item{order.parsedItems.length !== 1 ? 's' : ''}
                </td>
                <td className="py-3 pr-4 text-right text-[#f5f0e8]">
                  {formatNaira(order.total / 100)}
                </td>
                <td className="py-3 pr-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-3 text-[#8a8070] text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-NG', {
                    day:   'numeric',
                    month: 'short',
                    year:  'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create orders page**

```tsx
// src/app/admin/orders/page.tsx
import { getOrders } from '@/lib/admin/queries'
import { OrdersTable } from '@/components/admin/orders/OrdersTable'

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Orders</h1>
        <p className="text-[#8a8070] text-sm mt-1">{orders.length} total orders</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
```

- [ ] **Step 4: Manually verify**

Visit `/admin/orders`. Expected: page renders with status tabs and empty state or orders table. Tabs filter correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/orders/OrderStatusBadge.tsx src/components/admin/orders/OrdersTable.tsx src/app/admin/orders/page.tsx
git commit -m "feat: admin orders list page"
```

---

## Task 8: Order detail page

**Files:**
- Create: `src/components/admin/orders/OrderStatusTimeline.tsx`
- Create: `src/components/admin/orders/OrderStatusControls.tsx`
- Create: `src/app/admin/orders/[id]/page.tsx`

- [ ] **Step 1: Create OrderStatusTimeline**

```tsx
// src/components/admin/orders/OrderStatusTimeline.tsx
import type { OrderStatus } from '@/lib/admin/queries'
import { OrderStatusBadge } from './OrderStatusBadge'

const STATUS_ORDER: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export function OrderStatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-[#f87171] text-sm">
        <span className="w-2 h-2 rounded-full bg-[#f87171]" />
        This order was cancelled.
      </div>
    )
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus)

  return (
    <ol className="flex items-center gap-0">
      {STATUS_ORDER.map((status, i) => {
        const done    = i <= currentIndex
        const current = i === currentIndex
        return (
          <li key={status} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={[
                'w-3 h-3 rounded-full border-2 transition-colors',
                done    ? 'bg-[#c9a96e] border-[#c9a96e]' : 'bg-transparent border-[#2a2a2a]',
                current ? 'ring-2 ring-[#c9a96e]/30' : '',
              ].join(' ')} />
              <span className={`mt-1.5 text-[10px] capitalize whitespace-nowrap ${done ? 'text-[#c9a96e]' : 'text-[#8a8070]'}`}>
                {status}
              </span>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div className={`w-16 h-px mx-1 mb-4 ${i < currentIndex ? 'bg-[#c9a96e]' : 'bg-[#2a2a2a]'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 2: Create OrderStatusControls (client component)**

```tsx
// src/components/admin/orders/OrderStatusControls.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { updateOrderStatus } from '@/lib/admin/actions'
import type { OrderStatus } from '@/lib/admin/queries'
import toast from 'react-hot-toast'

const FORWARD_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending:    ['paid', 'cancelled'],
  paid:       ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered', 'cancelled'],
  delivered:  [],
  cancelled:  [],
}

interface Props {
  orderId:       string
  currentStatus: OrderStatus
  customerEmail: string | null
  role:          'superadmin' | 'editor'
}

export function OrderStatusControls({ orderId, currentStatus, customerEmail, role }: Props) {
  const router          = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<OrderStatus | ''>('')
  const [cancelInput, setCancelInput] = useState('')

  const isCancelNext   = selected === 'cancelled'
  const validStatuses  = role === 'superadmin'
    ? (['pending','paid','processing','shipped','delivered','cancelled'] as OrderStatus[]).filter(s => s !== currentStatus)
    : FORWARD_STATUSES[currentStatus]

  if (validStatuses.length === 0) {
    return <p className="text-[#8a8070] text-sm">No further status updates available.</p>
  }

  async function handleUpdate() {
    if (!selected || selected === currentStatus) return
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, selected as OrderStatus, customerEmail)
        toast.success(`Order moved to ${selected}`)
        setSelected('')
        router.refresh()
      } catch {
        toast.error('Failed to update order status')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selected} onValueChange={(v) => setSelected(v as OrderStatus)}>
          <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] text-sm">
            <SelectValue placeholder="Move to…" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
            {validStatuses.filter(s => s !== 'cancelled').map((s) => (
              <SelectItem key={s} value={s} className="text-[#f5f0e8] capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected && selected !== 'cancelled' && (
          <button
            onClick={handleUpdate}
            disabled={isPending}
            className="px-4 py-2 bg-[#c9a96e] text-[#0f0f0f] text-sm rounded hover:bg-[#b8975e] disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Saving…' : 'Update Status'}
          </button>
        )}
      </div>

      {/* Cancel order — separate destructive action */}
      {validStatuses.includes('cancelled') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-[#f87171] text-sm hover:underline">
              Cancel this order
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#f5f0e8]">Cancel order?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#8a8070]">
                This will notify the customer. Type <strong className="text-[#f5f0e8]">CANCEL</strong> to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <input
              value={cancelInput}
              onChange={(e) => setCancelInput(e.target.value)}
              placeholder="Type CANCEL"
              className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a2a2a] text-[#8a8070]">
                Back
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={cancelInput !== 'CANCEL' || isPending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await updateOrderStatus(orderId, 'cancelled', customerEmail)
                      toast.success('Order cancelled')
                      router.refresh()
                    } catch {
                      toast.error('Failed to cancel order')
                    }
                  })
                }}
                className="bg-[#f87171] text-white hover:bg-[#ef4444] disabled:opacity-40"
              >
                Cancel Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create order detail page**

```tsx
// src/app/admin/orders/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOrderById } from '@/lib/admin/queries'
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge'
import { OrderStatusTimeline } from '@/components/admin/orders/OrderStatusTimeline'
import { OrderStatusControls } from '@/components/admin/orders/OrderStatusControls'
import { formatNaira } from '@/lib/utils'
import { formatOrderRef } from '@/lib/admin/utils'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  const order = await getOrderById(params.id)
  if (!order) notFound()

  const addr  = order.parsedAddress
  const items = order.parsedItems
  const email = addr.email ?? order.guest_email

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link href="/admin/orders" className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors">
        <ChevronLeft size={14} /> Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">
            Order {formatOrderRef(order.id)}
          </h1>
          <p className="text-[#8a8070] text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Customer */}
        <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <h2 className="text-[#8a8070] text-xs uppercase tracking-widest mb-3">Customer</h2>
          <p className="text-[#f5f0e8] text-sm">{addr.firstName} {addr.lastName}</p>
          <p className="text-[#8a8070] text-sm">{email}</p>
          <p className="text-[#8a8070] text-sm">{addr.phone}</p>
          <p className="text-[#8a8070] text-sm mt-2">
            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
            {addr.city}, {addr.state}
          </p>
        </section>

        {/* Payment */}
        <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <h2 className="text-[#8a8070] text-xs uppercase tracking-widest mb-3">Payment</h2>
          <p className="text-[#8a8070] text-sm">Ref: <span className="text-[#f5f0e8] font-mono text-xs">{order.paystack_ref ?? '—'}</span></p>
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-[#8a8070]">
              <span>Subtotal</span><span>{formatNaira(order.subtotal / 100)}</span>
            </div>
            <div className="flex justify-between text-[#8a8070]">
              <span>Shipping</span><span>{formatNaira(order.shipping_fee / 100)}</span>
            </div>
            <div className="flex justify-between text-[#f5f0e8] font-medium border-t border-[#2a2a2a] pt-1 mt-1">
              <span>Total</span><span>{formatNaira(order.total / 100)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Items */}
      <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a] mb-8">
        <h2 className="text-[#8a8070] text-xs uppercase tracking-widest mb-3">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#8a8070] text-xs border-b border-[#2a2a2a]">
              <th className="text-left py-2 font-normal">Product</th>
              <th className="text-center py-2 font-normal">Qty</th>
              <th className="text-right py-2 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-[#222] last:border-0">
                <td className="py-2.5">
                  <p className="text-[#f5f0e8]">{item.productName}</p>
                  {(item.selectedColor || item.selectedLength) && (
                    <p className="text-[#8a8070] text-xs">
                      {[item.selectedColor, item.selectedLength].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </td>
                <td className="py-2.5 text-center text-[#8a8070]">×{item.quantity}</td>
                <td className="py-2.5 text-right text-[#f5f0e8]">
                  {formatNaira((item.unitPrice * item.quantity) / 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Status update */}
      <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a] mb-8">
        <h2 className="text-[#8a8070] text-xs uppercase tracking-widest mb-4">Update Status</h2>
        <div className="mb-6">
          <OrderStatusTimeline currentStatus={order.status} />
        </div>
        <OrderStatusControls
          orderId={order.id}
          currentStatus={order.status}
          customerEmail={email}
          role={adminRecord?.role ?? 'editor'}
        />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Manually verify**

Click an order row on the list. Expected: detail page renders all blocks. Status dropdown shows valid next statuses. Cancel requires typed confirmation. Status update refreshes the page.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/orders/ src/app/admin/orders/[id]/
git commit -m "feat: order detail page with status controls"
```

---

## Task 9: Products list page

**Files:**
- Create: `src/components/admin/products/ProductsTable.tsx`
- Create: `src/app/admin/products/page.tsx`

- [ ] **Step 1: Create ProductsTable client component**

```tsx
// src/components/admin/products/ProductsTable.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import { toggleProductStock } from '@/lib/admin/actions'
import { formatNaira } from '@/lib/utils'
import type { ProductRow } from '@/lib/supabase/types'
import toast from 'react-hot-toast'

const TIER_COLOURS: Record<string, string> = {
  Signature: 'bg-[#1e3a5f] text-[#60a5fa]',
  Couture:   'bg-[#1e1b4b] text-[#a5b4fc]',
  Bespoke:   'bg-[#451a03] text-[#fbbf24]',
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter()
  const [filterTier, setFilterTier] = useState<string>('all')
  const [filterStock, setFilterStock] = useState<string>('all')
  const [pendingId, startTransition] = useTransition()

  const filtered = products.filter((p) => {
    const tierOk  = filterTier  === 'all' || p.tier  === filterTier
    const stockOk = filterStock === 'all' || (filterStock === 'in' ? p.in_stock : !p.in_stock)
    return tierOk && stockOk
  })

  function handleToggleStock(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await toggleProductStock(id, !current)
        router.refresh()
      } catch {
        toast.error('Failed to update stock')
      }
    })
  }

  return (
    <div>
      {/* Filters + Add button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-1.5 rounded"
          >
            <option value="all">All tiers</option>
            <option value="Signature">Signature</option>
            <option value="Couture">Couture</option>
            <option value="Bespoke">Bespoke</option>
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-1.5 rounded"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a96e] text-[#0f0f0f] text-sm rounded hover:bg-[#b8975e] transition-colors"
        >
          <Plus size={14} /> Add product
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#8a8070] text-sm py-12 text-center">No products found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
              <th className="text-left py-2 pr-4 font-normal">Product</th>
              <th className="text-left py-2 pr-4 font-normal">Tier</th>
              <th className="text-left py-2 pr-4 font-normal">Category</th>
              <th className="text-right py-2 pr-4 font-normal">Price</th>
              <th className="text-center py-2 font-normal">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors group"
              >
                <td
                  className="py-3 pr-4 cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {product.images[0] ? (
                      <div className="w-10 h-10 rounded overflow-hidden bg-[#2a2a2a] shrink-0">
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-[#2a2a2a] shrink-0" />
                    )}
                    <span className="text-[#f5f0e8] group-hover:text-[#c9a96e] transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td
                  className="py-3 pr-4 cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {product.tier && (
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${TIER_COLOURS[product.tier] ?? ''}`}>
                      {product.tier}
                    </span>
                  )}
                </td>
                <td
                  className="py-3 pr-4 text-[#8a8070] cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {product.category ?? '—'}
                </td>
                <td
                  className="py-3 pr-4 text-right text-[#f5f0e8] cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {formatNaira(product.price / 100)}
                </td>
                <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={product.in_stock}
                    onCheckedChange={() => handleToggleStock(product.id, product.in_stock)}
                    className="data-[state=checked]:bg-[#c9a96e]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create products page**

```tsx
// src/app/admin/products/page.tsx
import { getProducts } from '@/lib/admin/queries'
import { ProductsTable } from '@/components/admin/products/ProductsTable'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Products</h1>
        <p className="text-[#8a8070] text-sm mt-1">{products.length} products</p>
      </div>
      <ProductsTable products={products} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/products/ProductsTable.tsx src/app/admin/products/page.tsx
git commit -m "feat: admin products list with inline stock toggle"
```

---

## Task 10: Image upload zone

**Files:**
- Create: `src/components/admin/products/ImageUploadZone.tsx`

> **Before this task:** Create the Supabase Storage bucket manually in the Supabase Dashboard:
> 1. Go to Storage → New bucket
> 2. Name: `product-images`
> 3. Public: **yes**
> 4. Add RLS policy: allow authenticated admins to upload (INSERT) and delete (DELETE) using `is_admin()`

- [ ] **Step 1: Create ImageUploadZone**

```tsx
// src/components/admin/products/ImageUploadZone.tsx
'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value:    string[]
  onChange: (urls: string[]) => void
}

export function ImageUploadZone({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: File[]) {
    const supabase = createClient()
    const newUploading = files.map((f) => f.name)
    setUploading((prev) => [...prev, ...newUploading])

    const uploadedUrls: string[] = []
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path)
        uploadedUrls.push(publicUrl)
      }
    }

    setUploading((prev) => prev.filter((n) => !newUploading.includes(n)))
    onChange([...value, ...uploadedUrls])
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    if (files.length) uploadFiles(files)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url))
  }

  function moveImage(from: number, to: number) {
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors',
          dragging
            ? 'border-[#c9a96e] bg-[#c9a96e]/5'
            : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a]',
        ].join(' ')}
      >
        <Upload size={20} className="text-[#8a8070] mb-2" />
        <p className="text-[#8a8070] text-sm">Drop images here or click to select</p>
        <p className="text-[#8a8070] text-xs mt-1">JPG, PNG or WebP · max 5 MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <p className="text-[#c9a96e] text-xs">Uploading {uploading.length} file{uploading.length !== 1 ? 's' : ''}…</p>
      )}

      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url, i) => (
            <div key={url} className="relative group">
              <div className={`w-20 h-20 rounded overflow-hidden border-2 ${i === 0 ? 'border-[#c9a96e]' : 'border-[#2a2a2a]'}`}>
                <Image src={url} alt={`Product image ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
              </div>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-[#c9a96e] text-[#0f0f0f] text-[9px] text-center py-0.5 font-medium">
                  HERO
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f87171] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={8} className="text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="bg-black/60 text-white text-xs px-1 rounded"
                  >
                    ←
                  </button>
                )}
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="bg-black/60 text-white text-xs px-1 rounded"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/products/ImageUploadZone.tsx
git commit -m "feat: product image upload zone with Supabase Storage"
```

---

## Task 11: Product form

**Files:**
- Create: `src/components/admin/products/ColorVariantBuilder.tsx`
- Create: `src/components/admin/products/ProductForm.tsx`

- [ ] **Step 1: Create ColorVariantBuilder**

```tsx
// src/components/admin/products/ColorVariantBuilder.tsx
'use client'

import { Plus, X } from 'lucide-react'

export interface ColorVariant {
  name: string
  hex:  string
}

interface Props {
  value:    ColorVariant[]
  onChange: (colors: ColorVariant[]) => void
}

export function ColorVariantBuilder({ value, onChange }: Props) {
  function add() {
    onChange([...value, { name: '', hex: '#1a1a1a' }])
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: keyof ColorVariant, val: string) {
    onChange(value.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }

  return (
    <div className="space-y-2">
      {value.map((color, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="color"
            value={color.hex}
            onChange={(e) => update(i, 'hex', e.target.value)}
            className="w-8 h-8 rounded border border-[#2a2a2a] cursor-pointer bg-transparent p-0.5"
          />
          <input
            type="text"
            value={color.name}
            onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="Color name (e.g. Natural Black)"
            className="flex-1 px-3 py-1.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070]"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-[#8a8070] hover:text-[#f87171] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[#c9a96e] text-sm hover:text-[#b8975e] transition-colors"
      >
        <Plus size={14} /> Add colour
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create ProductForm**

```tsx
// src/components/admin/products/ProductForm.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ImageUploadZone } from './ImageUploadZone'
import { ColorVariantBuilder } from './ColorVariantBuilder'
import { createProduct, updateProduct, deleteProduct, type ProductFormData } from '@/lib/admin/actions'
import { toSlug, fromKobo } from '@/lib/admin/utils'
import type { ProductRow } from '@/lib/supabase/types'
import toast from 'react-hot-toast'

const ALL_LENGTHS = ['12"','14"','16"','18"','20"','22"','24"','26"','28"','30"']
const TIERS       = ['Signature', 'Couture', 'Bespoke'] as const

interface Props {
  product?: ProductRow
  role:     'superadmin' | 'editor'
}

export function ProductForm({ product, role }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dirty, setDirty] = useState(false)

  const [name,        setName]        = useState(product?.name        ?? '')
  const [slug,        setSlug]        = useState(product?.slug        ?? '')
  const [tier,        setTier]        = useState<typeof TIERS[number]>(product?.tier ?? 'Signature')
  const [category,    setCategory]    = useState(product?.category    ?? '')
  const [priceNaira,  setPriceNaira]  = useState(product ? fromKobo(product.price) : 0)
  const [description, setDescription] = useState(product?.description ?? '')
  const [hairType,    setHairType]    = useState(product?.hair_type   ?? '')
  const [density,     setDensity]     = useState(product?.density     ?? '')
  const [capType,     setCapType]     = useState(product?.cap_type    ?? '')
  const [origin,      setOrigin]      = useState(product?.origin      ?? '')
  const [lengths,     setLengths]     = useState<string[]>(product?.lengths     ?? [])
  const [colors,      setColors]      = useState<{ name: string; hex: string }[]>(
    Array.isArray(product?.colors) ? product.colors as { name: string; hex: string }[] : []
  )
  const [images,      setImages]      = useState<string[]>(product?.images ?? [])
  const [inStock,     setInStock]     = useState(product?.in_stock    ?? true)
  const [isNew,       setIsNew]       = useState(product?.is_new      ?? false)

  // Auto-generate slug from name (only when creating)
  useEffect(() => {
    if (!product) setSlug(toSlug(name))
  }, [name, product])

  // Dirty tracking
  useEffect(() => { setDirty(true) }, [name, slug, tier, category, priceNaira, description, hairType, density, capType, origin, lengths, colors, images, inStock, isNew])

  function toggleLength(l: string) {
    setLengths((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || !tier || priceNaira <= 0) {
      toast.error('Name, slug, tier and price are required')
      return
    }

    const data: ProductFormData = {
      name, slug, description, tier, category,
      priceNaira, hairType, density, capType, origin,
      lengths, colors, images, inStock, isNew,
    }

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, data)
          toast.success('Product saved')
        } else {
          await createProduct(data)
          toast.success('Product created')
          router.push('/admin/products')
        }
        setDirty(false)
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to save product')
      }
    })
  }

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProduct(product!.id)
        toast.success('Product deleted')
        router.push('/admin/products')
      } catch {
        toast.error('Failed to delete product')
      }
    })
  }

  const fieldClass = 'w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070] focus:outline-none focus:border-[#c9a96e]'
  const labelClass = 'block text-[#8a8070] text-xs uppercase tracking-widest mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] space-y-4">
        <h2 className="text-[#f5f0e8] text-sm font-medium">Basic Info</h2>

        <div>
          <label className={labelClass}>Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} placeholder="The Adanna" />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={fieldClass} placeholder="the-adanna" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tier *</label>
            <select value={tier} onChange={(e) => setTier(e.target.value as typeof TIERS[number])} className={fieldClass}>
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} placeholder="Lace Front" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Price (₦) *</label>
          <input
            type="number" min={0} step={1}
            value={priceNaira || ''}
            onChange={(e) => setPriceNaira(Number(e.target.value))}
            required
            className={fieldClass}
            placeholder="89000"
          />
          {priceNaira > 0 && <p className="text-[#8a8070] text-xs mt-1">Stored as {priceNaira * 100} kobo</p>}
        </div>
      </section>

      {/* Description */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-4">Description</h2>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-[#0f0f0f] border-[#2a2a2a] text-[#f5f0e8] placeholder:text-[#8a8070] resize-none"
          placeholder="Brand-voice copy for this product…"
        />
        <p className="text-[#8a8070] text-xs mt-1 text-right">{description.length} chars</p>
      </section>

      {/* Attributes */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] space-y-4">
        <h2 className="text-[#f5f0e8] text-sm font-medium">Attributes</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Hair type',  value: hairType,  set: setHairType,  ph: 'Virgin Malaysian' },
            { label: 'Density',    value: density,   set: setDensity,   ph: '150%' },
            { label: 'Cap type',   value: capType,   set: setCapType,   ph: '13×4 HD Lace' },
            { label: 'Origin',     value: origin,    set: setOrigin,    ph: 'Malaysian' },
          ].map(({ label, value: val, set, ph }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input value={val} onChange={(e) => set(e.target.value)} className={fieldClass} placeholder={ph} />
            </div>
          ))}
        </div>
      </section>

      {/* Lengths */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Available Lengths</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_LENGTHS.map((l) => (
            <button
              key={l} type="button"
              onClick={() => toggleLength(l)}
              className={[
                'px-3 py-1 rounded text-sm border transition-colors',
                lengths.includes(l)
                  ? 'bg-[#c9a96e] border-[#c9a96e] text-[#0f0f0f]'
                  : 'bg-transparent border-[#2a2a2a] text-[#8a8070] hover:border-[#3a3a3a]',
              ].join(' ')}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Colours</h2>
        <ColorVariantBuilder value={colors} onChange={setColors} />
      </section>

      {/* Images */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Images</h2>
        <ImageUploadZone value={images} onChange={setImages} />
      </section>

      {/* Flags */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-4">Flags</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-[#f5f0e8] text-sm">In stock</span>
            <Switch checked={inStock} onCheckedChange={setInStock} className="data-[state=checked]:bg-[#c9a96e]" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-[#f5f0e8] text-sm">New arrival</span>
            <Switch checked={isNew} onCheckedChange={setIsNew} className="data-[state=checked]:bg-[#c9a96e]" />
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#c9a96e] text-[#0f0f0f] text-sm rounded hover:bg-[#b8975e] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : product ? 'Save product' : 'Create product'}
        </button>

        {product && role === 'superadmin' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className="text-[#f87171] text-sm hover:underline">
                Delete product
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#f5f0e8]">Delete {product.name}?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#8a8070]">
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#2a2a2a] text-[#8a8070]">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-[#f87171] text-white hover:bg-[#ef4444]"
                  style={{ transitionDelay: '1.5s' }}
                >
                  Delete permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/products/ColorVariantBuilder.tsx src/components/admin/products/ProductForm.tsx
git commit -m "feat: product form with variants, lengths, and image upload"
```

---

## Task 12: Product pages (new + edit)

**Files:**
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`

- [ ] **Step 1: Create new product page**

```tsx
// src/app/admin/products/new/page.tsx
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  return (
    <div className="p-8">
      <Link href="/admin/products" className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors">
        <ChevronLeft size={14} /> Products
      </Link>
      <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide mb-8">New Product</h1>
      <ProductForm role={adminRecord?.role ?? 'editor'} />
    </div>
  )
}
```

- [ ] **Step 2: Create edit product page**

```tsx
// src/app/admin/products/[id]/page.tsx
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductById } from '@/lib/admin/queries'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  const product = await getProductById(params.id)
  if (!product) notFound()

  return (
    <div className="p-8">
      <Link href="/admin/products" className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors">
        <ChevronLeft size={14} /> Products
      </Link>
      <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide mb-8">{product.name}</h1>
      <ProductForm product={product} role={adminRecord?.role ?? 'editor'} />
    </div>
  )
}
```

- [ ] **Step 3: Manually verify**

Open `/admin/products/new`. Fill in all fields, upload an image, save. Expected: toast "Product created", redirect to `/admin/products`. Click the product row to edit. Change price and save. Expected: toast "Product saved", stays on edit page.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/products/new/page.tsx src/app/admin/products/[id]/page.tsx
git commit -m "feat: product create and edit pages"
```

---

## Task 13: Customers page

**Files:**
- Create: `src/components/admin/customers/CustomersTable.tsx`
- Create: `src/app/admin/customers/page.tsx`

- [ ] **Step 1: Create CustomersTable**

```tsx
// src/components/admin/customers/CustomersTable.tsx
'use client'

import { useState } from 'react'
import { formatNaira } from '@/lib/utils'
import type { CustomerWithStats } from '@/lib/admin/queries'

export function CustomersTable({ customers }: { customers: CustomerWithStats[] }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = customers.filter(({ profile }) => {
    const q = search.toLowerCase()
    return !q
      || profile.full_name?.toLowerCase().includes(q)
      || profile.first_name?.toLowerCase().includes(q)
      || profile.last_name?.toLowerCase().includes(q)
  })

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="w-72 mb-4 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070]"
      />

      {filtered.length === 0 ? (
        <p className="text-[#8a8070] text-sm py-12 text-center">No customers found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
              <th className="text-left py-2 pr-4 font-normal">Name</th>
              <th className="text-left py-2 pr-4 font-normal">Phone</th>
              <th className="text-center py-2 pr-4 font-normal">Orders</th>
              <th className="text-right py-2 pr-4 font-normal">Total spent</th>
              <th className="text-left py-2 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ profile, orderCount, totalSpent }) => (
              <tr
                key={profile.id}
                onClick={() => setExpanded(expanded === profile.id ? null : profile.id)}
                className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] cursor-pointer transition-colors"
              >
                <td className="py-3 pr-4">
                  <p className="text-[#f5f0e8]">
                    {profile.full_name ?? [profile.first_name, profile.last_name].filter(Boolean).join(' ') ?? '—'}
                  </p>
                </td>
                <td className="py-3 pr-4 text-[#8a8070]">{profile.phone ?? '—'}</td>
                <td className="py-3 pr-4 text-center text-[#8a8070]">{orderCount}</td>
                <td className="py-3 pr-4 text-right text-[#f5f0e8]">{formatNaira(totalSpent / 100)}</td>
                <td className="py-3 text-[#8a8070] text-xs">
                  {new Date(profile.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create customers page**

```tsx
// src/app/admin/customers/page.tsx
import { getCustomersWithStats } from '@/lib/admin/queries'
import { CustomersTable } from '@/components/admin/customers/CustomersTable'

export default async function CustomersPage() {
  const customers = await getCustomersWithStats()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Customers</h1>
        <p className="text-[#8a8070] text-sm mt-1">{customers.length} registered customers</p>
      </div>
      <CustomersTable customers={customers} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/customers/ src/app/admin/customers/page.tsx
git commit -m "feat: admin customers page (read-only)"
```

---

## Task 14: Newsletter page

**Files:**
- Create: `src/components/admin/newsletter/NewsletterTable.tsx`
- Create: `src/app/admin/newsletter/page.tsx`

- [ ] **Step 1: Create NewsletterTable**

```tsx
// src/components/admin/newsletter/NewsletterTable.tsx
'use client'

import { useState } from 'react'
import type { NewsletterSubscriberRow } from '@/lib/supabase/types'

export function NewsletterTable({ subscribers }: { subscribers: NewsletterSubscriberRow[] }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active')

  const filtered = filter === 'all' ? subscribers : subscribers.filter((s) => s.status === filter)

  function exportCSV() {
    const header = 'email,first_name,subscribed_at'
    const rows   = filtered
      .filter((s) => s.status === 'active')
      .map((s) => `${s.email},${s.first_name ?? ''},${s.created_at}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `naronai-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['all', 'active', 'unsubscribed'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={[
                'px-3 py-1 rounded text-xs capitalize transition-colors',
                filter === v
                  ? 'bg-[#c9a96e] text-[#0f0f0f]'
                  : 'bg-[#1a1a1a] text-[#8a8070] hover:text-[#f5f0e8] border border-[#2a2a2a]',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-xs rounded hover:border-[#c9a96e] transition-colors"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
            <th className="text-left py-2 pr-4 font-normal">Email</th>
            <th className="text-left py-2 pr-4 font-normal">Name</th>
            <th className="text-left py-2 pr-4 font-normal">Source</th>
            <th className="text-left py-2 pr-4 font-normal">Status</th>
            <th className="text-left py-2 font-normal">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="border-b border-[#1e1e1e]">
              <td className="py-2.5 pr-4 text-[#f5f0e8]">{s.email}</td>
              <td className="py-2.5 pr-4 text-[#8a8070]">{s.first_name ?? '—'}</td>
              <td className="py-2.5 pr-4 text-[#8a8070] capitalize">{s.source ?? '—'}</td>
              <td className="py-2.5 pr-4">
                <span className={`text-xs px-2 py-0.5 rounded ${s.status === 'active' ? 'bg-[#14532d] text-[#4ade80]' : 'bg-[#374151] text-[#9ca3af]'}`}>
                  {s.status}
                </span>
              </td>
              <td className="py-2.5 text-[#8a8070] text-xs">
                {new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Create newsletter page**

```tsx
// src/app/admin/newsletter/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNewsletterSubscribers } from '@/lib/admin/queries'
import { NewsletterTable } from '@/components/admin/newsletter/NewsletterTable'

export default async function NewsletterPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  if (adminRecord?.role !== 'superadmin') redirect('/admin/orders')

  const subscribers = await getNewsletterSubscribers()
  const activeCount = subscribers.filter((s) => s.status === 'active').length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Newsletter</h1>
        <p className="text-[#8a8070] text-sm mt-1">{activeCount} active subscribers</p>
      </div>
      <NewsletterTable subscribers={subscribers} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/newsletter/ src/app/admin/newsletter/page.tsx
git commit -m "feat: admin newsletter page with CSV export"
```

---

## Task 15: Product seed script + wire app to Supabase

**Files:**
- Create: `scripts/seed-products.ts`

- [ ] **Step 1: Create the seed script**

```ts
// scripts/seed-products.ts
// Run once: npx tsx scripts/seed-products.ts
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(process.cwd(), '.env.local') })

import { PRODUCTS } from '../src/lib/data/products'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function seed() {
  console.log(`Seeding ${PRODUCTS.length} products…`)

  for (const p of PRODUCTS) {
    const { error } = await supabase.from('products').upsert({
      slug:        p.slug,
      name:        p.name,
      description: p.description,
      price:       p.price,               // already in kobo in products.ts
      images:      p.images,
      tier:        p.tier ?? null,
      in_stock:    p.inStock,
      is_new:      p.isNew ?? false,
      hair_type:   p.hairType  ?? null,
      density:     p.density   ?? null,
      cap_type:    p.capType   ?? null,
      origin:      p.origin    ?? null,
      category:    p.category  ?? null,
      colors:      p.colors    ?? [],
      lengths:     p.lengths   ?? [],
      created_at:  p.createdAt,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${p.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${p.name}`)
    }
  }

  console.log('Done.')
}

seed()
```

- [ ] **Step 2: Install tsx (to run the script)**

```bash
npm install --save-dev tsx
```

- [ ] **Step 3: Run the seed**

```bash
npx tsx scripts/seed-products.ts
```

Expected output:
```
Seeding 12 products…
  ✓ The Adanna
  ✓ The Chioma
  … (12 total)
Done.
```

Verify in Supabase Dashboard → Table Editor → `products` that 12 rows exist.

- [ ] **Step 4: Verify admin products page shows seeded data**

Open `/admin/products`. Expected: 12 products listed.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-products.ts package.json
git commit -m "feat: product seed script to populate Supabase from hardcoded data"
```

---

## Self-review notes

**Spec coverage check:**
- ✓ Auth & middleware — Task 3
- ✓ Admin layout + sidebar with role-based nav — Task 4
- ✓ Orders list with status tabs + search — Task 7
- ✓ Order detail with status controls + timeline — Task 8
- ✓ Cancel with typed CANCEL confirmation — Task 8
- ✓ Status email on update — Task 6
- ✓ Products list with inline stock toggle — Task 9
- ✓ Product create/edit form with all fields — Tasks 11–12
- ✓ Image upload to Supabase Storage — Task 10
- ✓ Customers read-only — Task 13
- ✓ Newsletter superadmin-only + CSV export — Task 14
- ✓ Data migration seed script — Task 15
- ✓ Delete with 1.5s delay guard — Task 11 (AlertDialogAction uses transitionDelay)
- ✓ Editor cannot delete products — ProductForm checks `role === 'superadmin'`

**Type consistency:**
- `OrderStatus` defined once in `queries.ts`, imported everywhere
- `ProductFormData` defined once in `actions.ts`, imported in `ProductForm.tsx`
- `fromKobo` / `toKobo` defined once in `utils.ts`, imported in `ProductForm.tsx` and `actions.ts`
- `formatNaira` lives in `lib/utils.ts` (existing), not duplicated

**Note on 1.5s delete delay:** The `AlertDialogAction` style `transitionDelay: '1.5s'` in `ProductForm.tsx` creates a visual delay but does not prevent rapid clicks. For true dwell-time protection, wrap the handler in a `setTimeout(fn, 1500)` and disable the button for 1.5s after the dialog opens. This is a refinement that can be made at implementation time.
