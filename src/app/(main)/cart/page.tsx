'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore }        from '@/lib/store/cartStore'
import { Button }              from '@/components/ui/Button'
import { SectionDivider }      from '@/components/ui/SectionDivider'
import { formatNaira }         from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCartStore()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '96px 24px' }}>
        <p className="text-h2" style={{ color: 'var(--color-text-muted)' }}>Your cart is empty</p>
        <Button variant="ghost" onClick={() => {}}>
          <Link href="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  const subtotal   = total()
  const shippingFee = subtotal >= 15_000_000 ? 0 : 300_000
  const orderTotal = subtotal + shippingFee

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 64px 96px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '64px', alignItems: 'start' }}>

      {/* Cart items */}
      <div>
        <h1 className="text-h1" style={{ marginBottom: '40px' }}>
          Your Cart <span style={{ color: 'var(--color-text-muted)', fontSize: '60%' }}>({itemCount()} {itemCount() === 1 ? 'item' : 'items'})</span>
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedLength}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr auto',
                gap: '20px',
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: '0.5px solid var(--color-border-subtle)',
              }}
            >
              {/* Image */}
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                {item.product.images[0]
                  ? <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ background: 'var(--color-bg-surface)', width: '100%', height: '100%' }} />
                }
              </div>

              {/* Info */}
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '4px' }}>{item.product.name}</p>
                {item.selectedColor  && <p className="text-caption">{item.selectedColor}</p>}
                {item.selectedLength && <p className="text-caption">{item.selectedLength}</p>}
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-accent-gold)', marginTop: '8px' }}>
                  {formatNaira(item.product.price)}
                </p>
              </div>

              {/* Qty + remove */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '0.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1, item.selectedColor, item.selectedLength)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1, item.selectedColor, item.selectedLength)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedLength)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div style={{ background: 'var(--color-bg-card)', border: '0.5px solid var(--color-border-medium)', borderRadius: 'var(--radius-xl)', padding: '32px', position: 'sticky', top: '100px' }}>
        <h2 className="text-h3" style={{ marginBottom: '24px' }}>Order Summary</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <Row label="Subtotal"     value={formatNaira(subtotal)} />
          <Row label="Shipping"     value={shippingFee === 0 ? 'Free' : formatNaira(shippingFee)} />
        </div>

        <SectionDivider />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-accent-gold)' }}>{formatNaira(orderTotal)}</span>
        </div>

        <Link href="/checkout" style={{ display: 'block' }}>
          <Button variant="primary" className="w-full">Proceed to Checkout</Button>
        </Link>

        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '16px' }}>
          Free shipping on orders over ₦150,000
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}
