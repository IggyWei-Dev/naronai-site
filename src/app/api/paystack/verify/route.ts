import { NextRequest, NextResponse } from 'next/server'
import { verifyTransaction } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/resend'
import type { Order } from '@/types'

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 })

  try {
    const payment = await verifyTransaction(reference)

    if (payment.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful', status: payment.status }, { status: 402 })
    }

    const supabase = createAdminClient()

    // Fetch order
    const { data: order, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .eq('paystack_ref', reference)
      .single()

    if (fetchErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Idempotency — if already paid, return success
    if (order.status === 'paid') {
      return NextResponse.json({ success: true, orderId: order.id })
    }

    // Mark as paid
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (updateErr) throw updateErr

    // Send confirmation email
    const email = order.guest_email ?? payment.customer.email
    await sendOrderConfirmation(order as Order, email)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('[paystack/verify]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
