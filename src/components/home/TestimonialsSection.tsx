'use client'

import { motion } from 'framer-motion'
import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1'
import './TestimonialsSection.css'

const TESTIMONIALS: Testimonial[] = [
  {
    text: "I wore the Signature lace front to my brother's wedding in Abuja. Every single woman in that room stopped to ask where I got my hair.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Adaeze O.",
    role: "Lagos, Nigeria",
  },
  {
    text: "I've ordered from six wig brands in two years. Naronai is the first where the product matched exactly what was described — the density, the lace, the cap construction.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Chidinma N.",
    role: "Port Harcourt, Nigeria",
  },
  {
    text: "My consultant walked me through every detail before anything was ordered. The wig arrived exactly as we designed it together. That kind of care is rare.",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    name: "Funmi A.",
    role: "Ibadan, Nigeria",
  },
  {
    text: "I spent a year looking for something that felt like it was made for me. The cap construction alone made the difference. Four months in, I still reach for it first.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Ngozi E.",
    role: "Enugu, Nigeria",
  },
  {
    text: "I've never felt so confident walking into a room. The install lasted through three events and a flight home. Completely worth every naira.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    name: "Tolu B.",
    role: "Abuja, Nigeria",
  },
  {
    text: "The quality is not comparable to anything else I've tried. It moves, it breathes, it looks like my actual hair — just on a very good day.",
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Nnenna K.",
    role: "Lagos, Nigeria",
  },
  {
    text: "My sister saw mine and ordered hers the same night. Now we're both regulars. Naronai doesn't need advertising — the product speaks for itself.",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    name: "Amaka U.",
    role: "Onitsha, Nigeria",
  },
  {
    text: "I was nervous ordering online without trying it first. The team answered every question I had. When it arrived, it was better than I imagined.",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "Seun F.",
    role: "Lekki, Nigeria",
  },
  {
    text: "The texture is unlike anything else. Everyone assumes it's my natural hair. That is the highest compliment I could give any wig brand.",
    image: "https://randomuser.me/api/portraits/women/82.jpg",
    name: "Zara M.",
    role: "Victoria Island, Nigeria",
  },
]

const firstColumn  = TESTIMONIALS.slice(0, 3)
const secondColumn = TESTIMONIALS.slice(3, 6)
const thirdColumn  = TESTIMONIALS.slice(6, 9)

export function TestimonialsSection() {
  return (
    <section
      aria-label="Client testimonials"
      style={{
        background: 'var(--color-bg)',
        overflow: 'hidden',
        padding: 'clamp(72px, 10vh, 120px) 0',
        position: 'relative',
      }}
    >
      <div aria-hidden="true" className="blush-orb-bg">
        <div className="blush-orb testimonials-orb-a" />
        <div className="blush-orb testimonials-orb-b" />
        <div className="blush-orb testimonials-orb-c" />
      </div>

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vh, 72px)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: '16px',
            }}
          >
            Client Stories
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.2vw, 48px)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--color-text)',
              margin: '0 auto',
              maxWidth: '520px',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            From Lagos to London,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>
              the same experience.
            </em>
          </h2>
        </motion.div>

        <div
          className="flex justify-center gap-5"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
            maxHeight: '680px',
            overflow: 'hidden',
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={22}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={20}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  )
}
