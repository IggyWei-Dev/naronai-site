'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, User, Heart, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { OrdersSection } from '@/components/account/OrdersSection'
import { ProfileSection } from '@/components/account/ProfileSection'
import { WishlistSection } from '@/components/account/WishlistSection'
import type { WishlistEntry } from '@/components/account/WishlistSection'
import type { ProfileRow, OrderRow } from '@/lib/supabase/types'

type Section = 'orders' | 'wishlist' | 'profile'

interface AccountViewProps {
  user: { id: string; email: string }
  profile: ProfileRow | null
  orders: OrderRow[]
  wishlist: WishlistEntry[]
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

export function AccountView({ user, profile, orders, wishlist }: AccountViewProps) {
  const [section, setSection] = useState<Section>('orders')
  const router = useRouter()
  const initials = getInitials(profile?.full_name ?? null, user.email)
  const displayName = profile?.full_name ?? user.email.split('@')[0]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'orders',   label: 'Orders',   icon: <ShoppingBag size={14} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={14} /> },
    { id: 'profile',  label: 'Profile',  icon: <User size={14} /> },
  ]

  return (
    <div style={{
      display: 'flex',
      minHeight: '100dvh',
    }}>

      {/* ── Sidebar (lg+) ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: '256px',
          flexShrink: 0,
          background: '#2E1D1B',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(40px, 6vh, 72px) 32px',
          paddingTop: '136px', // 120px navbar offset + 16px
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflowY: 'auto',
        }}
      >
        {/* Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            {/* Avatar circle */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(195,160,91,0.15)',
              border: '0.5px solid rgba(195,160,91,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              letterSpacing: '0.08em',
              color: '#C3A05B',
              marginBottom: '16px',
            }}>
              {initials}
            </div>

            {/* Name */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F7F2EC',
              margin: '0 0 4px',
              lineHeight: 1.2,
            }}>
              {displayName}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'rgba(244,236,229,0.4)',
              margin: 0,
            }}>
              {user.email}
            </p>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: section === item.id ? 'rgba(195,160,91,0.1)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: section === item.id ? '#C3A05B' : 'rgba(244,236,229,0.5)',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 180ms ease, color 180ms ease',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(244,236,229,0.3)',
            width: '100%',
            textAlign: 'left',
            transition: 'color 180ms ease',
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </aside>

      {/* ── Mobile tab strip ──────────────────────────────────── */}
      <div
        className="flex lg:hidden"
        style={{
          position: 'fixed',
          top: '120px',
          left: 0,
          right: 0,
          zIndex: 10,
          background: '#2E1D1B',
          borderBottom: '0.5px solid rgba(195,160,91,0.12)',
          padding: '0 20px',
          gap: '0',
        }}
      >
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 0',
              background: 'none',
              border: 'none',
              borderBottom: section === item.id ? '1.5px solid #C3A05B' : '1.5px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: '8px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: section === item.id ? '#C3A05B' : 'rgba(244,236,229,0.4)',
              transition: 'color 180ms ease, border-color 180ms ease',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 16px',
            background: 'none',
            border: 'none',
            borderBottom: '1.5px solid transparent',
            cursor: 'pointer',
            color: 'rgba(244,236,229,0.3)',
          }}
          aria-label="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        background: 'var(--color-bg)',
        paddingTop: 'clamp(176px, 20vh, 200px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)',
        paddingLeft: 'clamp(24px, 5vw, 72px)',
        paddingRight: 'clamp(24px, 5vw, 72px)',
      }}>
        {/* Section header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            width: '32px',
            height: '0.5px',
            background: 'rgba(195,160,91,0.3)',
            marginBottom: '16px',
          }} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 300,
            color: 'var(--color-text)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {{ orders: 'Orders', wishlist: 'Wishlist', profile: 'Profile' }[section]}
          </h1>
        </div>

        {/* Section content */}
        {section === 'orders'   && <OrdersSection orders={orders} />}
        {section === 'wishlist' && <WishlistSection entries={wishlist} />}
        {section === 'profile'  && <ProfileSection profile={profile} email={user.email} />}
      </main>
    </div>
  )
}
