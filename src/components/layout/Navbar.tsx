'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Sun, Moon } from 'lucide-react'
import { useCartStore }   from '@/lib/store/cartStore'
import { useSearchStore } from '@/lib/store/searchStore'
import { useTheme }       from '@/lib/hooks/useTheme'
import { StaggeredMenu } from '@/components/ui/StaggeredMenu'
import { createClient } from '@/lib/supabase/client'

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
  const [isSignedIn, setIsSignedIn] = useState(false)
  const cartCount   = useCartStore((s) => s.itemCount())
  const openSearch  = useSearchStore(s => s.openSearch)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(!!data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

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

  const inkColor = theme === 'light' ? '#7A2F4B' : '#F4ECE5'

  const navBase: React.CSSProperties = {
    position: 'fixed',
    top: barOffset,
    left: 0,
    right: 0,
    zIndex: 50,
    background: atTop
      ? theme === 'light' ? 'rgba(46,29,27,0.18)' : 'transparent'
      : 'rgba(46,29,27,0.35)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'background 300ms ease, color 300ms ease',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: inkColor,
    textDecoration: 'none',
    position: 'relative' as const,
    transition: 'color 300ms ease',
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
            <NaronaiMark size={32} color={inkColor} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: inkColor,
                fontWeight: 300,
                lineHeight: 1,
                transition: 'color 300ms ease',
              }}>
                NARONAI
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '7px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: theme === 'light' ? 'rgba(122,47,75,0.55)' : 'rgba(244,236,229,0.5)',
                lineHeight: 1,
                transition: 'color 300ms ease',
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
            <button onClick={openSearch} aria-label="Open search" style={{ color: inkColor, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', opacity: 0.85, padding: 0, transition: 'color 300ms ease, opacity 200ms' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}><Search size={16} /></button>
            <IconButton href={isSignedIn ? '/account' : '/auth/sign-in'} label="Account" color={inkColor}><User size={16} /></IconButton>
            <button onClick={toggle} aria-label="Toggle theme" style={{ color: inkColor, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', opacity: 0.85, padding: 0, transition: 'color 300ms ease' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <CartButton count={cartCount} color={inkColor} />
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
        menuButtonColor={inkColor}
        openMenuButtonColor={inkColor}
        logoNode={
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NaronaiMark size={26} color={inkColor} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: inkColor, fontWeight: 300, lineHeight: 1 }}>
                NARONAI
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '6px', letterSpacing: '0.2em', textTransform: 'uppercase', color: theme === 'light' ? 'rgba(122,47,75,0.55)' : 'rgba(244,236,229,0.5)', lineHeight: 1 }}>
                Leave an Impression
              </span>
            </div>
          </Link>
        }
        headerActions={<CartButton count={cartCount} color={inkColor} />}
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

function IconButton({ href, label, color, children }: { href: string; label: string; color: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} style={{
      color,
      display: 'flex',
      transition: 'color 300ms ease, opacity 200ms',
      opacity: 0.85,
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
    >
      {children}
    </Link>
  )
}

function CartButton({ count, color }: { count: number; color: string }) {
  const openCart = useCartStore(s => s.openCart)
  return (
    <button
      onClick={openCart}
      aria-label={`Open bag, ${count} items`}
      style={{
        position: 'relative',
        color,
        display: 'flex',
        opacity: 0.85,
        transition: 'color 300ms ease, opacity 200ms',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
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
    </button>
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
