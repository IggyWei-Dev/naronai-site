'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'

type PageState = 'idle' | 'loading' | 'success' | 'invalid'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('idle')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Supabase sets the session from the URL hash when the page mounts
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setPageState('invalid')
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setPageState('loading')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setPageState('idle')
      return
    }

    setPageState('success')
    setTimeout(() => router.push('/account'), 2000)
  }

  if (pageState === 'invalid') {
    return (
      <AuthShell>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 28px)',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 14px',
        }}>
          Link expired
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          lineHeight: 1.6,
          margin: '0 0 28px',
        }}>
          This reset link is invalid or has expired. Request a new one below.
        </p>
        <Link
          href="/auth/forgot-password"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#7A2F4B',
            color: '#F4ECE5',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Request new link
        </Link>
      </div>
      </AuthShell>
    )
  }

  if (pageState === 'success') {
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
          Password updated
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          lineHeight: 1.6,
        }}>
          Redirecting to your account…
        </p>
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
          New password
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthField
          label="New password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          hint="At least 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <AuthField
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
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
          disabled={pageState === 'loading'}
          style={{
            width: '100%',
            padding: '14px',
            background: pageState === 'loading' ? 'var(--color-border)' : '#7A2F4B',
            color: '#F4ECE5',
            border: 'none',
            borderRadius: '2px',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: pageState === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'background 200ms ease',
            marginTop: '4px',
          }}
        >
          {pageState === 'loading' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
    </AuthShell>
  )
}
