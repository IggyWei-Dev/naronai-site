'use client'

import React, { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import './StaggeredMenu.css'

export interface StaggeredMenuItem {
  label: string
  ariaLabel?: string
  link: string
}

export interface StaggeredMenuSocialItem {
  label: string
  link: string
}

interface StaggeredMenuProps {
  position?: 'left' | 'right'
  colors?: string[]
  items?: StaggeredMenuItem[]
  socialItems?: StaggeredMenuSocialItem[]
  displaySocials?: boolean
  displayItemNumbering?: boolean
  className?: string
  logoNode?: ReactNode
  logoUrl?: string
  menuButtonColor?: string
  openMenuButtonColor?: string
  accentColor?: string
  changeMenuColorOnOpen?: boolean
  isFixed?: boolean
  closeOnClickAway?: boolean
  headerActions?: ReactNode
  topOffset?: number
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

export function StaggeredMenu({
  position = 'right',
  colors = ['var(--color-primary)', 'var(--color-primary)'],
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  className,
  logoNode,
  logoUrl,
  menuButtonColor = 'var(--color-on-dark)',
  openMenuButtonColor = 'var(--color-on-dark)',
  accentColor = 'var(--color-gold)',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  headerActions,
  topOffset = 0,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef<HTMLElement>(null)
  const preLayersRef = useRef<HTMLDivElement>(null)
  const preLayerElsRef = useRef<HTMLElement[]>([])
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)
  const iconTlRef = useRef<gsap.core.Timeline | null>(null)
  const colorTweenRef = useRef<gsap.core.Tween | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const busyRef = useRef(false)
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      if (!panel) return

      let preLayers: HTMLElement[] = []
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll<HTMLElement>('.sm-prelayer'))
      }
      preLayerElsRef.current = preLayers

      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 })
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 })

      // Hamburger initial state
      if (line1Ref.current) gsap.set(line1Ref.current, { transformOrigin: 'center', y: 0, rotate: 0 })
      if (line2Ref.current) gsap.set(line2Ref.current, { transformOrigin: 'center', scaleX: 1, opacity: 1 })
      if (line3Ref.current) gsap.set(line3Ref.current, { transformOrigin: 'center', y: 0, rotate: 0 })

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })
    return () => ctx.revert()
  }, [menuButtonColor, position])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    closeTweenRef.current = null
    itemEntranceTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'))
    const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title')
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>('.sm-socials-link'))

    const offscreen = position === 'left' ? -100 : 100
    const layerStates = layers.map(el => ({ el, start: offscreen }))

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0)
    const panelDuration = 0.65

    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime)

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart)
      if (numberEls.length) {
        tl.to(numberEls, { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } }, itemsStart + 0.1)
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart)
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
        }, socialsStart + 0.04)
      }
    }

    openTlRef.current = tl
    return tl
  }, [position])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    itemEntranceTweenRef.current?.kill()

    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    closeTweenRef.current?.kill()
    const offscreen = position === 'left' ? -100 : 100
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'))
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        const numberEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'))
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
        const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title')
        const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>('.sm-socials-link'))
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })
        busyRef.current = false
      },
    })
  }, [position])

  const animateIcon = useCallback((opening: boolean) => {
    const l1 = line1Ref.current
    const l2 = line2Ref.current
    const l3 = line3Ref.current
    if (!l1 || !l2 || !l3) return

    iconTlRef.current?.kill()
    const tl = gsap.timeline()
    if (opening) {
      // Hamburger → X
      tl.to(l2, { scaleX: 0, opacity: 0, duration: 0.18, ease: 'power2.in' }, 0)
      tl.to(l1, { y: 6, duration: 0.22, ease: 'power2.inOut' }, 0)
      tl.to(l3, { y: -6, duration: 0.22, ease: 'power2.inOut' }, 0)
      tl.to(l1, { rotate: 45, duration: 0.3, ease: 'power3.out' }, 0.2)
      tl.to(l3, { rotate: -45, duration: 0.3, ease: 'power3.out' }, 0.2)
    } else {
      // X → Hamburger
      tl.to(l1, { rotate: 0, y: 0, duration: 0.3, ease: 'power3.out' }, 0)
      tl.to(l3, { rotate: 0, y: 0, duration: 0.3, ease: 'power3.out' }, 0)
      tl.to(l2, { scaleX: 1, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.12)
    }
    iconTlRef.current = tl
  }, [])

  const animateColor = useCallback((opening: boolean) => {
    const btn = toggleBtnRef.current
    if (!btn) return
    colorTweenRef.current?.kill()
    if (changeMenuColorOnOpen) {
      colorTweenRef.current = gsap.to(btn, {
        color: opening ? openMenuButtonColor : menuButtonColor,
        delay: 0.18, duration: 0.3, ease: 'power2.out',
      })
    } else {
      gsap.set(btn, { color: menuButtonColor })
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen])

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      gsap.set(toggleBtnRef.current, {
        color: changeMenuColorOnOpen
          ? (openRef.current ? openMenuButtonColor : menuButtonColor)
          : menuButtonColor,
      })
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    if (target) { onMenuOpen?.(); playOpen() }
    else { onMenuClose?.(); playClose() }
    animateIcon(target)
    animateColor(target)
  }, [playOpen, playClose, animateIcon, animateColor, onMenuOpen, onMenuClose])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    onMenuClose?.()
    playClose()
    animateIcon(false)
    animateColor(false)
  }, [playClose, animateIcon, animateColor, onMenuClose])

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(event.target as Node)
      ) closeMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickAway, open, closeMenu])

  const prelayerColors = (() => {
    const raw = colors.length ? colors.slice(0, 4) : ['var(--color-midnight)', '#3A1C28']
    const arr = [...raw]
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1)
    return arr
  })()

  return (
    <div
      className={`staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''}${className ? ' ' + className : ''}`}
      style={{
        ...(accentColor ? { '--sm-accent': accentColor } : {}),
        ...(isFixed && topOffset ? { top: topOffset, height: `calc(100vh - ${topOffset}px)` } : {}),
        transition: isFixed ? 'top 280ms ease' : undefined,
      } as React.CSSProperties}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {prelayerColors.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />)}
      </div>

      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className="sm-logo">
          {logoNode ?? (logoUrl && <img src={logoUrl} alt="Logo" className="sm-logo-img" draggable={false} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', pointerEvents: 'auto' }}>
          {headerActions}
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={iconRef} className="sm-hamburger" aria-hidden="true">
              <span ref={line1Ref} className="sm-hamburger-line" />
              <span ref={line2Ref} className="sm-hamburger-line" />
              <span ref={line3Ref} className="sm-hamburger-line" />
            </span>
          </button>
        </div>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.length ? items.map((it, idx) => (
              <li className="sm-panel-itemWrap" key={it.label + idx}>
                <Link
                  className="sm-panel-item"
                  href={it.link}
                  aria-label={it.ariaLabel}
                  data-index={idx + 1}
                  onClick={closeMenu}
                >
                  <span className="sm-panel-itemLabel">{it.label}</span>
                </Link>
              </li>
            )) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item"><span className="sm-panel-itemLabel">No items</span></span>
              </li>
            )}
          </ul>
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default StaggeredMenu
