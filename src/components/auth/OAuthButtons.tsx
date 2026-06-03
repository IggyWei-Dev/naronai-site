'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Provider = 'google' | 'facebook'

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M15.68 8.182c0-.567-.05-1.113-.143-1.636H8v3.094h4.302a3.677 3.677 0 0 1-1.595 2.41v2.003h2.582C14.811 12.59 15.68 10.54 15.68 8.182z" fill="#4285F4"/>
      <path d="M8 16c2.16 0 3.972-.716 5.295-1.947l-2.582-2.003c-.716.48-1.632.764-2.713.764-2.087 0-3.856-1.41-4.486-3.305H.841v2.067A8 8 0 0 0 8 16z" fill="#34A853"/>
      <path d="M3.514 9.509A4.806 4.806 0 0 1 3.263 8c0-.524.09-1.034.251-1.51V4.424H.841A8 8 0 0 0 0 8c0 1.29.309 2.51.841 3.576l2.673-2.067z" fill="#FBBC05"/>
      <path d="M8 3.185c1.177 0 2.231.404 3.063 1.198l2.297-2.297C11.97.792 10.157 0 8 0A8 8 0 0 0 .841 4.424L3.514 6.49C4.144 4.595 5.913 3.185 8 3.185z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M16 8A8 8 0 1 0 6.75 15.903V10.25H4.719V8H6.75V6.247c0-2.003 1.194-3.109 3.02-3.109.875 0 1.79.156 1.79.156v1.966h-1.008c-.993 0-1.303.617-1.303 1.25V8h2.219l-.355 2.25H9.25v5.653A8.003 8.003 0 0 0 16 8z" fill="#1877F2"/>
    </svg>
  )
}

const PROVIDERS: { id: Provider; label: string; Logo: () => JSX.Element }[] = [
  { id: 'google',   label: 'Google',   Logo: GoogleLogo },
  { id: 'facebook', label: 'Facebook', Logo: FacebookLogo },
]

export function OAuthButtons({ verb = 'Continue' }: { verb?: string }) {
  const [pending, setPending] = useState<Provider | null>(null)

  async function handleOAuth(provider: Provider) {
    setPending(provider)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setPending(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {PROVIDERS.map(({ id, label, Logo }) => (
        <button
          key={id}
          type="button"
          disabled={pending !== null}
          onClick={() => handleOAuth(id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 20px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            cursor: pending !== null ? 'not-allowed' : 'pointer',
            opacity: pending !== null && pending !== id ? 0.55 : 1,
            transition: 'border-color 180ms ease, opacity 180ms ease',
          }}
          onMouseEnter={e => { if (!pending) e.currentTarget.style.borderColor = 'var(--color-text-muted)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          <Logo />
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'var(--color-text)',
          }}>
            {pending === id ? 'Redirecting...' : `${verb} with ${label}`}
          </span>
        </button>
      ))}
    </div>
  )
}
