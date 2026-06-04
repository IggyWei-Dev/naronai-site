'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  name:   string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hovered, setHovered]         = useState(false)

  const src = images[activeIndex] ?? images[0]

  if (!src) {
    return (
      <div style={{
        aspectRatio: '3/4',
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(195,160,91,0.2)',
        fontSize: '32px',
      }}>
        ✦
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-bg-surface)',
          cursor: 'zoom-in',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={src}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            /* prefers-reduced-motion handled below */
          }}
          className="product-gallery-img"
        />
      </div>

      {/* Thumbnail strip — only when multiple images */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              style={{
                position: 'relative',
                width: '72px',
                height: '90px',
                flexShrink: 0,
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${i === activeIndex ? 'var(--color-accent-gold)' : 'transparent'}`,
                opacity: i === activeIndex ? 1 : 0.55,
                cursor: 'pointer',
                padding: 0,
                background: 'none',
                transition: 'opacity 150ms ease, border-color 150ms ease',
              }}
            >
              <Image
                src={img}
                alt={`${name} — view ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .product-gallery-img { transition: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}
