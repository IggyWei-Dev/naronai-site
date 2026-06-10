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

const ALL_STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

interface Props {
  orderId:       string
  currentStatus: OrderStatus
  customerEmail: string | null
  role:          'superadmin' | 'editor'
}

export function OrderStatusControls({ orderId, currentStatus, customerEmail, role }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected]      = useState<OrderStatus | ''>('')
  const [cancelInput, setCancelInput] = useState('')

  const validStatuses = role === 'superadmin'
    ? ALL_STATUSES.filter((s) => s !== currentStatus)
    : FORWARD_STATUSES[currentStatus]

  if (validStatuses.length === 0) {
    return <p className="text-[#8a8070] text-sm">No further status updates available.</p>
  }

  function handleUpdate() {
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
            {validStatuses.filter((s) => s !== 'cancelled').map((s) => (
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
                This will notify the customer. Type{' '}
                <strong className="text-[#f5f0e8]">CANCEL</strong> to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <input
              value={cancelInput}
              onChange={(e) => setCancelInput(e.target.value)}
              placeholder="Type CANCEL"
              className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-transparent border-[#2a2a2a] text-[#8a8070]"
                onClick={() => setCancelInput('')}
              >
                Back
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={cancelInput !== 'CANCEL' || isPending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await updateOrderStatus(orderId, 'cancelled', customerEmail)
                      toast.success('Order cancelled')
                      setCancelInput('')
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
