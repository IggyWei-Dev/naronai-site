'use client'

import { useState } from 'react'
import { ChevronDown, Package } from 'lucide-react'
import type { OrderRow, Json } from '@/lib/supabase/types'

interface OrdersSectionProps {
  orders: OrderRow[]
}

type OrderStatus = OrderRow['status']

interface OrderItem {
  name: string
  quantity: number
  price: number
}

function formatNaira(kobo: number) {
  return '₦' + (kobo / 100).toLocaleString('en-NG')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function statusLabel(status: OrderStatus): string {
  return { pending: 'Pending', paid: 'Paid', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }[status]
}

function statusColor(status: OrderStatus): string {
  return {
    pending:    'color-mix(in srgb, var(--color-text-muted) 18%, transparent)',
    paid:       'color-mix(in srgb, var(--color-gold) 18%, transparent)',
    processing: 'color-mix(in srgb, var(--color-gold) 18%, transparent)',
    shipped:    'color-mix(in srgb, var(--color-primary) 15%, transparent)',
    delivered:  'color-mix(in srgb, var(--color-success) 15%, transparent)',
    cancelled:  'color-mix(in srgb, var(--color-error) 12%, transparent)',
  }[status]
}

function statusTextColor(status: OrderStatus): string {
  return {
    pending:    'var(--color-text-muted)',
    paid:       'var(--color-gold)',
    processing: 'var(--color-gold)',
    shipped:    'var(--color-primary)',
    delivered:  'var(--color-success)',
    cancelled:  'var(--color-error)',
  }[status]
}

function parseItems(items: Json): OrderItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item: Json) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      const obj = item as Record<string, Json>
      return {
        name:     String(obj.name ?? 'Item'),
        quantity: Number(obj.quantity ?? 1),
        price:    Number(obj.price ?? 0),
      }
    }
    return { name: 'Item', quantity: 1, price: 0 }
  })
}

function OrderRow({ order }: { order: OrderRow }) {
  const [open, setOpen] = useState(false)
  const items = parseItems(order.items)

  return (
    <div style={{
      borderBottom: '0.5px solid var(--color-border)',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Order ID */}
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'var(--color-text)',
          minWidth: '88px',
        }}>
          #{order.id.slice(0, 8).toUpperCase()}
        </span>

        {/* Date */}
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-text-sub)',
          flex: 1,
        }}>
          {formatDate(order.created_at)}
        </span>

        {/* Total */}
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text)',
          minWidth: '80px',
          textAlign: 'right',
        }}>
          {formatNaira(order.total)}
        </span>

        {/* Status badge */}
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '8px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: statusTextColor(order.status),
          background: statusColor(order.status),
          padding: '4px 10px',
          borderRadius: '2px',
          minWidth: '72px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {statusLabel(order.status)}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={14}
          style={{
            color: 'var(--color-text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Expanded items */}
      {open && (
        <div style={{
          paddingBottom: '20px',
          paddingLeft: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'color-mix(in srgb, var(--color-gold) 4%, transparent)',
              border: '0.5px solid var(--color-border)',
              borderRadius: '4px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  margin: 0,
                }}>
                  {item.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  margin: '2px 0 0',
                }}>
                  Qty {item.quantity}
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-text-sub)',
              }}>
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}

          {/* Totals row */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            paddingTop: '8px',
            paddingLeft: '4px',
          }}>
            {order.shipping_fee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Shipping
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-sub)' }}>
                  {formatNaira(order.shipping_fee)}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
                Total
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text)', fontWeight: 500 }}>
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function OrdersSection({ orders }: OrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'color-mix(in srgb, var(--color-gold) 8%, transparent)',
          border: '0.5px solid color-mix(in srgb, var(--color-gold) 20%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'color-mix(in srgb, var(--color-gold) 50%, transparent)',
        }}>
          ✦
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 300,
            color: 'var(--color-text)',
            margin: '0 0 8px',
          }}>
            No orders yet
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '280px',
          }}>
            Your orders will appear here once you've made a purchase.
          </p>
        </div>
        <a
          href="/shop"
          style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '12px 28px',
            background: 'var(--color-primary)',
            color: 'var(--color-on-dark)',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Explore the collection
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingBottom: '12px',
        borderBottom: '0.5px solid var(--color-border)',
      }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', minWidth: '88px' }}>
          Order
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', flex: 1 }}>
          Date
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', minWidth: '80px', textAlign: 'right' }}>
          Total
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', minWidth: '72px', textAlign: 'center' }}>
          Status
        </span>
        <span style={{ width: '14px', flexShrink: 0 }} />
      </div>

      {orders.map(order => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  )
}
