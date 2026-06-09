'use client'

import { forwardRef, useState } from 'react'

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  suffix?: React.ReactNode
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ label, error, hint, suffix, id, style, onFocus, onBlur, ...props }, ref) {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    const [focused, setFocused] = useState(false)

    return (
      <div>
        <label
          htmlFor={fieldId}
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: error ? 'var(--color-error)' : 'var(--color-text-sub)',
            marginBottom: '8px',
          }}
        >
          {label}
        </label>

        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            id={fieldId}
            onFocus={e => { setFocused(true); onFocus?.(e) }}
            onBlur={e => { setFocused(false); onBlur?.(e) }}
            style={{
              width: '100%',
              background: 'transparent',
              border: `1px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-gold)' : 'var(--color-border)'}`,
              borderRadius: '8px',
              padding: suffix ? '13px 44px 13px 16px' : '13px 16px',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'border-color 180ms ease',
              boxSizing: 'border-box' as const,
              ...style,
            }}
            {...props}
          />
          {suffix && (
            <div style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}>
              {suffix}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p
            role={error ? 'alert' : undefined}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: error ? 'var(--color-error)' : 'var(--color-text-muted)',
              marginTop: '6px',
              lineHeight: 1.4,
            }}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    )
  }
)
