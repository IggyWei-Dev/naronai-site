'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthField } from '@/components/auth/AuthField'
import { AuthShell } from '@/components/auth/AuthShell'

type Step = 'form' | 'verify'

export default function SignUpPage() {
  const [step, setStep] = useState<Step>('form')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const phoneFormatted = phone ? `+234${phone.replace(/^0/, '').replace(/\D/g, '')}` : undefined

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phoneFormatted,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setStep('verify')
  }

  if (step === 'verify') {
    return (
      <AuthShell imageSrc="/assets/images/auth/sign-up-panel.png" imageAlt="Naronai — luxury hair">
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
          We sent a confirmation link to <strong style={{ color: 'var(--color-text)' }}>{email}</strong>. Open it to activate your account.
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
    <AuthShell imageSrc="/assets/images/auth/sign-up-panel.png" imageAlt="Naronai — luxury hair">
    <div style={{ width: '100%', maxWidth: '400px' }}>

      {/* Heading */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 3vw, 34px)',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
        }}>
          Create an account
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-sub)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Join Naronai and enter the room changed.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthField
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />

        {/* Phone field with +234 prefix */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: '#B9939D',
            marginBottom: '8px',
          }}>
            Phone number <span style={{ opacity: 0.6 }}>(optional)</span>
          </label>
          <div style={{ position: 'relative', display: 'flex' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              padding: '13px 12px',
              background: 'rgba(195,160,91,0.07)',
              border: '1px solid var(--color-border)',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}>
              +234
            </span>
            <input
              type="tel"
              autoComplete="tel-national"
              placeholder="8012345678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '0 8px 8px 0',
                padding: '13px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--color-text)',
                outline: 'none',
                minWidth: 0,
              }}
            />
          </div>
        </div>

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
            transition: 'background 200ms ease',
            marginTop: '4px',
          }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        {/* Terms */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
          margin: 0,
        }}>
          By creating an account you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--color-text-sub)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
            Terms of Service
          </Link>
        </p>
      </form>

      {/* Sign in link */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        marginTop: '28px',
      }}>
        Already have an account?{' '}
        <Link
          href="/auth/sign-in"
          style={{
            color: 'var(--color-text)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Sign in
        </Link>
      </p>
    </div>
    </AuthShell>
  )
}
