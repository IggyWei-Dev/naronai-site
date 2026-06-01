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
    <footer style={{ background: 'var(--color-bg)', color: 'var(--color-text-sub)' }}>
      <div
        className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-10"
        style={{ padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px) 40px' }}
      >
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            fontWeight: 300,
          }}>
            NARONAI
          </span>
          <p style={{ fontSize: '13px', lineHeight: 1.7, maxWidth: '200px', color: 'var(--color-text-muted)' }}>
            Leave an Impression. Luxury human hair wigs crafted for the woman who commands attention.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <SocialIcon href="https://instagram.com/naronai" label="Instagram"><Instagram size={16} /></SocialIcon>
            <SocialIcon href="https://tiktok.com/@naronai" label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://youtube.com/@naronai" label="YouTube"><Youtube size={16} /></SocialIcon>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-text)',
              marginBottom: '16px',
            }}>
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
                    color: 'var(--color-text-sub)',
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
        className="max-w-content mx-auto flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center"
        style={{
          padding: '20px clamp(20px, 5vw, 64px)',
          borderTop: '0.5px solid var(--color-border)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Naronai. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '10px',
                letterSpacing: '0.08em', color: 'var(--color-text-muted)', textDecoration: 'none',
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
      style={{ color: 'var(--color-text-sub)', display: 'flex', transition: 'color 200ms, transform 200ms' }}
    >
      {children}
    </a>
  )
}
