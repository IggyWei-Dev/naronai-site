'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Sun, Moon } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useTheme } from '@/lib/hooks/useTheme'
import { StaggeredMenu } from '@/components/ui/StaggeredMenu'

const NAV_LEFT  = [
  { label: 'Shop',         href: '/shop' },
  { label: 'Experiences',  href: '/experiences' },
  { label: 'Membership',   href: '/membership' },
]

const NAV_RIGHT = [
  { label: 'The Naronai Impact', href: '/impact' },
  { label: 'About Us',   href: '/about' },
]

const MOBILE_NAV_ITEMS = [
  { label: 'Shop',               ariaLabel: 'Go to shop',           link: '/shop' },
  { label: 'Experiences',        ariaLabel: 'View experiences',      link: '/experiences' },
  { label: 'Membership',         ariaLabel: 'Explore membership',    link: '/membership' },
  { label: 'The Naronai Impact', ariaLabel: 'Read about our impact', link: '/impact' },
  { label: 'About',              ariaLabel: 'Learn about us',        link: '/about' },
]

const ANNOUNCEMENT_BAR_HEIGHT = 36

export function Navbar() {
  const [barOffset, setBarOffset] = useState(ANNOUNCEMENT_BAR_HEIGHT)
  const [atTop,     setAtTop]     = useState(true)
  const cartCount = useCartStore((s) => s.itemCount())
  const { theme, toggle } = useTheme()

  /* Listen for announcement bar dismissal */
  useEffect(() => {
    const handler = () => setBarOffset(0)
    window.addEventListener('announcement-dismissed', handler)
    return () => window.removeEventListener('announcement-dismissed', handler)
  }, [])

  /* Track top position for blur */
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBase: React.CSSProperties = {
    position: 'fixed',
    top: barOffset,
    left: 0,
    right: 0,
    zIndex: 50,
    background: atTop ? 'transparent' : 'rgba(46, 29, 27, 0.35)',
    backdropFilter: atTop ? 'none' : 'blur(12px)',
    WebkitBackdropFilter: atTop ? 'none' : 'blur(12px)',
    transition: 'background 300ms ease, backdrop-filter 300ms ease',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#F4ECE5',
    textDecoration: 'none',
    position: 'relative' as const,
  }

  return (
    <>
      {/* ── Desktop nav (≥lg) ───────────────────────────────── */}
      <nav style={navBase} className="hidden lg:block">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px 16px 64px',
          maxWidth: '1440px',
          margin: '0 auto',
          gap: '32px',
          transition: 'padding 200ms',
        }}>

          {/* Logo group */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <NaronaiMark size={32} color="#F4ECE5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: '#F4ECE5',
                fontWeight: 300,
                lineHeight: 1,
              }}>
                NARONAI
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '7px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(244,236,229,0.5)',
                lineHeight: 1,
              }}>
                Leave an Impression
              </span>
            </div>
          </Link>

          {/* Centre nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {NAV_LEFT.map((item) => (
              <NavLink key={item.href} href={item.href} style={linkStyle}>
                {item.label}
              </NavLink>
            ))}
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.href} href={item.href} style={linkStyle}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Icon buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexShrink: 0 }}>
            <IconButton href="/search"  label="Search"><Search size={16} /></IconButton>
            <IconButton href="/account" label="Account"><User size={16} /></IconButton>
            <button onClick={toggle} aria-label="Toggle theme" style={{ color: '#F4ECE5', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', opacity: 0.85, padding: 0 }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <CartButton count={cartCount} />
          </div>
        </div>
      </nav>

      {/* ── Mobile nav: StaggeredMenu (<lg) ────────────────────── */}
      <StaggeredMenu
        className="lg:hidden"
        isFixed
        position="right"
        items={MOBILE_NAV_ITEMS}
        colors={['#E8B8AA', '#7A2F4B']}
        accentColor="#C3A05B"
        menuButtonColor="#F4ECE5"
        openMenuButtonColor="#F4ECE5"
        logoNode={
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NaronaiMark size={26} color="#F4ECE5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F4ECE5', fontWeight: 300, lineHeight: 1 }}>
                NARONAI
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '6px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,236,229,0.5)', lineHeight: 1 }}>
                Leave an Impression
              </span>
            </div>
          </Link>
        }
        headerActions={<CartButton count={cartCount} />}
      />
    </>
  )
}

/* ── Sub-components ──────────────────────────────────────────── */

function NavLink({ href, style, children }: { href: string; style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <Link href={href} style={style} className="nav-link">
      {children}
    </Link>
  )
}

function IconButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} style={{
      color: '#F4ECE5',
      display: 'flex',
      transition: 'color 200ms, opacity 200ms',
      opacity: 0.85,
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
    >
      {children}
    </Link>
  )
}

function CartButton({ count }: { count: number }) {
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} style={{
      position: 'relative',
      color: '#F4ECE5',
      display: 'flex',
      opacity: 0.85,
      transition: 'opacity 200ms',
    }}>
      <ShoppingBag size={18} />
      {count > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-7px',
          background: 'var(--color-accent-gold)',
          color: '#2E1D1B',
          fontFamily: 'var(--font-ui)',
          fontSize: '8px',
          fontWeight: 600,
          width: '16px', height: '16px',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}

/* ── Brand mark SVG ─────────────────────────────────────────── */

function NaronaiMark({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.22)}
      viewBox="0 0 90 110"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M45,5 C24,5 5,24 5,43 C5,62 24,81 45,81 C40,78 35,72 33,64 C31,55 34,46 42,40 C52,34 62,26 60,14 C59,9 52,5 45,5Z" />
      <path d="M60,14 C73,10 81,20 82,34 C83,48 75,63 65,70 C71,56 72,38 60,14Z" opacity="0.78" />
      <path d="M65,70 C78,63 87,75 85,89 C83,100 77,108 67,109 C71,100 73,84 65,70Z" opacity="0.58" />
    </svg>
  )
}
