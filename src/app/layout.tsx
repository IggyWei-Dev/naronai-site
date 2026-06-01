import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

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
        <AnnouncementBar message="Free nationwide delivery over ₦150,000 · Book your private consultation" />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              border: '0.5px solid var(--color-border-medium)',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              letterSpacing: '0.06em',
            },
          }}
        />
      </body>
    </html>
  )
}
