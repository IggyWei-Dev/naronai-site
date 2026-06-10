'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendOrderStatusUpdate } from '@/lib/resend'
import type { OrderStatus } from './queries'
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

  if (customerEmail && ['processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
    await sendOrderStatusUpdate(customerEmail, orderId, newStatus).catch(() => {})
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

// ── Products ──────────────────────────────────────────────

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
  stockCount:  number
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
    hair_type:   data.hairType  || null,
    density:     data.density   || null,
    cap_type:    data.capType   || null,
    origin:      data.origin    || null,
    lengths:     data.lengths,
    colors:      data.colors,
    images:      data.images,
    in_stock:    data.inStock,
    stock_count: data.stockCount,
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
    hair_type:   data.hairType  || null,
    density:     data.density   || null,
    cap_type:    data.capType   || null,
    origin:      data.origin    || null,
    lengths:     data.lengths,
    colors:      data.colors,
    images:      data.images,
    in_stock:    data.inStock,
    stock_count: data.stockCount,
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

// ── Checkout stock decrement ──────────────────────────────
// Atomic: Postgres serialises concurrent UPDATEs so two buyers
// racing for the last unit both hit the WHERE guard; only one wins.
// Returns { success: false } if out of stock — caller must abort checkout.
export async function decrementStock(
  productId: string,
  qty: number = 1,
): Promise<{ success: boolean; remaining: number }> {
  const supabase = createClient()
  const { data, error } = await supabase
    .rpc('decrement_stock', { p_id: productId, p_qty: qty })
  if (error) throw new Error(error.message)
  return data as { success: boolean; remaining: number }
}
