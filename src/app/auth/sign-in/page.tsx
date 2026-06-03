'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/account')
  }

  return (
    <AuthShell
      imageSrc="/assets/images/auth/sign-in-panel.png"
      imageAlt="Naronai — elegant hair"
    >
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
          Welcome back
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Sign in to your Naronai account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthField
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <AuthField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
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

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: '-6px' }}>
          <Link
            href="/auth/forgot-password"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
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

        {/* Submit */}
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
            transition: 'background 200ms ease, opacity 200ms ease',
            marginTop: '4px',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {/* Sign up link */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        marginTop: '28px',
      }}>
        New to Naronai?{' '}
        <Link
          href="/auth/sign-up"
          style={{
            color: 'var(--color-text)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Create an account
        </Link>
      </p>
    </div>
    </AuthShell>
  )
}
