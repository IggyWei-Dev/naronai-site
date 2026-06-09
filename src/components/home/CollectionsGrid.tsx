'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CARDS = [
  {
    label: 'Shop',
    sub: 'Luxury Wigs',
    href: '/shop',
    img: '/assets/images/collections/shop-luxury-wigs.png',
    objectPos: 'center top',
    desc: 'Every piece built to specification: length, density, lace type, and cap construction. Nothing leaves without approval.',
    cta: 'Explore the collection',
  },
  {
    label: 'Membership',
    sub: 'VIP Rewards',
    href: '/membership',
    img: '/assets/images/collections/membership-vip.png',
    objectPos: 'center top',
    desc: 'Priority access to new drops, in-house stylist bookings, and private events reserved for members only.',
    cta: 'View membership',
  },
  {
    label: 'Experiences',
    sub: 'Beauty & Lifestyle',
    href: '/experiences',
    img: '/assets/images/collections/experiences-beauty.png',
    objectPos: 'center center',
    desc: 'Curated beauty events and lifestyle moments, designed for Naronai women.',
    cta: 'See upcoming events',
  },
  {
    label: 'Impact',
    sub: 'The Naronai Story',
    href: '/impact',
    img: '/assets/images/collections/impact-story.png',
    objectPos: 'center top',
    desc: 'A Nigerian brand, built for Nigerian women. Not marketing copy. The reason everything is designed the way it is.',
    cta: 'Read our story',
  },
]

function AccordionCard({
  card,
  index,
  isActive,
  onActivate,
  reduced,
}: {
  card: (typeof CARDS)[0]
  index: number
  isActive: boolean
  onActivate: () => void
  reduced: boolean
}) {
  return (
    <motion.div
      layout
      className="relative cursor-pointer overflow-hidden"
      transition={{ layout: reduced ? { duration: 0 } : { type: 'spring', damping: 32, stiffness: 260 } }}
      onHoverStart={onActivate}
      onClick={onActivate}
      style={{ flex: isActive ? 4 : 1, minWidth: 0, minHeight: 0, width: '100%', height: '100%' }}
    >
      {/* Image */}
      <img
        src={card.img}
        alt={card.sub}
        className="size-full object-cover"
        style={{ objectPosition: card.objectPos }}
      />

      {/* Bottom gradient — always on */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--color-midnight) 92%, transparent) 0%, color-mix(in srgb, var(--color-midnight) 12%, transparent) 55%, transparent 100%)',
        }}
      />

      {/* Active: extra dim overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'color-mix(in srgb, var(--color-midnight) 30%, transparent)' }}
          />
        )}
      </AnimatePresence>

      {/* Active: content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.28, delay: 0.12, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } }}
            className="pointer-events-none absolute bottom-0 left-0 right-0"
            style={{ padding: 'clamp(16px, 3vh, 28px) 20px' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-surface)',
                marginBottom: '7px',
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 4vw, 38px)',
                fontWeight: 300,
                color: 'var(--color-on-dark)',
                lineHeight: 1.05,
                marginBottom: '12px',
              }}
            >
              {card.sub}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                lineHeight: 1.72,
                color: 'color-mix(in srgb, var(--color-on-dark) 78%, transparent)',
                margin: '0 0 14px',
              }}
            >
              {card.desc}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); window.location.href = card.href }}
              onMouseEnter={(e) => {
                e.stopPropagation()
                const el = e.currentTarget as HTMLButtonElement
                el.style.opacity = '1'
                const arrow = el.querySelector('span') as HTMLSpanElement
                if (arrow) arrow.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                const el = e.currentTarget as HTMLButtonElement
                el.style.opacity = '0.7'
                const arrow = el.querySelector('span') as HTMLSpanElement
                if (arrow) arrow.style.transform = 'translateX(0)'
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#C3A05B',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                opacity: 0.7,
                transition: 'opacity 200ms ease',
                pointerEvents: 'auto',
              }}
            >
              {card.cta}
              <span style={{ display: 'inline-flex', transition: 'transform 200ms ease' }}>
                <ArrowRight size={8} strokeWidth={1.5} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inactive: label */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {/* Desktop: vertical writing */}
            <span
              className="hidden md:block"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(195,160,91,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              {card.label}
            </span>
            {/* Mobile: horizontal */}
            <span
              className="md:hidden"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(195,160,91,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              {card.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function CollectionsGrid() {
  const reduced = useReducedMotion()
  const [activeCard, setActiveCard] = useState(0)

  return (
    <section
      aria-label="Collections"
      style={{ background: '#2E1D1B' }}
      className="grid grid-cols-1 lg:grid-cols-[minmax(380px,520px)_1fr]"
    >
      {/* ── Left: title + copy + CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
          padding: 'clamp(28px, 5vh, 96px) clamp(20px, 5vw, 64px)',
          borderRight: '0.5px solid rgba(195,160,91,0.12)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.2vw, 50px)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#F4ECE5',
            margin: 0,
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          More Than A Wig.{' '}
          <em style={{ fontStyle: 'italic', color: '#E8B8AA' }}>
            It&apos;s A Lifestyle.
          </em>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: 1.85,
            color: 'rgba(244,236,229,0.5)',
            margin: 0,
          }}
        >
          Wigs, events, membership, and community: four distinct offerings, each
          built to the same standard.
        </p>

        <Link
          href="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            padding: '12px 26px',
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#2E1D1B',
            background: '#C3A05B',
            textDecoration: 'none',
            width: 'fit-content',
          }}
        >
          Discover More <ArrowRight size={10} strokeWidth={1.5} />
        </Link>
      </motion.div>

      {/* ── Right: accordion cards ── */}
      <div
        className="flex flex-col md:flex-row overflow-hidden h-[clamp(480px,85vh,640px)] md:h-[clamp(300px,55vh,700px)]"
        style={{
          gap: '2px',
          alignSelf: 'stretch',
        }}
      >
        <LayoutGroup id="collections-accordion">
          {CARDS.map((card, i) => (
            <AccordionCard
              key={card.label}
              card={card}
              index={i}
              isActive={activeCard === i}
              onActivate={() => setActiveCard(i)}
              reduced={reduced ?? false}
            />
          ))}
        </LayoutGroup>
      </div>
    </section>
  )
}
