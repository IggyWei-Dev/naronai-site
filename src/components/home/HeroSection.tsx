'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
const HERO_IMG  = '/assets/images/hero/Gemini_Generated_Image_n11mf5n11mf5n11m.png'

/* Direct per-element animation — avoids variant propagation issues in FM v11 + Next.js SSR */
const fade = (i: number) => ({
  initial:    { opacity: 0, y: 26 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.82, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
})

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

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

  return (
    <section
      aria-label="Hero"
      style={{
        height: '100svh',
        minHeight: '600px',
        position: 'relative',
        overflow: 'hidden',
        background: '#2E1D1B',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >

      {/* ── Mobile: full-bleed background image ─────────────────── */}
      <div
        className="md:hidden"
        style={{ position: 'absolute', inset: 0 }}
      >
        <img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '68% 15%',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(46,29,27,0.18) 0%, rgba(46,29,27,0.42) 38%, rgba(46,29,27,0.84) 68%, #2E1D1B 92%)',
        }} />
      </div>

      {/* ── Desktop: right image panel (60% wide) ──────────────────── */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: '60%',
          overflow: 'hidden',
        }}
      >
        {/* Left-edge blend */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to right, #2E1D1B 0%, rgba(46,29,27,0.68) 22%, rgba(46,29,27,0.22) 50%, transparent 72%)',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '24%', zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to top, #2E1D1B 0%, transparent 100%)',
        }} />
        {/* Right vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 82% 50%, transparent 52%, rgba(46,29,27,0.42) 100%)',
        }} />

        {/* Parallax image */}
        <div style={{
          width: '100%',
          height: '125%',
          marginTop: '-4%',
          transform: `translateY(${scrollY * 0.33}px)`,
          willChange: 'transform',
        }}>
          <img
            src={HERO_IMG}
            alt="Naronai luxury hair model"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        </div>

      </div>

      {/* ── Left panel ─────────────────────────────────────────────── */}
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
        {/* Text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '510px' }}>

          {/* Headline */}
          <motion.h1 {...fade(0)} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(46px, 6.2vw, 80px)',
            fontWeight: 300,
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            color: '#F4ECE5',
            margin: 0,
          }}>
            Luxury Hair.<br />
            <em className="gold-shimmer" style={{ fontStyle: 'italic', fontWeight: 300 }}>
              Limitless You.
            </em>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p {...fade(1)} style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: '#D7B2A5',
            lineHeight: 1.75,
            margin: 0,
            maxWidth: '270px',
          }}>
            Premium human hair wigs.<br />
            Luxury experiences.<br />
            Lasting impact.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fade(2)} style={{
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
          </motion.div>
        </div>

        {/* closes "Text content at the bottom" div */}
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────── */}
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
          color: 'rgba(185,147,157,0.5)',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '28px',
            background: 'linear-gradient(to bottom, rgba(185,147,157,0.5), transparent)',
          }}
        />
      </motion.div>

    </section>
  )
}
