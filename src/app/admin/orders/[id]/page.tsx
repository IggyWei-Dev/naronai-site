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
  const email = addr?.email ?? order.guest_email

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors"
      >
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
          <p className="text-[#f5f0e8] text-sm">{addr?.firstName} {addr?.lastName}</p>
          <p className="text-[#8a8070] text-sm">{email}</p>
          <p className="text-[#8a8070] text-sm">{addr?.phone}</p>
          <p className="text-[#8a8070] text-sm mt-2">
            {addr?.line1}{addr?.line2 ? `, ${addr.line2}` : ''}<br />
            {addr?.city}, {addr?.state}
          </p>
        </section>

        {/* Payment */}
        <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <h2 className="text-[#8a8070] text-xs uppercase tracking-widest mb-3">Payment</h2>
          <p className="text-[#8a8070] text-sm">
            Ref: <span className="text-[#f5f0e8] font-mono text-xs">{order.paystack_ref ?? '—'}</span>
          </p>
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
      <section className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
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
