'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthField } from '@/components/auth/AuthField'
import type { ProfileRow, Database } from '@/lib/supabase/types'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

interface ProfileSectionProps {
  profile: ProfileRow | null
  email: string
}

export function ProfileSection({ profile, email }: ProfileSectionProps) {
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone?.replace(/^\+234/, '') ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const supabase = createClient()
    const phoneFormatted = phone
      ? `+234${phone.replace(/^0/, '').replace(/\D/g, '')}`
      : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateErr } = await (supabase.from('profiles') as any)
      .update({ full_name: fullName || null, phone: phoneFormatted })
      .eq('id', profile?.id ?? '')

    setSaving(false)

    if (updateErr) {
      setError(updateErr.message)
      return
    }

    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleCancel() {
    setFullName(profile?.full_name ?? '')
    setPhone(profile?.phone?.replace(/^\+234/, '') ?? '')
    setError('')
    setEditing(false)
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Email — read-only */}
          <div>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B9939D',
              marginBottom: '8px',
              margin: '0 0 8px',
            }}>
              Email address
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-sub)',
              margin: 0,
              padding: '13px 0',
              borderBottom: '0.5px solid var(--color-border)',
            }}>
              {email}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginTop: '6px',
            }}>
              Contact support to change your email address.
            </p>
          </div>

          {/* Full name */}
          {editing ? (
            <AuthField
              label="Full name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          ) : (
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#B9939D',
                margin: '0 0 8px',
              }}>
                Full name
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: fullName ? 'var(--color-text)' : 'var(--color-text-muted)',
                margin: 0,
                padding: '13px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}>
                {fullName || 'Not set'}
              </p>
            </div>
          )}

          {/* Phone */}
          {editing ? (
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
          ) : (
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#B9939D',
                margin: '0 0 8px',
              }}>
                Phone number
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: phone ? 'var(--color-text)' : 'var(--color-text-muted)',
                margin: 0,
                padding: '13px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}>
                {phone ? `+234 ${phone}` : 'Not set'}
              </p>
            </div>
          )}

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

          {saved && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: '#7aab7a',
              margin: 0,
            }}>
              Profile updated.
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            {editing ? (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '12px 28px',
                    background: saving ? 'var(--color-border)' : '#7A2F4B',
                    color: '#F4ECE5',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'background 200ms ease',
                  }}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '12px 20px',
                    background: 'none',
                    color: 'var(--color-text-muted)',
                    border: '0.5px solid var(--color-border)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  padding: '12px 28px',
                  background: 'none',
                  color: 'var(--color-text)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'border-color 180ms ease',
                }}
              >
                Edit profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
