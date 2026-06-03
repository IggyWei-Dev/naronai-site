'use client'

import { useState } from 'react'

const OPTIONS = [
  {
    cols: 2,
    label: '2 columns',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1" y="1" width="6" height="4" rx="1" />
        <rect x="9" y="1" width="6" height="4" rx="1" />
        <rect x="1" y="7" width="6" height="4" rx="1" />
        <rect x="9" y="7" width="6" height="4" rx="1" />
        <rect x="1" y="13" width="6" height="2" rx="1" />
        <rect x="9" y="13" width="6" height="2" rx="1" />
      </svg>
    ),
  },
  {
    cols: 3,
    label: '3 columns',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1"  y="1" width="3.5" height="4" rx="1" />
        <rect x="6.25" y="1" width="3.5" height="4" rx="1" />
        <rect x="11.5" y="1" width="3.5" height="4" rx="1" />
        <rect x="1"  y="7" width="3.5" height="4" rx="1" />
        <rect x="6.25" y="7" width="3.5" height="4" rx="1" />
        <rect x="11.5" y="7" width="3.5" height="4" rx="1" />
        <rect x="1"  y="13" width="3.5" height="2" rx="1" />
        <rect x="6.25" y="13" width="3.5" height="2" rx="1" />
        <rect x="11.5" y="13" width="3.5" height="2" rx="1" />
      </svg>
    ),
  },
  {
    cols: 4,
    label: '4 columns',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1"   y="1" width="2.5" height="4" rx="0.75" />
        <rect x="4.5" y="1" width="2.5" height="4" rx="0.75" />
        <rect x="9"   y="1" width="2.5" height="4" rx="0.75" />
        <rect x="12.5" y="1" width="2.5" height="4" rx="0.75" />
        <rect x="1"   y="7" width="2.5" height="4" rx="0.75" />
        <rect x="4.5" y="7" width="2.5" height="4" rx="0.75" />
        <rect x="9"   y="7" width="2.5" height="4" rx="0.75" />
        <rect x="12.5" y="7" width="2.5" height="4" rx="0.75" />
        <rect x="1"   y="13" width="2.5" height="2" rx="0.75" />
        <rect x="4.5" y="13" width="2.5" height="2" rx="0.75" />
        <rect x="9"   y="13" width="2.5" height="2" rx="0.75" />
        <rect x="12.5" y="13" width="2.5" height="2" rx="0.75" />
      </svg>
    ),
  },
]

interface ShopControlsProps {
  children: React.ReactNode
}

export function ShopControls({ children }: ShopControlsProps) {
  const [cols, setCols] = useState(3)

  return (
    <div>
      {/* Resizer — desktop only */}
      <div
        className="hidden lg:flex"
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '4px',
          marginBottom: '20px',
        }}
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.cols}
            onClick={() => setCols(opt.cols)}
            aria-label={opt.label}
            aria-pressed={cols === opt.cols}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: `0.5px solid ${cols === opt.cols ? 'var(--color-accent-primary)' : 'transparent'}`,
              borderRadius: '6px',
              color: cols === opt.cols ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            {opt.icon}
          </button>
        ))}
      </div>

      {/* Grid wrapper — CSS variable controls column count on desktop */}
      <div style={{ '--grid-cols': `repeat(${cols}, 1fr)` } as React.CSSProperties}>
        {children}
      </div>
    </div>
  )
}
