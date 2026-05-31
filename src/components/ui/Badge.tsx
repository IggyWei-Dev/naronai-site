import { cn } from '@/lib/utils'

type BadgeVariant = 'tier' | 'new' | 'sold-out'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  'tier':     { background: 'rgba(195,160,91,0.15)', color: 'var(--color-accent-gold)' },
  'new':      { background: 'rgba(122,47,75,0.15)',  color: 'var(--color-accent-primary)' },
  'sold-out': { background: 'var(--color-border-subtle)', color: 'var(--color-text-muted)' },
}

export function Badge({ variant = 'tier', children, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center', className)}
      style={{
        padding: '4px 12px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  )
}
