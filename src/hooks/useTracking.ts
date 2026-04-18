'use client'

import { useRef, useCallback } from 'react'
import { publicDb } from '@/lib/db'
import { useUser } from './useUser'
import { generateId } from '@/lib/uuid'

function getSessionId(): string {
  if (typeof localStorage === 'undefined') return 'ssr'
  let id = localStorage.getItem('rl_session')
  if (!id) {
    id = generateId()
    localStorage.setItem('rl_session', id)
  }
  return id
}

export function useTracking() {
  const { user } = useUser()
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const insertEvent = useCallback((payload: Record<string, unknown>) => {
    if (typeof window === 'undefined') return
    publicDb.from('user_events').insert({
      userId: user?.id ?? null,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      ...payload,
    }).catch(() => {})
  }, [user?.id])

  const trackClick = useCallback((
    entityId: string,
    entityType: 'hospedaje' | 'comercio',
    page: string
  ) => {
    insertEvent({ eventType: 'click_item', entityId, entityType, page, metadata: null })
  }, [insertEvent])

  const trackSearch = useCallback((query: string, page: string, resultCount?: number) => {
    if (!query.trim()) return
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      insertEvent({
        eventType: 'search',
        entityId: null,
        entityType: null,
        page,
        metadata: { query, resultCount: resultCount ?? null, noResults: resultCount === 0 },
      })
    }, 800)
  }, [insertEvent])

  const trackTimeOnPage = useCallback((page: string, seconds: number) => {
    if (seconds < 3) return
    insertEvent({ eventType: 'time_on_page', entityId: null, entityType: null, page, metadata: { seconds } })
  }, [insertEvent])

  const trackFunnel = useCallback((step: string, metadata?: Record<string, unknown>) => {
    insertEvent({ eventType: 'funnel', entityId: null, entityType: null, page: step, metadata: metadata ?? null })
  }, [insertEvent])

  return { trackClick, trackSearch, trackTimeOnPage, trackFunnel }
}
