'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export function CtaSection() {
  const reduced = useReducedMotion()

  return (
    <section
      aria-label="Call to action"
      style={{
        background: 'var(--cta-bg)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 96px)',
        textAlign: 'center',
      }}
    >
      {/* Ambient glow orbs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 7%, transparent) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 70%)',
          top: '30%',
          left: '20%',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}
      >
        {/* Ornamental divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '40px',
        }}>
          <div style={{ height: '0.5px', width: '60px', background: 'color-mix(in srgb, var(--color-gold) 35%, transparent)' }} />
          <span style={{ color: 'var(--color-gold)', fontSize: '14px', opacity: 0.7 }}>✦</span>
          <div style={{ height: '0.5px', width: '60px', background: 'color-mix(in srgb, var(--color-gold) 35%, transparent)' }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--color-text)',
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          margin: '0 0 24px',
        }}>
          Every piece begins with a woman who knows what she deserves.
        </h2>

        {/* Subtext */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(14px, 1.8vw, 17px)',
          color: 'var(--color-text-sub)',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: '0 auto 48px',
        }}>
          Your Naronai awaits. Explore the full collection or speak with a consultant to find the piece made for you.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              padding: '15px 36px',
              background: 'var(--color-primary)',
              color: 'var(--color-on-dark)',
              borderRadius: '2px',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 200ms ease',
            }}
          >
            Shop the Collection
          </Link>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '15px 36px',
              background: 'transparent',
              color: 'var(--cta-ghost-text)',
              border: '0.5px solid var(--cta-ghost-border)',
              borderRadius: '2px',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 200ms ease, color 200ms ease',
            }}
          >
            Book a Consultation
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
