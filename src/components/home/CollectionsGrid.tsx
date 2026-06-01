'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HERO_IMG = '/assets/images/hero/Gemini_Generated_Image_n11mf5n11mf5n11m.png'

const CARDS = [
  { label: 'Shop',         sub: 'Luxury Wigs',        href: '/shop',        objectPos: 'center top' },
  { label: 'Experiences',  sub: 'Beauty & Lifestyle',  href: '/experiences', objectPos: '30% top' },
  { label: 'Membership',   sub: 'VIP Rewards',         href: '/membership',  objectPos: '70% top' },
  { label: 'The Impact',   sub: 'Empowering Women',    href: '/impact',      objectPos: 'center 30%' },
]

const fade = (i: number) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
})

export function CollectionsGrid() {
  return (
    <section
      aria-label="Collections"
      style={{
        background: '#2E1D1B',
        padding: 'clamp(64px, 10vh, 120px) clamp(24px, 6vw, 100px)',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-[1440px] mx-auto"
      >
        {/* Left: headline + copy + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.h2 {...fade(0)} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#F4ECE5',
            margin: 0,
          }}>
            More Than A Wig.<br />
            <em style={{ fontStyle: 'italic' }}>It's A Lifestyle.</em>
          </motion.h2>

          <motion.p {...fade(1)} style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: 1.85,
            color: 'rgba(244,236,229,0.55)',
            margin: 0,
            maxWidth: '320px',
          }}>
            Beauty, confidence, community and impact — all in one place. Naronai is more than a brand.
          </motion.p>

          <motion.div {...fade(2)}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C3A05B',
                textDecoration: 'none',
              }}
            >
              Discover More <ArrowRight size={11} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>

        {/* Right: 2×2 card grid */}
        <div className="grid grid-cols-2 gap-3">
          {CARDS.map((card, i) => (
            <motion.div key={card.label} {...fade(i)}>
              <Link href={card.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  background: '#1A100E',
                }}>
                  <img
                    src={HERO_IMG}
                    alt={card.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: card.objectPos,
                      transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
                    }}
                    className="hover:scale-105"
                  />
                  {/* Bottom gradient */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(46,29,27,0.88) 0%, rgba(46,29,27,0.08) 55%)',
                    pointerEvents: 'none',
                  }} />
                  {/* Label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '7.5px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#C3A05B',
                      marginBottom: '4px',
                    }}>
                      {card.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '15px',
                      fontWeight: 300,
                      color: '#F4ECE5',
                      lineHeight: 1.2,
                    }}>
                      {card.sub}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
