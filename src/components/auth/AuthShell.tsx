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
      background: '#2E1D1B',
    }}>

      {/* ── Left brand panel (lg+) ──────────────────────────────── */}
      <aside
        aria-hidden="true"
        className="hidden lg:flex"
        style={{
          width: '38%',
          flexShrink: 0,
          background: '#2E1D1B',
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
              background: 'linear-gradient(to bottom, rgba(46,29,27,0.72) 0%, rgba(46,29,27,0.35) 45%, rgba(46,29,27,0.78) 100%)',
            }} />
          </div>
        )}

        {/* Top: signature + tagline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'block' }}>
            <Signature
              text="Naronai"
              color="#C3A05B"
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
              background: 'rgba(195,160,91,0.4)',
              marginBottom: '20px',
            }} />
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(17px, 1.8vw, 22px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(244,236,229,0.75)',
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
                color: 'rgba(195,160,91,0.55)',
                padding: '5px 10px',
                border: '0.5px solid rgba(195,160,91,0.2)',
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
              background: 'radial-gradient(circle, rgba(122,47,75,0.28) 0%, transparent 68%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute',
              width: '45%',
              paddingTop: '45%',
              top: '-10%',
              left: '-12%',
              background: 'radial-gradient(circle, rgba(195,160,91,0.10) 0%, transparent 68%)',
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
            background: '#2E1D1B',
            padding: '28px 28px 24px',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link href="/" style={{ display: 'inline-block' }}>
            <Signature
              text="Naronai"
              color="#C3A05B"
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
            color: 'rgba(244,236,229,0.55)',
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
