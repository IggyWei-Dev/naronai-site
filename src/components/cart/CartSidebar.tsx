'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { formatNaira } from '@/lib/utils'

export function CartSidebar() {
  const isOpen    = useCartStore(s => s.isOpen)
  const closeCart = useCartStore(s => s.closeCart)
  const items     = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQty  = useCartStore(s => s.updateQty)
  const total      = useCartStore(s => s.total)

  /* Lock body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'color-mix(in srgb, var(--color-midnight) 55%, transparent)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-label="Shopping bag"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0, 0.1, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 201,
              width: 'min(420px, 100vw)',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px color-mix(in srgb, var(--color-midnight) 18%, transparent)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 24px 20px',
              borderBottom: '0.5px solid var(--color-border)',
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 300,
                  color: 'var(--color-text)',
                  margin: 0,
                  lineHeight: 1,
                }}>
                  Your bag
                </h2>
                {items.length > 0 && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    margin: '4px 0 0',
                  }}>
                    {items.reduce((s, i) => s + i.quantity, 0)} {items.length === 1 && items[0].quantity === 1 ? 'item' : 'items'}
                  </p>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
            }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '16px',
                  padding: '40px 24px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '24px', color: 'color-mix(in srgb, var(--color-gold) 30%, transparent)' }}>✦</span>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      fontWeight: 300,
                      color: 'var(--color-text)',
                      margin: '0 0 6px',
                    }}>
                      Your bag is empty
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}>
                      Add pieces from the collection to get started.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    style={{
                      marginTop: '8px',
                      padding: '11px 24px',
                      background: 'var(--color-primary)',
                      color: 'var(--color-on-dark)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Browse collection
                  </Link>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {items.map((item, i) => {
                    const image = item.product.images?.[0]
                    return (
                      <li
                        key={`${item.product.id}-${item.selectedColor}-${item.selectedLength}`}
                        style={{
                          display: 'flex',
                          gap: '14px',
                          padding: '16px 24px',
                          borderBottom: i < items.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: '76px',
                          height: '96px',
                          flexShrink: 0,
                          background: 'color-mix(in srgb, var(--color-gold) 5%, transparent)',
                          overflow: 'hidden',
                          position: 'relative',
                        }}>
                          {image ? (
                            <Image
                              src={image}
                              alt={item.product.name}
                              fill
                              style={{ objectFit: 'cover', objectPosition: 'center top' }}
                              sizes="76px"
                            />
                          ) : (
                            <div style={{
                              position: 'absolute', inset: 0, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              color: 'color-mix(in srgb, var(--color-gold) 20%, transparent)', fontSize: '18px',
                            }}>✦</div>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '15px',
                            fontWeight: 300,
                            color: 'var(--color-text)',
                            margin: 0,
                            lineHeight: 1.3,
                          }}>
                            {item.product.name}
                          </p>

                          {(item.selectedColor || item.selectedLength) && (
                            <p style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              margin: 0,
                            }}>
                              {[item.selectedColor, item.selectedLength].filter(Boolean).join(' · ')}
                            </p>
                          )}

                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            color: 'var(--color-text-sub)',
                            margin: 0,
                          }}>
                            {formatNaira(item.product.price)}
                          </p>

                          {/* Qty + Remove row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '0.5px solid var(--color-border)',
                              borderRadius: '2px',
                            }}>
                              <button
                                onClick={() => updateQty(item.product.id, item.quantity - 1, item.selectedColor, item.selectedLength)}
                                aria-label="Decrease quantity"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '5px 9px',
                                  color: 'var(--color-text-muted)',
                                  display: 'flex',
                                  lineHeight: 1,
                                }}
                              >
                                <Minus size={11} />
                              </button>
                              <span style={{
                                fontFamily: 'var(--font-ui)',
                                fontSize: '11px',
                                color: 'var(--color-text)',
                                minWidth: '20px',
                                textAlign: 'center',
                              }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.product.id, item.quantity + 1, item.selectedColor, item.selectedLength)}
                                aria-label="Increase quantity"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '5px 9px',
                                  color: 'var(--color-text-muted)',
                                  display: 'flex',
                                  lineHeight: 1,
                                }}
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedLength)}
                              aria-label="Remove item"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)',
                                display: 'flex',
                                padding: '4px',
                                opacity: 0.6,
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer — only when items exist */}
            {items.length > 0 && (
              <div style={{
                flexShrink: 0,
                padding: '20px 24px 28px',
                borderTop: '0.5px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {/* Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '9px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}>
                    Subtotal
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 300,
                    color: 'var(--color-text)',
                  }}>
                    {formatNaira(total())}
                  </span>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '15px',
                    background: 'var(--color-primary)',
                    color: 'var(--color-on-dark)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  Proceed to Checkout
                </Link>

                {/* View full cart */}
                <Link
                  href="/cart"
                  onClick={closeCart}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    border: '0.5px solid var(--color-border)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  View Full Bag
                </Link>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  Free delivery on orders over ₦150,000
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
