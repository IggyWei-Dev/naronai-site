'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('naronai-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem('naronai-theme')
    } else {
      root.setAttribute('data-theme', theme)
      localStorage.setItem('naronai-theme', theme)
    }
  }, [theme])

  const toggle = () =>
    setTheme((t) => {
      if (t === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefersDark ? 'light' : 'dark'
      }
      return t === 'dark' ? 'light' : 'dark'
    })

  return { theme, toggle }
}
