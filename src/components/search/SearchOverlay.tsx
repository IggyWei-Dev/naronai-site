'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion }      from 'framer-motion'
import Image                            from 'next/image'
import Link                             from 'next/link'
import { Search, X }                   from 'lucide-react'
import { useSearchStore }              from '@/lib/store/searchStore'
import { PRODUCTS }                    from '@/lib/data/products'
import { formatNaira }                 from '@/lib/utils'

const SUGGESTIONS = ['Signature', 'Couture', 'Lace Front', 'Virgin hair', 'Body wave']

export function SearchOverlay() {
  const isOpen      = useSearchStore(s => s.isOpen)
  const closeSearch = useSearchStore(s => s.closeSearch)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  /* Focus input on open; clear query on close */
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    } else {
      setQuery('')
    }
  }, [isOpen])

  /* Escape to close */
  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [isOpen, closeSearch])

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const trimmed = query.trim()
  const results = trimmed.length > 0
    ? PRODUCTS.filter(p => {
        const q = trimmed.toLowerCase()
        return (
          p.name.toLowerCase().includes(q)        ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)   ||
          p.tier?.toLowerCase().includes(q)
        )
      })
    : []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeSearch}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 98,
              background: 'rgba(46,29,27,0.55)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />

          {/* Panel — slides down from top */}
          <motion.div
            key="search-panel"
            role="dialog"
            aria-label="Search"
            aria-modal="true"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'var(--color-bg)',
              borderBottom: '0.5px solid var(--color-border)',
              boxShadow: '0 20px 60px rgba(46,29,27,0.18)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            {/* Search input row */}
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(90px, 10vw, 120px) clamp(24px, 5vw, 64px) 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              borderBottom: '0.5px solid var(--color-border-subtle)',
            }}>
              <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pieces, tiers, hair types…"
                aria-label="Search products"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px, 3vw, 30px)',
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text)',
                  caretColor: 'var(--color-accent-gold)',
                }}
              />
              <button
                onClick={closeSearch}
                aria-label="Close search"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '6px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  transition: 'color 150ms',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Results / suggestions */}
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '28px clamp(24px, 5vw, 64px) 48px',
            }}>
              {trimmed.length === 0 ? (
                /* Suggestions */
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: '14px',
                  }}>
                    Try searching for
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          padding: '7px 16px',
                          borderRadius: '20px',
                          border: '0.5px solid var(--color-border)',
                          background: 'transparent',
                          color: 'var(--color-text-sub)',
                          cursor: 'pointer',
                          transition: 'border-color 150ms, color 150ms',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                /* No results */
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--color-text-muted)',
                    marginBottom: '10px',
                  }}>
                    No results for "{trimmed}"
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                    Try a different term or browse the full collection.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeSearch}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    Browse all →
                  </Link>
                </div>
              ) : (
                /* Results grid */
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: '20px',
                  }}>
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 220px))',
                    gap: '20px',
                  }}>
                    {results.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={closeSearch}
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="search-result-card">
                          <div style={{
                            position: 'relative',
                            aspectRatio: '3/4',
                            background: 'var(--color-bg-surface)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            marginBottom: '10px',
                          }}>
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="220px"
                                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                              />
                            ) : (
                              <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(195,160,91,0.2)', fontSize: '20px',
                              }}>
                                ✦
                              </div>
                            )}
                          </div>
                          <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'var(--color-text)',
                            margin: '0 0 3px',
                            lineHeight: 1.3,
                          }}>
                            {product.name}
                          </p>
                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            margin: 0,
                          }}>
                            {formatNaira(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
