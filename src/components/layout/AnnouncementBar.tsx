'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AnnouncementBarProps {
  message: string
}

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: 'var(--color-midnight)',
        color: 'var(--color-border-medium)',
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        height: '36px',
        padding: '0 40px 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          window.dispatchEvent(new Event('announcement-dismissed'))
        }}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '16px',
          background: 'none',
          border: 'none',
          color: 'var(--color-border-medium)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          transition: 'opacity 200ms',
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}
