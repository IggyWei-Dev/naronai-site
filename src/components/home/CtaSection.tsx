'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export function CtaSection() {
  const reduced = useReducedMotion()

  return (
    <section
      aria-label="Call to action"
      style={{
        background: 'linear-gradient(160deg, #1a0f0d 0%, #2E1D1B 40%, #3d2218 70%, #1a0f0d 100%)',
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
          background: 'radial-gradient(circle, rgba(195,160,91,0.07) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(122,47,75,0.12) 0%, transparent 70%)',
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
          <div style={{ height: '0.5px', width: '60px', background: 'rgba(195,160,91,0.35)' }} />
          <span style={{ color: '#C3A05B', fontSize: '14px', opacity: 0.7 }}>✦</span>
          <div style={{ height: '0.5px', width: '60px', background: 'rgba(195,160,91,0.35)' }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#F4ECE5',
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
          color: 'rgba(244,236,229,0.55)',
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
              background: '#7A2F4B',
              color: '#F4ECE5',
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
              color: 'rgba(244,236,229,0.75)',
              border: '0.5px solid rgba(244,236,229,0.25)',
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
