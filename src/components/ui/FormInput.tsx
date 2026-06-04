'use client'

import { forwardRef } from 'react'
import { motion }     from 'framer-motion'
import { cn }         from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent',
            'border border-[var(--color-border-subtle)]',
            'rounded-md px-4 py-3',
            'font-body text-[15px] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:border-[var(--color-accent-gold)]',
            'focus:shadow-[0_0_0_3px_rgba(195,160,91,0.12)]',
            'transition-[border-color,box-shadow] duration-200',
            error && 'border-red-400',
            className,
          )}
          {...props}
        />
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#e57373' }}
          >
            {error}
          </motion.span>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent resize-y min-h-[120px]',
            'border border-[var(--color-border-subtle)]',
            'rounded-md px-4 py-3',
            'font-body text-[15px] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:border-[var(--color-accent-gold)]',
            'focus:shadow-[0_0_0_3px_rgba(195,160,91,0.12)]',
            'transition-[border-color,box-shadow] duration-200',
            error && 'border-red-400',
            className,
          )}
          {...props}
        />
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#e57373' }}
          >
            {error}
          </motion.span>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
