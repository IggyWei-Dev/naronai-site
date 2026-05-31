import { NextRequest, NextResponse } from 'next/server'
import { initializeTransaction, generateReference } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/server'
import type { CartItem, Address } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { items, shippingAddress, email }: {
      items:           CartItem[]
      shippingAddress: Address
      email:           string
    } = await req.json()

    if (!items?.length || !email || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subtotal   = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const shippingFee = subtotal >= 150_000_00 ? 0 : 3_000_00  // free over ₦150k (stored in kobo)
    const total      = subtotal + shippingFee
    const reference  = generateReference()

    // Create pending order in Supabase
    const supabase = createAdminClient()
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        guest_email:      email,
        items:            JSON.stringify(items),
        subtotal,
        shipping_fee:     shippingFee,
        total,
        status:           'pending',
        paystack_ref:     reference,
        shipping_address: shippingAddress,
      })
      .select()
      .single()

    if (error) throw error

    const { authorization_url } = await initializeTransaction({
      email,
      amountKobo:  total,
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/confirm?ref=${reference}`,
      metadata:    { order_id: order.id, items_count: items.length },
    })

    return NextResponse.json({ url: authorization_url, reference, orderId: order.id })
  } catch (err) {
    console.error('[paystack/initialize]', err)
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
  }
}
