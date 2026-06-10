'use client'

import { useState }          from 'react'
import { motion }             from 'framer-motion'
import { useCartStore }       from '@/lib/store/cartStore'
import { Badge }              from '@/components/ui/Badge'
import { formatNaira }        from '@/lib/utils'
import type { Product }       from '@/types'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const addItem  = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)

  const [selectedColor,  setSelectedColor]  = useState<string | null>(product.colors?.[0]?.name  ?? null)
  const [selectedLength, setSelectedLength] = useState<string | null>(product.lengths?.[0] ?? null)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addItem({
      product,
      quantity: 1,
      selectedColor:  selectedColor  ?? undefined,
      selectedLength: selectedLength ?? undefined,
    })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const hasSpecs = product.hairType || product.capType || product.origin

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Tier badge */}
      {product.tier && (
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="tier">{product.tier}</Badge>
        </div>
      )}

      {/* Name */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 3.5vw, 40px)',
        fontWeight: 300,
        color: 'var(--color-text)',
        margin: '0 0 12px',
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
      }}>
        {product.name}
      </h1>

      {/* Price */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 300,
        color: 'var(--color-accent-gold)',
        margin: '0 0 24px',
        letterSpacing: '-0.01em',
      }}>
        {formatNaira(product.price)}
      </p>

      <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '24px' }} />

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        lineHeight: 1.75,
        color: 'var(--color-text-secondary)',
        margin: '0 0 28px',
        maxWidth: '520px',
      }}>
        {product.description}
      </p>

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            margin: '0 0 12px',
          }}>
            Color
            {selectedColor && (
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px', letterSpacing: '0.06em', textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: '12px' }}>
                — {selectedColor}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {product.colors.map((c) => {
              const active = selectedColor === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={active}
                  title={c.name}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: active
                      ? '0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent-gold)'
                      : '0 0 0 1px rgba(0,0,0,0.12)',
                    transition: 'box-shadow 150ms ease',
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Length selector */}
      {product.lengths && product.lengths.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            margin: '0 0 12px',
          }}>
            Length
            {selectedLength && (
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px', letterSpacing: '0.06em', textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: '12px' }}>
                — {selectedLength}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {product.lengths.map((l) => {
              const active = selectedLength === l
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedLength(l)}
                  aria-pressed={active}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `0.5px solid ${active ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                    background: active ? 'var(--color-accent-primary)' : 'transparent',
                    color: active ? 'var(--color-on-dark)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {l}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '24px' }} />

      {/* Add to Cart / Sold Out */}
      {product.inStock ? (
        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          style={{
            width: '100%',
            padding: '16px',
            background: added ? 'transparent' : 'var(--color-primary)',
            color: added ? 'var(--color-accent-gold)' : 'var(--color-on-dark)',
            border: added ? '0.5px solid var(--color-accent-gold)' : 'none',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease',
            marginBottom: '24px',
          }}
        >
          {added ? 'Added to bag ✦' : `Add to Bag — ${formatNaira(product.price)}`}
        </motion.button>
      ) : (
        <button
          type="button"
          disabled
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: '0.5px solid var(--color-border)',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'not-allowed',
            marginBottom: '24px',
          }}
        >
          Sold Out
        </button>
      )}

      {/* Product specs */}
      {hasSpecs && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          background: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '0.5px solid var(--color-border-subtle)',
        }}>
          {product.hairType && <SpecRow label="Hair"   value={product.hairType} />}
          {product.capType  && <SpecRow label="Cap"    value={product.capType} />}
          {product.origin   && <SpecRow label="Origin" value={product.origin} />}
        </div>
      )}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        textAlign: 'right',
      }}>
        {value}
      </span>
    </div>
  )
}
