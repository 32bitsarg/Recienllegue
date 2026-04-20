'use client'

import { useEffect, useState } from 'react'

const COOKIE_KEY = 'rl_cookie_consent'

export type ConsentValue = 'all' | 'essential' | null

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem(COOKIE_KEY) as ConsentValue) ?? null
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)
  }, [])

  const accept = (value: 'all' | 'essential') => {
    localStorage.setItem(COOKIE_KEY, value)
    setVisible(false)

    if (value === 'all') {
      // Habilitar GA
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage:        'denied',
      })
    } else {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage:        'denied',
      })
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[200] rounded-2xl p-5 shadow-xl flex flex-col gap-3"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }}
    >
      <div>
        <p className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>
          Usamos cookies 🍪
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(15,23,42,0.55)' }}>
          Usamos Google Analytics para entender cómo se usa la app y mejorarla. No compartimos tus datos con terceros.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => accept('all')}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
          style={{ background: '#0F172A', color: '#F59E0B' }}
        >
          Aceptar todo
        </button>
        <button
          onClick={() => accept('essential')}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-70"
          style={{ background: 'rgba(15,23,42,0.07)', color: '#0F172A' }}
        >
          Solo esenciales
        </button>
      </div>
    </div>
  )
}
