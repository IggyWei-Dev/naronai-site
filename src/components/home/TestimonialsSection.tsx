'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CardSwap, { Card, type CardSwapHandle } from '@/components/ui/CardSwap'
import './TestimonialsSection.css'

const TESTIMONIALS = [
  {
    quote:
      "I wore the Signature lace front to my brother's wedding in Abuja. Every single woman in that room asked me where I got my hair.",
    name: 'Adaeze O.',
    location: 'Lagos, Nigeria',
  },
  {
    quote:
      "I have ordered from six different wig brands in two years. Naronai is the first one where the product matched exactly what was described: the density, the lace, the cap construction.",
    name: 'Chidinma N.',
    location: 'Port Harcourt, Nigeria',
  },
  {
    quote:
      "My consultant walked me through every detail before anything was ordered. The wig arrived exactly as we designed it together. I had never experienced that kind of process before.",
    name: 'Funmi A.',
    location: 'Ibadan, Nigeria',
  },
  {
    quote:
      "I spent a year looking for something that felt like it was made for me. The cap construction alone made the difference. Four months in, I still reach for it first.",
    name: 'Ngozi E.',
    location: 'Enugu, Nigeria',
  },
]

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

export function TestimonialsSection() {
  const swapRef = useRef<CardSwapHandle>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    swapRef.current?.advance()
  }
  const handleNext = () => {
    swapRef.current?.advance()
  }

  return (
    <section
      aria-label="Client testimonials"
      style={{ background: '#F7F2EC', overflow: 'hidden', paddingTop: 'clamp(48px, 6vh, 80px)', position: 'relative' }}
    >
      <div aria-hidden="true" className="blush-orb-bg">
        <div className="blush-orb testimonials-orb-a" />
        <div className="blush-orb testimonials-orb-b" />
        <div className="blush-orb testimonials-orb-c" />
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[3fr_4fr]"
        style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Left: heading + context */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            padding: 'clamp(64px, 10vh, 120px) clamp(28px, 6vw, 96px)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 3.5vw, 52px)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: '#2E1D1B',
              margin: 0,
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            From Lagos to Enugu,{' '}
            <em style={{ fontStyle: 'italic', color: '#7A4F3A' }}>
              the same experience.
            </em>
          </h2>

          {/* City tags */}
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            {['Lagos', 'Port Harcourt', 'Ibadan', 'Enugu'].map((city) => (
              <span
                key={city}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '8px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(46,29,27,0.60)',
                  padding: '5px 10px',
                  border: '0.5px solid rgba(46,29,27,0.18)',
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Right: card stack */}
        <div
          style={{
            position: 'relative',
            minHeight: 'clamp(600px, 72vh, 780px)',
          }}
        >
          <CardSwap
            ref={swapRef}
            width={420}
            height={380}
            cardDistance={55}
            verticalDistance={45}
            delay={7000}
            pauseOnHover
            skewAmount={5}
            easing="elastic"
            onSwap={setCurrentIndex}
          >
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                {/* Open-quote mark */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '56px',
                    lineHeight: 1,
                    color: '#7A2F4B',
                    fontWeight: 300,
                    opacity: 0.55,
                    flexShrink: 0,
                    marginBottom: '8px',
                  }}
                >
                  &ldquo;
                </div>

                {/* Quote */}
                <blockquote
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: '#2E1D1B',
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {t.quote}
                </blockquote>

                {/* Attribution */}
                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '0.5px solid rgba(46,29,27,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#2E1D1B',
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '8px',
                      letterSpacing: '0.1em',
                      color: 'rgba(46,29,27,0.72)',
                    }}
                  >
                    {t.location}
                  </span>
                </div>
              </Card>
            ))}
          </CardSwap>

          {/* Navigation overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(24px, 4vh, 44px)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 20,
            }}
          >
            <NavButton label="Previous testimonial" onClick={handlePrev}>
              <ChevronLeft size={13} strokeWidth={1.5} />
            </NavButton>

            <span
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: 'rgba(46,29,27,0.40)',
                minWidth: '48px',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {pad(currentIndex)} / {pad(TESTIMONIALS.length - 1)}
            </span>

            <NavButton label="Next testimonial" onClick={handleNext}>
              <ChevronRight size={13} strokeWidth={1.5} />
            </NavButton>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Nav button ─────────────────────────────────────────────────── */

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'rgba(46,29,27,0.45)'
        el.style.color = '#2E1D1B'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'rgba(46,29,27,0.2)'
        el.style.color = 'rgba(46,29,27,0.5)'
      }}
      style={{
        background: 'none',
        border: '0.5px solid rgba(46,29,27,0.2)',
        cursor: 'pointer',
        color: 'rgba(46,29,27,0.5)',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 200ms ease, color 200ms ease',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
