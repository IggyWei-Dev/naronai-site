import Link from 'next/link'
import Image from 'next/image'
import { Signature } from '@/components/ui/signature'

interface AuthShellProps {
  children: React.ReactNode
  imageSrc?: string
  imageAlt?: string
}

export function AuthShell({ children, imageSrc, imageAlt = '' }: AuthShellProps) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100dvh',
      background: 'var(--color-midnight)',
    }}>

      {/* ── Left brand panel (lg+) ──────────────────────────────── */}
      <aside
        aria-hidden="true"
        className="hidden lg:flex"
        style={{
          width: '38%',
          flexShrink: 0,
          background: 'var(--color-midnight)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(52px, 7vh, 88px) clamp(44px, 5vw, 76px)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Background image — own clip context so the signature SVG is never clipped */}
        {imageSrc && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
              sizes="38vw"
            />
            {/* Dark gradient overlay so text stays legible */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-midnight) 72%, transparent) 0%, color-mix(in srgb, var(--color-midnight) 35%, transparent) 45%, color-mix(in srgb, var(--color-midnight) 78%, transparent) 100%)',
            }} />
          </div>
        )}

        {/* Top: signature + tagline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'block' }}>
            <Signature
              text="Naronai"
              color="var(--color-gold)"
              fontSize={72}
              strokeWidth={0.55}
              duration={2.2}
              delay={0.3}
              stretch
            />
          </Link>

          <div style={{ marginTop: '20px' }}>
            <div style={{
              width: '40px',
              height: '0.5px',
              background: 'color-mix(in srgb, var(--color-gold) 40%, transparent)',
              marginBottom: '20px',
            }} />
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(17px, 1.8vw, 22px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'color-mix(in srgb, var(--color-on-dark) 75%, transparent)',
              lineHeight: 1.4,
              margin: 0,
            }}>
              Enter the room changed.
            </p>
          </div>
        </div>

        {/* Bottom: city tags */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Lagos', 'Abuja', 'Port Harcourt', 'Enugu', 'Ibadan'].map(city => (
            <span
              key={city}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                color: 'color-mix(in srgb, var(--color-gold) 55%, transparent)',
                padding: '5px 10px',
                border: '0.5px solid color-mix(in srgb, var(--color-gold) 20%, transparent)',
              }}
            >
              {city}
            </span>
          ))}
        </div>

        {/* Ambient glow — only when no image */}
        {!imageSrc && (
          <>
            <div aria-hidden="true" style={{
              position: 'absolute',
              width: '70%',
              paddingTop: '70%',
              bottom: '-20%',
              right: '-18%',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 28%, transparent) 0%, transparent 68%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute',
              width: '45%',
              paddingTop: '45%',
              top: '-10%',
              left: '-12%',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 10%, transparent) 0%, transparent 68%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
          </>
        )}
      </aside>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
        borderRadius: '24px 0 0 24px',
        overflowY: 'auto',
      }}>
        {/* Mobile brand header */}
        <div
          className="flex lg:hidden"
          style={{
            background: 'var(--color-midnight)',
            padding: '28px 28px 24px',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link href="/" style={{ display: 'inline-block' }}>
            <Signature
              text="Naronai"
              color="var(--color-gold)"
              fontSize={22}
              strokeWidth={0.8}
              duration={1.6}
              delay={0.2}
            />
          </Link>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'color-mix(in srgb, var(--color-on-dark) 55%, transparent)',
            margin: 0,
          }}>
            Enter the room changed.
          </p>
        </div>

        {/* Form area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(40px, 7vh, 72px) clamp(24px, 5vw, 72px)',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
