'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/utils'
import type { ProductRow, WishlistItemRow } from '@/lib/supabase/types'

export interface WishlistEntry {
  wishlist_item_id: string
  product: ProductRow
}

interface WishlistSectionProps {
  entries: WishlistEntry[]
}

export function WishlistSection({ entries: initialEntries }: WishlistSectionProps) {
  const [entries, setEntries] = useState<WishlistEntry[]>(initialEntries)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleRemove(wishlistItemId: string) {
    setRemoving(wishlistItemId)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('wishlist_items') as any)
      .delete()
      .eq('id', wishlistItemId)
    setEntries(prev => prev.filter(e => e.wishlist_item_id !== wishlistItemId))
    setRemoving(null)
  }

  if (entries.length === 0) {
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
          background: 'rgba(195,160,91,0.08)',
          border: '0.5px solid rgba(195,160,91,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'rgba(195,160,91,0.5)',
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
            Your wishlist is empty
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '280px',
          }}>
            Save pieces you love and find them here when you're ready.
          </p>
        </div>
        <Link
          href="/shop"
          style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '12px 28px',
            background: '#7A2F4B',
            color: '#F4ECE5',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Explore the collection
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '24px',
    }}>
      {entries.map(({ wishlist_item_id, product }) => {
        const image = product.images?.[0]
        const isRemoving = removing === wishlist_item_id

        return (
          <div
            key={wishlist_item_id}
            style={{
              position: 'relative',
              opacity: isRemoving ? 0.4 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            {/* Remove button */}
            <button
              onClick={() => handleRemove(wishlist_item_id)}
              disabled={isRemoving}
              aria-label="Remove from wishlist"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(46,29,27,0.7)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRemoving ? 'not-allowed' : 'pointer',
                color: 'rgba(244,236,229,0.7)',
                transition: 'background 180ms ease',
              }}
            >
              <X size={12} />
            </button>

            {/* Product image */}
            <Link href={`/shop/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                position: 'relative',
                paddingTop: '133%',
                background: 'rgba(195,160,91,0.04)',
                overflow: 'hidden',
                marginBottom: '14px',
              }}>
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(195,160,91,0.2)',
                    fontSize: '28px',
                  }}>
                    ✦
                  </div>
                )}

                {/* Tier badge */}
                {product.tier && (
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '7px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#C3A05B',
                    background: 'rgba(46,29,27,0.75)',
                    padding: '4px 8px',
                  }}>
                    {product.tier}
                  </span>
                )}
              </div>

              {/* Product info */}
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 300,
                color: 'var(--color-text)',
                margin: '0 0 4px',
                lineHeight: 1.3,
              }}>
                {product.name}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text-sub)',
                margin: 0,
              }}>
                {formatNaira(product.price)}
              </p>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
