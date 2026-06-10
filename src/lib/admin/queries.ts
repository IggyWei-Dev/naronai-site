import { createClient } from '@/lib/supabase/server'
import type { OrderRow, ProductRow, ProfileRow, NewsletterSubscriberRow } from '@/lib/supabase/types'

// ── Shared types ───────────────────────────────────────────

export type OrderStatus = OrderRow['status']

export interface OrderItem {
  productId:       string
  productName:     string
  selectedColor?:  string
  selectedLength?: string
  quantity:        number
  unitPrice:       number
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
