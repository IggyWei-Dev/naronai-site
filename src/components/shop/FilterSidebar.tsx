'use client'

import { useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ALL_COLORS, ALL_LENGTHS } from '@/lib/data/products'

const TIERS = ['Signature', 'Couture', 'Bespoke'] as const

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest arrivals' },
  { value: 'price-asc',  label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tier    = searchParams.get('tier')    ?? ''
  const color   = searchParams.get('color')   ?? ''
  const length  = searchParams.get('length')  ?? ''
  const filter  = searchParams.get('filter')  ?? ''
  const sort    = searchParams.get('sort')    ?? 'newest'

  const activeColors  = color.split(',').filter(Boolean)
  const activeLengths = length.split(',').filter(Boolean)
  const inStock = filter === 'in-stock'

  const push = useCallback((params: URLSearchParams) => {
    router.replace(`/shop?${params.toString()}`, { scroll: false })
  }, [router])

  const set = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    push(p)
  }, [searchParams, push])

  const toggle = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    const current = (p.get(key) ?? '').split(',').filter(Boolean)
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    if (next.length) p.set(key, next.join(','))
    else p.delete(key)
    push(p)
  }, [searchParams, push])

  return { tier, activeColors, activeLengths, inStock, sort, set, toggle }
}

/* ── Desktop sticky sidebar ─────────────────────────────── */

export function FilterSidebar() {
  const { tier, activeColors, activeLengths, inStock, sort, set, toggle } = useFilters()

  return (
    <>
    <style>{`.shop-sidebar::-webkit-scrollbar { display: none; }`}</style>
    <aside
      className="shop-sidebar"
      style={{
        width: '230px',
        flexShrink: 0,
        padding: '40px 24px 80px',
        borderRight: '0.5px solid var(--color-border)',
        position: 'sticky',
        top: '100px',
        height: 'fit-content',
        alignSelf: 'flex-start',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 110px)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      } as React.CSSProperties}
    >
      <Section label="Sort by">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => set('sort', sort === opt.value ? 'newest' : opt.value)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', padding: 0,
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.05em',
                color: sort === opt.value
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-text-muted)',
                transition: 'color 150ms',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Collection">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TIERS.map(t => (
            <Checkbox
              key={t}
              checked={tier === t}
              onChange={() => set('tier', tier === t ? '' : t)}
              label={t}
            />
          ))}
        </div>
      </Section>

      <Section label="Availability">
        <Checkbox
          checked={inStock}
          onChange={() => set('filter', inStock ? '' : 'in-stock')}
          label="In stock only"
        />
      </Section>

      <Section label="Color">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ALL_COLORS.map(c => (
            <Checkbox
              key={c}
              checked={activeColors.includes(c)}
              onChange={() => toggle('color', c)}
              label={c}
            />
          ))}
        </div>
      </Section>

      <Section label="Length" last>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALL_LENGTHS.map(l => {
            const active = activeLengths.includes(l)
            return (
              <button
                key={l}
                onClick={() => toggle('length', l)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  border: `0.5px solid ${active ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                  background: active ? 'var(--color-accent-primary)' : 'transparent',
                  color: active ? '#F4ECE5' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {l}
              </button>
            )
          })}
        </div>
      </Section>
    </aside>
    </>
  )
}

/* ── Mobile filter chips bar ───────────────────────────── */

export function MobileFilterBar() {
  const { tier, inStock, sort, set } = useFilters()

  const cycleSort = () => {
    const next = sort === 'newest' ? 'price-asc' : sort === 'price-asc' ? 'price-desc' : 'newest'
    set('sort', next)
  }

  const sortLabel =
    sort === 'price-asc'  ? 'Price ↑' :
    sort === 'price-desc' ? 'Price ↓' :
    'Newest'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      } as React.CSSProperties}
    >
      <Chip active={sort !== 'newest'} onClick={cycleSort} label={sortLabel} />
      {TIERS.map(t => (
        <Chip
          key={t}
          active={tier === t}
          onClick={() => set('tier', tier === t ? '' : t)}
          label={t}
        />
      ))}
      <Chip
        active={inStock}
        onClick={() => set('filter', inStock ? '' : 'in-stock')}
        label="In Stock"
      />
    </div>
  )
}

/* ── Sub-components ────────────────────────────────────── */

function Section({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : '32px' }}>
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        marginBottom: '14px',
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Checkbox({
  checked, onChange, label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <span style={{
        width: '14px', height: '14px', flexShrink: 0,
        border: `1px solid ${checked ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
        borderRadius: '3px',
        background: checked ? 'var(--color-accent-primary)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
      }}>
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
            <path d="M1 3L3 5L7 1" stroke="#F4ECE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '11px',
        letterSpacing: '0.04em',
        color: checked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        transition: 'color 150ms',
      }}>
        {label}
      </span>
    </label>
  )
}

function Chip({
  active, onClick, label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        padding: '7px 14px',
        borderRadius: '20px',
        border: `0.5px solid ${active ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
        background: active ? 'var(--color-accent-primary)' : 'transparent',
        color: active ? '#F4ECE5' : 'var(--color-text-muted)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      {label}
    </button>
  )
}
