'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Signature } from '@/components/ui/signature'
import './BrandStoryPanel.css'

const PORTRAIT = '/assets/images/brand-story-portrait.png'

export function BrandStoryPanel() {
  const reduced = useReducedMotion()

  return (
    <section
      aria-label="About Naronai"
      style={{ background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}
      className="py-8 md:py-20"
    >
      <div aria-hidden="true" className="blush-orb-bg">
        <div className="blush-orb brand-story-orb-a" />
        <div className="blush-orb brand-story-orb-b" />
        <div className="blush-orb brand-story-orb-c" />
      </div>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14 items-center">

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: '48px',
                height: '1px',
                background: '#E8B8AA',
                marginBottom: '20px',
              }}
            />

            <div style={{ overflow: 'hidden', height: 'clamp(130px, 40vw, 210px)', width: '100%', marginBottom: '20px' }}>
              <Signature
                text="Naronai"
                color="#7A2F4B"
                shimmer
                shimmerHighlight="#C3A05B"
                fontSize={96}
                duration={2}
                delay={0.3}
                inView={true}
                once
                className="block max-w-full h-auto"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '58ch' }}>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                lineHeight: 1.78,
                fontWeight: 300,
                color: 'var(--color-text)',
                margin: 0,
              }}>
                Naronai was built for the woman who arrives on purpose. Every wig we construct is designed around one question: what does this piece do for the woman wearing it? Not what it is made of. Not how it photographs. What it does when she walks in.
              </p>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                lineHeight: 1.78,
                fontWeight: 300,
                color: 'var(--color-text)',
                margin: 0,
              }}>
                We work exclusively with unprocessed human hair, verified at source. Every piece is fitted to specification: length, density, lace type, cap construction. Your consultant confirms every detail before we begin. Nothing leaves our workroom without approval.
              </p>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                lineHeight: 1.78,
                fontWeight: 300,
                color: 'var(--color-text)',
                margin: 0,
              }}>
                Naronai is a Nigerian brand, built for Nigerian women. That is not marketing copy. It is the reason everything is designed the way it is.
              </p>
            </div>

            <Link
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '24px',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 500,
                width: 'fit-content',
              }}
            >
              Read our story
              <span aria-hidden="true" style={{ fontSize: '14px' }}>→</span>
            </Link>
          </motion.div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative overflow-hidden"
            style={{
              aspectRatio: '3 / 4',
              boxShadow: '0 20px 72px rgba(46, 29, 27, 0.18)',
              maxHeight: 'clamp(260px, 80vw, 600px)',
            }}
          >
            <Image
              src={PORTRAIT}
              alt="A woman seated in a studio portrait wearing a long, voluminous Naronai wig in rich warm brown tones, her gaze direct and commanding"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Subtle bottom vignette to ground the image */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 55%, rgba(247,242,236,0.35) 100%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
