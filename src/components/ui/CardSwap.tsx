'use client'

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import './CardSwap.css'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  customClass?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, children, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export interface CardSwapHandle {
  advance: () => void
}

interface CardSwapProps {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  onCardClick?: (idx: number) => void
  onSwap?: (frontIndex: number) => void
  skewAmount?: number
  easing?: 'linear' | 'elastic'
  children: ReactNode
}

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
})

const placeNow = (
  el: HTMLElement,
  slot: ReturnType<typeof makeSlot>,
  skew: number
) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  })

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
      width = 500,
      height = 400,
      cardDistance = 60,
      verticalDistance = 70,
      delay = 5000,
      pauseOnHover = false,
      onCardClick,
      onSwap,
      skewAmount = 6,
      easing = 'elastic',
      children,
    },
    ref
  ) => {
    const config =
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: 'power1.inOut',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          }

    const childArr = useMemo(() => Children.toArray(children), [children])
    const refs = useMemo(
      () => childArr.map(() => React.createRef<HTMLDivElement>()),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [childArr.length]
    )

    const order = useRef<number[]>(
      Array.from({ length: childArr.length }, (_, i) => i)
    )
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const intervalRef = useRef<number | undefined>(undefined)
    const container = useRef<HTMLDivElement>(null)
    const swapRef = useRef<(() => void) | null>(null)
    const isSwappingRef = useRef(false)

    // Stable refs so effect closure never goes stale
    const onSwapRef = useRef(onSwap)
    onSwapRef.current = onSwap
    const delayRef = useRef(delay)
    delayRef.current = delay

    useImperativeHandle(ref, () => ({
      advance() {
        if (intervalRef.current) clearInterval(intervalRef.current)
        swapRef.current?.()
        if (swapRef.current) {
          intervalRef.current = window.setInterval(
            swapRef.current,
            delayRef.current
          )
        }
      },
    }))

    useEffect(() => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

      const total = refs.length
      refs.forEach((r, i) => {
        if (r.current)
          placeNow(
            r.current,
            makeSlot(i, cardDistance, verticalDistance, total),
            skewAmount
          )
      })

      if (prefersReduced) return

      const swap = () => {
        if (order.current.length < 2) return
        if (isSwappingRef.current) return
        isSwappingRef.current = true

        const [front, ...rest] = order.current
        const elFront = refs[front].current
        if (!elFront) { isSwappingRef.current = false; return }

        const tl = gsap.timeline()
        tlRef.current = tl

        tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease })

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
        rest.forEach((idx, i) => {
          const el = refs[idx].current
          if (!el) return
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
          tl.set(el, { zIndex: slot.zIndex }, 'promote')
          tl.to(
            el,
            { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
            `promote+=${i * 0.15}`
          )
        })

        const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
        tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }) }, undefined, 'return')
        tl.to(
          elFront,
          { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease },
          'return'
        )

        tl.call(() => {
          order.current = [...rest, front]
          isSwappingRef.current = false
          onSwapRef.current?.(order.current[0])
        })
      }

      swapRef.current = swap

      swap()
      intervalRef.current = window.setInterval(swap, delay)

      if (pauseOnHover) {
        const node = container.current
        if (!node) return () => { if (intervalRef.current) clearInterval(intervalRef.current) }

        const pause = () => {
          tlRef.current?.pause()
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        const resume = () => {
          tlRef.current?.play()
          intervalRef.current = window.setInterval(swap, delay)
        }
        node.addEventListener('mouseenter', pause)
        node.addEventListener('mouseleave', resume)
        return () => {
          node.removeEventListener('mouseenter', pause)
          node.removeEventListener('mouseleave', resume)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      }

      return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rendered = childArr.map((child, i) => {
      if (!isValidElement(child)) return child
      return cloneElement(child as React.ReactElement<any>, {
        key: i,
        ref: refs[i],
        style: { width, height, ...((child as React.ReactElement<any>).props.style ?? {}) },
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          ;(child as React.ReactElement<any>).props.onClick?.(e)
          onCardClick?.(i)
        },
      })
    })

    return (
      <div ref={container} className="card-swap-container" style={{ width, height }}>
        {rendered}
      </div>
    )
  }
)
CardSwap.displayName = 'CardSwap'

export default CardSwap
