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
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a]">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#f5f0e8]">
              All <span className="ml-1.5 text-[#8a8070]">{orders.length}</span>
            </TabsTrigger>
            {STATUS_TABS.slice(1).map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="text-xs data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#f5f0e8]">
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
