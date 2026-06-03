'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'

type Step = 'form' | 'sent'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setStep('sent')
  }

  if (step === 'sent') {
    return (
      <AuthShell>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(195,160,91,0.12)',
          border: '1px solid rgba(195,160,91,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '22px',
        }}>
          ✦
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 28px)',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 14px',
        }}>
          Check your inbox
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          lineHeight: 1.6,
          maxWidth: '300px',
          margin: '0 auto 28px',
        }}>
          If an account exists for <strong style={{ color: 'var(--color-text)' }}>{email}</strong>, you'll receive a reset link shortly.
        </p>
        <Link
          href="/auth/sign-in"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
          }}
        >
          Back to sign in
        </Link>
      </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
    <div style={{ width: '100%', maxWidth: '400px' }}>

      {/* Heading */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 3vw, 34px)',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
        }}>
          Reset password
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AuthField
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {error && (
          <p role="alert" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#e57373',
            margin: 0,
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? 'var(--color-border)' : '#7A2F4B',
            color: '#F4ECE5',
            border: 'none',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 200ms ease',
          }}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        marginTop: '28px',
      }}>
        <Link
          href="/auth/sign-in"
          style={{
            color: 'var(--color-text)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Back to sign in
        </Link>
      </p>
    </div>
    </AuthShell>
  )
}
