'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/lib/store/cartStore'
import { formatNaira } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?:  number   // for stagger animation
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem  = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ product, quantity: 1 })
    openCart()
  }

  return (
    <div
      className="product-card reveal"
      style={{
        position: 'relative',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        style={{
          textDecoration: 'none',
          display: 'block',
          background: 'var(--color-bg-card)',
          border: '0.5px solid var(--color-border-medium)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          transition: 'transform var(--duration-fast) var(--ease-spring), box-shadow var(--duration-fast) var(--ease-out)',
        }}
        className="product-card-link"
      >
        {/* Image area */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-surface)' }} />
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, color-mix(in srgb, var(--color-midnight) 70%, transparent) 0%, transparent 50%)',
          }} />

          {/* Tier badge */}
          {product.tier && (
            <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
              <Badge variant="tier">{product.tier}</Badge>
            </div>
          )}

          {/* Sold out overlay */}
          {!product.inStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'color-mix(in srgb, var(--color-midnight) 50%, transparent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Badge variant="sold-out">Sold Out</Badge>
            </div>
          )}

          {/* New badge */}
          {product.isNew && product.inStock && (
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Badge variant="new">New</Badge>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '14px 16px 14px 16px', paddingRight: product.inStock ? '52px' : '16px' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
            lineHeight: 1.3,
          }}>
            {product.name}
          </p>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
          }}>
            {formatNaira(product.price)}
          </p>
        </div>
      </Link>

      {/* Add to cart — outside the Link so it never triggers navigation */}
      {product.inStock && (
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '16px',
            zIndex: 1,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            color: 'var(--color-on-dark)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 200ms var(--ease-spring)',
          }}
        >
          <Plus size={14} />
        </button>
      )}

      <style>{`
        .product-card-link:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
        }
      `}</style>
    </div>
  )
}
