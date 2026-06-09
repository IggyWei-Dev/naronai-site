import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import { NavigationLoader } from '@/components/layout/NavigationLoader'

/* ── 01 Primary Display — Canela stand-in ─────────────────────────
   Cormorant Garamond: elegant transitional serif, closest free match
   to Canela (Commercial Type). Swap src when licensed files arrive.  */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/* ── 02 Body — Avenir Next Regular stand-in ───────────────────────
   DM Sans: geometric humanist sans, proportions closest to Avenir Next */
const dmSansBody = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

/* ── 03 Navigation & UI — Avenir Next Medium stand-in ────────────── */
const dmSansUI = DM_Sans({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-ui',
  display: 'swap',
})

/* ── 04 Signature Script — Brittany Signature stand-in ───────────── */
const satisfy = localFont({
  src: '../../public/Satisfy-Regular.ttf',
  variable: '--font-signature',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Naronai — Leave an Impression',
    template: '%s | Naronai',
  },
  description: 'Luxury human hair wigs & beauty. Leave an impression.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://naronai.com'),
  openGraph: {
    siteName: 'Naronai',
    locale: 'en_NG',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSansBody.variable} ${dmSansUI.variable} ${satisfy.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){var t=localStorage.getItem('naronai-theme');if(t)document.documentElement.setAttribute('data-theme',t)})()
        `}} />
      </head>
      <body>
        {children}
        <NavigationLoader />
      </body>
    </html>
  )
}
