import type { OrderStatus } from '@/lib/admin/queries'

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
