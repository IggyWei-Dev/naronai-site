'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X, Heart, Home, Store, Sun, Moon } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useTheme } from '@/lib/hooks/useTheme'

const NAV_LEFT  = [
  { label: 'Shop',         href: '/shop' },
  { label: 'Experiences',  href: '/experiences' },
  { label: 'Membership',   href: '/membership' },
]

const NAV_RIGHT = [
  { label: 'The Naronai Impact', href: '/impact' },
  { label: 'About Us',   href: '/about' },
]

const ANNOUNCEMENT_BAR_HEIGHT = 36

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [barOffset,  setBarOffset]  = useState(ANNOUNCEMENT_BAR_HEIGHT)
  const [hidden,     setHidden]     = useState(false)
  const lastScrollY = useRef(0)
  const cartCount = useCartStore((s) => s.itemCount())
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  /* Listen for announcement bar dismissal */
  useEffect(() => {
    const handler = () => setBarOffset(0)
    window.addEventListener('announcement-dismissed', handler)
    return () => window.removeEventListener('announcement-dismissed', handler)
  }, [])

  /* Hide on scroll down, reveal on scroll up */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastScrollY.current && y > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Reveal when mouse approaches top of screen */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) setHidden(false)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const navBase: React.CSSProperties = {
    position: 'fixed',
    top: barOffset,
    left: 0,
    right: 0,
    zIndex: 50,
    background: 'transparent',
    transform: hidden ? 'translateY(-110%)' : 'translateY(0)',
    transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
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
      {/* ── Desktop nav (≥1200px) ───────────────────────────────── */}
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

          {/* Logo group ─── mark + wordmark + tagline */}
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

      {/* ── Tablet / Mobile nav (<1200px) ──────────────────────── */}
      <nav style={navBase} className="lg:hidden">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
        }}>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F4ECE5', display: 'flex' }}
          >
            <Menu size={20} />
          </button>

          {/* Centred logo on mobile */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <NaronaiMark size={28} color="#F4ECE5" />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#F4ECE5',
              fontWeight: 300,
              lineHeight: 1,
            }}>
              NARONAI
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '6.5px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(244,236,229,0.5)',
              lineHeight: 1,
            }}>
              Leave an Impression
            </span>
          </Link>

          <CartButton count={cartCount} />
        </div>
      </nav>

      {/* ── Side drawer ─────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(46,29,27,0.72)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              width: 'min(80vw, 360px)',
              background: '#2E1D1B',
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              animation: 'slideInRight 350ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              style={{
                alignSelf: 'flex-end', background: 'none', border: 'none',
                cursor: 'pointer', color: '#D7B2A5', marginBottom: '24px', display: 'flex',
              }}
            >
              <X size={20} />
            </button>

            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  fontWeight: 300,
                  color: '#F4ECE5',
                  textDecoration: 'none',
                  padding: '10px 0',
                  borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ marginTop: 'auto', display: 'flex', gap: '20px', paddingTop: '24px', alignItems: 'center' }}>
              <IconButtonDark href="/search"  label="Search"><Search size={18} /></IconButtonDark>
              <IconButtonDark href="/account" label="Account"><User size={18} /></IconButtonDark>
              <IconButtonDark href="/wishlist" label="Wishlist"><Heart size={18} /></IconButtonDark>
              <button onClick={toggle} aria-label="Toggle theme" style={{ color: '#D7B2A5', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom tab bar (<768px) ─────────────────────── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--color-bg-page)',
          borderTop: '0.5px solid var(--color-accent-gold)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: 'max(10px, env(safe-area-inset-bottom, 10px)) 0 max(10px, env(safe-area-inset-bottom, 10px))',
        }}
      >
        <BottomTab href="/"        label="Home">    <Home size={20} /></BottomTab>
        <BottomTab href="/shop"    label="Shop">    <Store size={20} /></BottomTab>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--color-accent-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '-22px',
            boxShadow: '0 4px 16px rgba(195,160,91,0.4)',
          }}>
            <NaronaiMark size={24} color="#2E1D1B" />
          </div>
        </Link>
        <BottomTab href="/wishlist" label="Wishlist"><Heart size={20} /></BottomTab>
        <BottomTab href="/account"  label="Account"><User size={20} /></BottomTab>
      </div>

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

function IconButtonDark({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} style={{ color: '#D7B2A5', display: 'flex' }}>
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

function BottomTab({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
      color: 'var(--color-text-muted)',
      textDecoration: 'none',
      fontFamily: 'var(--font-ui)',
      fontSize: '8px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}>
      {children}
      <span>{label}</span>
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
      {/* Crescent + face profile silhouette */}
      <path d="M45,5 C24,5 5,24 5,43 C5,62 24,81 45,81 C40,78 35,72 33,64 C31,55 34,46 42,40 C52,34 62,26 60,14 C59,9 52,5 45,5Z" />
      {/* Upper hair strand */}
      <path d="M60,14 C73,10 81,20 82,34 C83,48 75,63 65,70 C71,56 72,38 60,14Z" opacity="0.78" />
      {/* Lower hair strand */}
      <path d="M65,70 C78,63 87,75 85,89 C83,100 77,108 67,109 C71,100 73,84 65,70Z" opacity="0.58" />
    </svg>
  )
}
