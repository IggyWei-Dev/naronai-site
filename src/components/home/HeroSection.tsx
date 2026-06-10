'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

const SLIDES = [
  {
    image: '/assets/images/hero/hero-slide-1.png',
    eyebrow: 'New Collection',
    headline: ['Luxury Hair.', 'Limitless You.'],
    sub: 'Premium human hair wigs.\nLuxury experiences. Lasting impact.',
  },
  {
    image: '/assets/images/hero/hero-slide-2.png',
    eyebrow: 'Bespoke',
    headline: ['Bespoke.', 'Bold. Unapologetic.'],
    sub: 'Made exactly for you. Every length,\ntexture, and style — crafted to order.',
  },
  {
    image: '/assets/images/hero/hero-slide-3.png',
    eyebrow: 'Signature',
    headline: ['Leave an', 'Impression.'],
    sub: 'The signature of a woman who\nknows what she deserves.',
  },
] as const

const INTERVAL = 6000

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // Parallax scroll (desktop only)
  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Auto-advance — resets naturally whenever current, paused, or reduced changes
  useEffect(() => {
    if (reduced || paused) return
    timerRef.current = setTimeout(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, reduced])

  const goTo = (i: number) => {
    clearTimeout(timerRef.current)
    setCurrent(i)
  }

  const slide = SLIDES[current]

  return (
    <section
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        height: '100svh',
        minHeight: '600px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >

      {/* ── Mobile: full-bleed images (crossfade) ── */}
      <div className="md:hidden" style={{ position: 'absolute', inset: 0 }}>
        {SLIDES.map((s, i) => (
          <motion.img
            key={i}
            src={s.image}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '68% 15%',
              display: 'block',
            }}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        ))}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'var(--hero-overlay-mobile)',
        }} />
      </div>

      {/* ── Desktop: right image panel (60%) ── */}
      <div
        className="hidden md:block"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', overflow: 'hidden' }}
      >
        {/* Theme-aware blend overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'var(--hero-blend-left)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24%', zIndex: 2, pointerEvents: 'none', background: 'var(--hero-blend-bottom)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'var(--hero-blend-vignette)' }} />

        {/* Stacked images — crossfade on current change */}
        {SLIDES.map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '125%', marginTop: '-4%',
              transform: `translateY(${scrollY * 0.33}px)`,
              willChange: 'transform',
            }}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <img
              src={s.image}
              alt={i === current ? 'Naronai luxury hair model' : ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Left text panel ── */}
      <div
        className="pb-[100px] md:pb-[clamp(80px,10vh,120px)]"
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(72px, 10vh, 100px)',
          paddingLeft: 'clamp(24px, 6vw, 100px)',
          paddingRight: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '510px' }}>

          {/* Transition B — text rises out upward, new text rises in from below */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -22 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow */}
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                opacity: 0.8,
              }}>
                {slide.eyebrow}
              </span>

              {/* Headline */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(46px, 6.2vw, 80px)',
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: '-0.01em',
                color: 'var(--color-text)',
                margin: 0,
              }}>
                {slide.headline[0]}<br />
                <em className="gold-shimmer" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                  {slide.headline[1]}
                </em>
              </h1>

              {/* Sub-copy */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--color-text-sub)',
                lineHeight: 1.75,
                margin: 0,
                maxWidth: '270px',
                whiteSpace: 'pre-line',
              }}>
                {slide.sub}
              </p>

              {/* CTAs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                flexWrap: 'wrap',
                paddingTop: '6px',
              }}>
                <Link href="/shop" className="hero-cta-primary">
                  Shop Collections
                </Link>
                <Link href="/consultation" className="hero-cta-text">
                  Book a Consultation <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div
            style={{ display: 'flex', gap: '8px' }}
            role="tablist"
            aria-label="Carousel navigation"
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? '32px' : '16px',
                  height: '2px',
                  background: i === current
                    ? 'var(--color-gold)'
                    : 'color-mix(in srgb, var(--color-text-muted) 40%, transparent)',
                  border: 'none',
                  borderRadius: '2px',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '8px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '28px',
            background: 'linear-gradient(to bottom, var(--color-text-muted), transparent)',
          }}
        />
      </motion.div>

    </section>
  )
}
