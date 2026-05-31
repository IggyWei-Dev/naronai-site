import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // follows OS preference per Design.md
  theme: {
    extend: {
      colors: {
        // Light mode tokens
        'bg-page':       'var(--color-bg-page)',
        'bg-surface':    'var(--color-bg-surface)',
        'bg-card':       'var(--color-bg-card)',
        'bg-elevated':   'var(--color-bg-elevated)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-medium': 'var(--color-border-medium)',
        'text-primary':  'var(--color-text-primary)',
        'text-secondary':'var(--color-text-secondary)',
        'text-muted':    'var(--color-text-muted)',
        'accent-primary':'var(--color-accent-primary)',
        'accent-secondary':'var(--color-accent-secondary)',
        'accent-gold':   'var(--color-accent-gold)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        ui:      ['var(--font-ui)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        sharp: '2px',
        sm:    '4px',
        md:    '8px',
        lg:    '12px',
        xl:    '16px',
      },
      boxShadow: {
        card:  '0 2px 16px rgba(46,29,27,0.08)',
        hover: '0 8px 32px rgba(46,29,27,0.14)',
        modal: '0 24px 64px rgba(46,29,27,0.22)',
      },
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out':    'cubic-bezier(0.45, 0, 0.55, 1)',
        'spring':    'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },
      transitionDuration: {
        '80':   '80ms',
        '200':  '200ms',
        '350':  '350ms',
        '600':  '600ms',
        '1200': '1200ms',
      },
      maxWidth: {
        content: '1440px',
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '24px',
        '2xl': '40px',
        '3xl': '64px',
        '4xl': '96px',
      },
    },
  },
  plugins: [],
}

export default config
