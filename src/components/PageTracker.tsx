'use client'

import { useEffect } from 'react'
import { publicDb } from '@/lib/db'
import { generateId } from '@/lib/uuid'

interface Props {
  page: string   // e.g. '/', '/pergamino', '/pergamino/alojamiento-estudiantes'
  extra?: Record<string, string>  // metadata adicional (city, slug, etc.)
}

export default function PageTracker({ page, extra }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sessionId = (() => {
      const key = 'rl_session'
      const existing = localStorage.getItem(key)
      if (existing) return existing
      const id = generateId()
      localStorage.setItem(key, id)
      return id
    })()

    const referrer = document.referrer || null
    const userAgent = navigator.userAgent.slice(0, 200)

    publicDb.from('page_views').insert({
      page,
      sessionId,
      referrer,
      userAgent,
      metadata: extra ?? null,
    }).catch(() => {})
  }, [page, extra])

  return null
}
