'use client'

import { motion } from 'framer-motion'
import { Sparkles, Crown, Globe, Gem } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BorderGlow from '@/components/ui/BorderGlow'

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Gem,
    title: 'Premium Quality',
    desc: 'Every piece uses 100% unprocessed human hair, selected for density, movement, and longevity.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Experience',
    desc: 'Length, density, lace type, and cap construction are set to your specification.',
  },
  {
    icon: Crown,
    title: 'VIP Access',
    desc: 'Members receive new drops first, priority bookings with in-house stylists, and private event invitations.',
  },
  {
    icon: Globe,
    title: 'Worldwide Delivery',
    desc: 'We ship to over 40 countries with real-time tracking and full insurance on every order.',
  },
]

export function FeatureStrip() {
  return (
    <section
      aria-label="Features"
      style={{ background: 'var(--color-bg)', borderTop: '1px solid rgba(195, 160, 91, 0.2)' }}
      className="py-12 md:py-16"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                className="h-full"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <BorderGlow
                  borderRadius={4}
                  backgroundColor="var(--color-surface)"
                  glowColor="38 45 55"
                  colors={['#7A2F4B', '#C3A05B', '#E8B8AA']}
                  glowIntensity={0.85}
                  edgeSensitivity={22}
                  glowRadius={24}
                  coneSpread={20}
                  fillOpacity={0.3}
                  className="h-full"
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '10px',
                      padding: '28px 20px',
                    }}
                  >
                    <Icon
                      size={80}
                      strokeWidth={1.0}
                      style={{ color: i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-primary)' }}
                      aria-hidden="true"
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text)',
                        fontWeight: 600,
                      }}
                    >
                      {f.title}
                    </span>
                   
                  </div>
                </BorderGlow>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
