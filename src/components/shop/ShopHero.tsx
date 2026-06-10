import Image from 'next/image'

export function ShopHero() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(320px, 50vw, 580px)',
        overflow: 'hidden',
      }}
    >
      <Image
        src="/assets/images/shop/shop-hero.png"
        alt="Naronai Collection"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
      />

      {/* Dark vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, color-mix(in srgb, var(--color-midnight) 18%, transparent) 0%, color-mix(in srgb, var(--color-midnight) 55%, transparent) 100%)',
        }}
      />

      {/* Copy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 'clamp(24px, 5vw, 56px)',
          textAlign: 'center',
          gap: '10px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--color-on-dark) 65%, transparent)',
          }}
        >
          The Collection
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5.5vw, 72px)',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: 'var(--color-on-dark)',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          All Pieces
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 1.4vw, 15px)',
            color: 'color-mix(in srgb, var(--color-on-dark) 70%, transparent)',
            lineHeight: 1.7,
            maxWidth: '480px',
            margin: '4px 0 0',
          }}
        >
          Signature, Couture, and Bespoke — each crafted to leave an impression.
        </p>
      </div>
    </div>
  )
}
