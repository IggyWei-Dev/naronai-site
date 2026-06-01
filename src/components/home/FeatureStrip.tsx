'use client'

import { motion } from 'framer-motion'
import { Award, Sparkles, Crown, Globe } from 'lucide-react'

const FEATURES = [
  { icon: Award,    title: 'Premium Quality',    desc: 'Luxury human hair only.' },
  { icon: Sparkles, title: 'Bespoke Experience',  desc: 'Custom. Personal. Perfect.' },
  { icon: Crown,    title: 'VIP Access',          desc: 'Exclusive perks & events.' },
  { icon: Globe,    title: 'Worldwide Delivery',  desc: 'Fast. Secure. Insured.' },
]

export function FeatureStrip() {
  return (
    <section
      aria-label="Features"
      style={{
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-accent-gold)',
        borderBottom: '1px solid var(--color-accent-gold)',
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1440px] mx-auto">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'flex flex-col items-center text-center gap-[7px] p-8 md:p-11',
                i % 2 === 0 ? 'border-r border-r-[var(--color-border)]' : '',
                i < 2 ? 'border-b border-b-[var(--color-border)] md:border-b-0' : '',
                i < 3 ? 'md:border-r md:border-r-[var(--color-border)]' : 'md:border-r-0',
              ].join(' ')}
            >
              {/* Icon inherits color via currentColor so it responds to theme */}
              <span style={{ color: 'var(--color-accent-gold)' }}>
                <Icon size={64} strokeWidth={1.0} />
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-text)',
                fontWeight: 500,
              }}>
                {f.title}
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                letterSpacing: '0.05em',
                color: 'var(--color-text-muted)',
              }}>
                {f.desc}
              </span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
