import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
