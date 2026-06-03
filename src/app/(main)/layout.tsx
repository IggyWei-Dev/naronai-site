import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar }           from '@/components/layout/Navbar'
import { Footer }           from '@/components/layout/Footer'
import { RevealObserver }   from '@/components/layout/RevealObserver'
import { Toaster }          from 'react-hot-toast'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar message="Free nationwide delivery over ₦150,000 · Book your private consultation" />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <RevealObserver />
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
    </>
  )
}
