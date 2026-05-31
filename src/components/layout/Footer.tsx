import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'

const LINKS = {
  Shop:    [
    { label: 'Collections',  href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Bundles',      href: '/shop?filter=bundles' },
    { label: 'Sale',         href: '/shop?filter=sale' },
  ],
  Company: [
    { label: 'About',       href: '/about' },
    { label: 'Membership',  href: '/membership' },
    { label: 'The Impact',  href: '/impact' },
    { label: 'Contact',     href: '/contact' },
  ],
  Help: [
    { label: 'Book a Consultation', href: '/consultation' },
    { label: 'Shipping Info',       href: '/shipping' },
    { label: 'Returns',             href: '/returns' },
    { label: 'Care Guide',          href: '/care-guide' },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: '#2E1D1B', color: '#D7B2A5' }}>
      <div
        className="max-w-content mx-auto"
        style={{
          padding: '64px 64px 40px',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '40px',
        }}
      >
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#F4ECE5',
              fontWeight: 300,
            }}
          >
            NARONAI
          </span>
          <p style={{ fontSize: '13px', lineHeight: 1.7, maxWidth: '200px', color: '#B69E96' }}>
            Leave an Impression. Luxury human hair wigs crafted for the woman who commands attention.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <SocialIcon href="https://instagram.com/naronai" label="Instagram"><Instagram size={16} /></SocialIcon>
            <SocialIcon href="https://tiktok.com/@naronai"  label="TikTok">
              {/* TikTok SVG (lucide doesn't have it) */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://youtube.com/@naronai"   label="YouTube"><Youtube size={16} /></SocialIcon>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#F4ECE5',
                marginBottom: '16px',
              }}
            >
              {heading}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#D7B2A5',
                    textDecoration: 'none',
                    transition: 'color 200ms',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-content mx-auto"
        style={{
          padding: '20px 64px',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em', color: '#8D6E74' }}>
          © {new Date().getFullYear()} Naronai. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '10px',
                letterSpacing: '0.08em', color: '#8D6E74', textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        color: '#D7B2A5',
        display: 'flex',
        transition: 'color 200ms, transform 200ms',
      }}
    >
      {children}
    </a>
  )
}
