'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Signature } from '@/components/ui/signature'

const CYCLE_MS = 3800
const FADE_S   = 0.45

export function NavigationLoader() {
  const pathname       = usePathname()
  const prevPathRef    = useRef(pathname)
  const mountedRef     = useRef(false)
  const cycleStartRef  = useRef(0)
  const hideTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [mounted, setMounted] = useState(false)
  const [cycle,   setCycle]   = useState(0)

  // Show on any internal link click — fires before navigation
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return
      const dest = href.split('?')[0].split('#')[0]
      const curr = pathname.split('?')[0]
      if (dest === curr) return
      if (dest.startsWith('/admin') || curr.startsWith('/admin')) return

      // Cancel any in-flight hide timer (user navigated again mid-load)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

      mountedRef.current  = true
      cycleStartRef.current = Date.now()
      setMounted(true)
      setCycle(n => n + 1)
    }
    document.addEventListener('click', onLinkClick, true)
    return () => document.removeEventListener('click', onLinkClick, true)
  }, [pathname])

  // Keep the signature looping while the overlay is mounted
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => {
      cycleStartRef.current = Date.now()
      setCycle(n => n + 1)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [mounted])

  // When the page finishes loading, wait until the current cycle ends then fade out
  useEffect(() => {
    if (pathname === prevPathRef.current) return
    prevPathRef.current = pathname
    if (!mountedRef.current) return

    const elapsed   = Date.now() - cycleStartRef.current
    const remaining = Math.max(0, CYCLE_MS - elapsed)

    hideTimerRef.current = setTimeout(() => {
      mountedRef.current = false
      setMounted(false)
    }, remaining)

    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  }, [pathname])

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          key="nav-loader"
          role="status"
          aria-label="Loading page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div aria-hidden="true" className="blush-orb-bg">
            <div
              className="blush-orb"
              style={{
                width: '65%',
                paddingTop: '65%',
                top: '-20%',
                left: '-15%',
                background: 'radial-gradient(circle, var(--loader-orb-a) 0%, transparent 68%)',
                animation: 'blush-orb-drift-a 28s ease-in-out infinite',
                animationDelay: '-6s',
              }}
            />
            <div
              className="blush-orb"
              style={{
                width: '50%',
                paddingTop: '50%',
                bottom: '-18%',
                right: '-10%',
                background: 'radial-gradient(circle, var(--loader-orb-b) 0%, transparent 68%)',
                animation: 'blush-orb-drift-b 36s ease-in-out infinite',
                animationDelay: '-14s',
              }}
            />
          </div>

          <span style={{ color: 'var(--color-primary)' }}>
            <Signature
              key={cycle}
              text="Naronai"
              color="currentColor"
              fontSize={26}
              strokeWidth={0.8}
              duration={1.4}
              delay={0}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
