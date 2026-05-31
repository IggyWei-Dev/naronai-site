'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X, Heart, Home, Store } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

const NAV_LEFT  = [
  { label: 'Shop',         href: '/shop' },
  { label: 'Experiences',  href: '/experiences' },
  { label: 'Membership',   href: '/membership' },
]

const NAV_RIGHT = [
  { label: 'The Impact', href: '/impact' },
  { label: 'About Us',   href: '/about' },
]

export function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const cartCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '0.5px solid var(--color-border-subtle)',
    background: scrolled
      ? 'color-mix(in srgb, var(--color-bg-page) 85%, transparent)'
      : 'var(--color-bg-page)',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    transition: 'background 200ms, backdrop-filter 200ms, padding 200ms',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    position: 'relative' as const,
  }

  return (
    <>
      {/* ── Desktop Nav (≥1200px) ── */}
      <nav style={navStyle} className="hidden lg:block">
        <div
          className="max-w-content mx-auto padding-x"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: scrolled ? '12px 64px' : '20px 64px',
            transition: 'padding 200ms',
          }}
        >
          {/* Left links */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {NAV_LEFT.map((item) => (
              <NavLink key={item.href} href={item.href} style={linkStyle}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                fontWeight: 300,
              }}
            >
              NARONAI
            </span>
          </Link>

          {/* Right links + icons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '32px' }}>
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.href} href={item.href} style={linkStyle}>
                {item.label}
              </NavLink>
            ))}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: '8px' }}>
              <IconButton href="/search"    label="Search"><Search size={16} /></IconButton>
              <IconButton href="/account"   label="Account"><User size={16} /></IconButton>
              <CartButton count={cartCount} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Tablet / Mobile Nav (<1200px) ── */}
      <nav style={navStyle} className="lg:hidden">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}
          >
            <Menu size={20} />
          </button>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                fontWeight: 300,
              }}
            >
              NARONAI
            </span>
          </Link>

          <CartButton count={cartCount} />
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(46,29,27,0.7)',
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
                cursor: 'pointer', color: '#D7B2A5', marginBottom: '24px',
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

            <div style={{ marginTop: 'auto', display: 'flex', gap: '20px', paddingTop: '24px' }}>
              <IconButtonDark href="/search"  label="Search"><Search size={18} /></IconButtonDark>
              <IconButtonDark href="/account" label="Account"><User size={18} /></IconButtonDark>
              <IconButtonDark href="/wishlist" label="Wishlist"><Heart size={18} /></IconButtonDark>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Tab Bar (<768px) ── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--color-bg-page)',
          borderTop: '0.5px solid var(--color-accent-gold)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: '10px 0 max(10px, env(safe-area-inset-bottom))',
        }}
      >
        <BottomTab href="/"        label="Home">    <Home size={20} /></BottomTab>
        <BottomTab href="/shop"    label="Shop">    <Store size={20} /></BottomTab>
        {/* Centre logo icon */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--color-accent-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '-20px',
            boxShadow: '0 4px 16px rgba(195,160,91,0.4)',
          }}>
            <span style={{ color: '#2E1D1B', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 400 }}>N</span>
          </div>
        </Link>
        <BottomTab href="/wishlist" label="Wishlist"><Heart size={20} /></BottomTab>
        <BottomTab href="/account"  label="Account"><User size={20} /></BottomTab>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

/* ── Sub-components ── */

function NavLink({ href, style, children }: { href: string; style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <Link href={href} style={style} className="nav-link">
      {children}
      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 100%; height: 1px;
          background: var(--color-accent-gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover::after { transform: scaleX(1); }
      `}</style>
    </Link>
  )
}

function IconButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} style={{ color: 'var(--color-text-primary)', display: 'flex', transition: 'color 200ms' }}>
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
    <Link href="/cart" aria-label={`Cart, ${count} items`} style={{ position: 'relative', color: 'var(--color-text-primary)', display: 'flex' }}>
      <ShoppingBag size={18} />
      {count > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-6px',
          background: 'var(--color-accent-gold)',
          color: '#2E1D1B',
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
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
    <Link
      href={href}
      aria-label={label}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
        color: 'var(--color-text-muted)',
        textDecoration: 'none',
        fontFamily: 'var(--font-ui)',
        fontSize: '8px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {children}
      <span>{label}</span>
    </Link>
  )
}
