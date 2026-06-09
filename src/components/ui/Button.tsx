import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost' | 'gold' | 'text'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?:    ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-accent-primary)] text-[var(--color-on-dark)]
    hover:brightness-[1.08]
    border-transparent
  `,
  ghost: `
    bg-transparent border border-[var(--color-accent-primary)]
    text-[var(--color-accent-primary)]
    hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-on-dark)]
    transition-all duration-200
  `,
  gold: `
    bg-[var(--color-accent-gold)] text-[var(--color-midnight)]
    hover:brightness-105
  `,
  text: `
    bg-transparent text-[var(--color-accent-gold)] underline-offset-[3px]
    after:content-['_→']
    hover:[letter-spacing:0.1em]
    transition-all duration-200
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-7 py-3 text-[11px]',
  lg: 'px-9 py-4 text-[12px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-ui tracking-[0.12em] uppercase',
          'rounded-sharp',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
