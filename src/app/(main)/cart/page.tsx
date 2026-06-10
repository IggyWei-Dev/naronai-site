'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore }        from '@/lib/store/cartStore'
import { Button }              from '@/components/ui/button'
import { SectionDivider }      from '@/components/ui/SectionDivider'
import { formatNaira }         from '@/lib/utils'

const CARD_WIDTH = 380

/* ── Chrome surface ───────────────────────────────────────── */
const chromeCard: React.CSSProperties = {
  width: CARD_WIDTH,
  background: `var(--panel-bg-dark)`,
  border: '0.5px solid color-mix(in srgb, var(--color-gold) 35%, transparent)',
  borderRadius: '16px',
  boxShadow: `
    inset 0 1px 0 color-mix(in srgb, var(--color-gold) 30%, transparent),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    0 32px 80px rgba(0,0,0,0.55),
    0 4px 20px color-mix(in srgb, var(--color-gold) 8%, transparent)
  `,
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
}

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCartStore()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '160px 24px 96px' }}>
        <p className="text-h2" style={{ color: 'var(--color-text-muted)' }}>Your bag is empty</p>
        <Link href="/shop" style={{ textDecoration: 'none' }}>
          <Button variant="ghost">Browse collection</Button>
        </Link>
      </div>
    )
  }

  const subtotal    = total()
  const shippingFee = subtotal >= 150_000 ? 0 : 3_000
  const orderTotal  = subtotal + shippingFee

  return (
    <>
      <style>{`
        @keyframes chrome-sheen {
          0%   { left: -60%; }
          50%  { left: 120%; }
          100% { left: 120%; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes chrome-sheen { 0%, 100% { left: -60%; } }
        }
      `}</style>

      {/* Two-column grid — matches original layout exactly */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '140px 64px 96px',
        display: 'grid',
        gridTemplateColumns: `1fr ${CARD_WIDTH}px`,
        gap: '64px',
        alignItems: 'start',
      }}>

        {/* ── Left: cart items ──────────────────────────────── */}
        <div>
          <h1 className="text-h1" style={{ marginBottom: '40px' }}>
            Your bag{' '}
            <span style={{ color: 'var(--color-text-muted)', fontSize: '60%' }}>
              ({itemCount()} {itemCount() === 1 ? 'item' : 'items'})
            </span>
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '4px', color: 'var(--color-text)' }}>
                    {item.product.name}
                  </p>
                  {item.selectedColor  && <p className="text-caption">{item.selectedColor}</p>}
                  {item.selectedLength && <p className="text-caption">{item.selectedLength}</p>}
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-accent-gold)', marginTop: '8px' }}>
                    {formatNaira(item.product.price)}
                  </p>
                </div>

                {/* Qty + remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '0.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
                    <button type="button" onClick={() => updateQty(item.product.id, item.quantity - 1, item.selectedColor, item.selectedLength)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button type="button" onClick={() => updateQty(item.product.id, item.quantity + 1, item.selectedColor, item.selectedLength)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
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

        {/* ── Right: spacer that reserves grid space ────────── */}
        {/* The actual card is fixed below; this keeps the items column the right width */}
        <div aria-hidden="true" />
      </div>

      {/* ── Chrome card — fixed, vertically centred ─────────── */}
      <div
        className="hidden lg:block"
        style={{
          position: 'fixed',
          top: '50%',
          /* align right edge with the grid's right padding */
          right: 'max(64px, calc((100vw - 1440px) / 2 + 64px))',
          transform: 'translateY(-50%)',
          zIndex: 20,
        }}
      >
        <div style={chromeCard}>
          {/* Animated sheen sweep */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-60%',
            width: '40%',
            height: '100%',
            background: 'linear-gradient(105deg, transparent 0%, color-mix(in srgb, var(--color-gold) 8%, transparent) 50%, transparent 100%)',
            pointerEvents: 'none',
            animation: 'chrome-sheen 7s ease-in-out infinite',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--color-on-dark)',
            margin: '0 0 24px',
          }}>
            Order summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <ChromeRow label="Subtotal" value={formatNaira(subtotal)} />
            <ChromeRow label="Shipping" value={shippingFee === 0 ? 'Free' : formatNaira(shippingFee)} />
          </div>

          <div style={{ height: '0.5px', background: 'color-mix(in srgb, var(--color-gold) 25%, transparent)', margin: '4px 0 20px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-on-dark) 40%, transparent)' }}>
              Total
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--color-gold)', letterSpacing: '-0.01em' }}>
              {formatNaira(orderTotal)}
            </span>
          </div>

          <Link
            href="/checkout"
            style={{
              display: 'block',
              padding: '14px',
              background: 'var(--color-primary)',
              color: 'var(--color-on-dark)',
              borderRadius: '2px',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Proceed to checkout
          </Link>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'color-mix(in srgb, var(--color-on-dark) 30%, transparent)', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 }}>
            Free shipping on orders over ₦150,000
          </p>
        </div>
      </div>

      {/* ── Mobile summary — inline ───────────────────────── */}
      <div
        className="lg:hidden"
        style={{ padding: '0 24px 80px' }}
      >
        <div style={{ background: 'var(--color-bg-card)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, color: 'var(--color-text)', margin: '0 0 20px' }}>
            Order summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <Row label="Subtotal" value={formatNaira(subtotal)} />
            <Row label="Shipping" value={shippingFee === 0 ? 'Free' : formatNaira(shippingFee)} />
          </div>
          <SectionDivider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-accent-gold)' }}>{formatNaira(orderTotal)}</span>
          </div>
          <Link href="/checkout" style={{ display: 'block', padding: '14px', background: 'var(--color-primary)', color: 'var(--color-on-dark)', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}>
            Proceed to checkout
          </Link>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}

function ChromeRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-on-dark) 40%, transparent)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'color-mix(in srgb, var(--color-on-dark) 75%, transparent)' }}>{value}</span>
    </div>
  )
}
