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
