import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { NavigationLoader } from '@/components/layout/NavigationLoader'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ui',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
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
      className={`${cormorant.variable} ${montserrat.variable} ${inter.variable}`}
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
