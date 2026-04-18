'use client'
import { register } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'
import PageTracker from '@/components/PageTracker'
import { publicDb } from '@/lib/db'
import { generateId } from '@/lib/uuid'

function GraduationCapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
      <path d="M5 21V11" />
      <path d="M19 21V11" />
      <rect x="9" y="14" width="6" height="7" />
    </svg>
  )
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'estudiante' | 'comercio'>('estudiante')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Trackear conversión de registro exitoso
      const sessionId = localStorage.getItem('rl_session') ?? generateId()
      publicDb.from('user_events').insert({
        sessionId,
        userId: null,
        eventType: 'funnel',
        page: '/registro',
        entityId: null,
        entityType: null,
        metadata: { step: 'registro_completado', role: formData.get('role') ?? 'estudiante' },
      }).catch(() => {})
    }
  }

  const cardBase = 'flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl cursor-pointer transition-all text-center select-none'
  const cardSelected = { border: '1.5px solid #163832', background: 'rgba(22,56,50,0.04)' }
  const cardUnselected = { border: '1.5px solid rgba(22,56,50,0.12)', background: '#fff' }

  return (
    <div className="w-full max-w-sm">
      <PageTracker page="/registro" />
      <div
        className="bg-white rounded-2xl shadow-sm px-8 py-10"
        style={{ border: '1px solid rgba(22,56,50,0.08)' }}
      >
        <h1 className="text-2xl font-extrabold text-[#051f20] mb-1">Crear cuenta</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(22,56,50,0.5)' }}>
          Unite a la comunidad de Pergamino
        </p>

        <form action={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-[#051f20] mb-2">Soy</label>
            <div className="flex gap-3">
              <button
                type="button"
                className={cardBase}
                style={role === 'estudiante' ? cardSelected : cardUnselected}
                onClick={() => setRole('estudiante')}
              >
                <span style={{ color: role === 'estudiante' ? '#163832' : 'rgba(22,56,50,0.4)' }}>
                  <GraduationCapIcon />
                </span>
                <span className="text-xs font-semibold text-[#051f20]">Estudiante</span>
                <span className="text-xs leading-tight" style={{ color: 'rgba(22,56,50,0.5)' }}>
                  Soy estudiante en Pergamino
                </span>
              </button>

              <button
                type="button"
                className={cardBase}
                style={role === 'comercio' ? cardSelected : cardUnselected}
                onClick={() => setRole('comercio')}
              >
                <span style={{ color: role === 'comercio' ? '#163832' : 'rgba(22,56,50,0.4)' }}>
                  <StoreIcon />
                </span>
                <span className="text-xs font-semibold text-[#051f20]">Comercio</span>
                <span className="text-xs leading-tight" style={{ color: 'rgba(22,56,50,0.5)' }}>
                  Tengo un negocio en Pergamino
                </span>
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#051f20] mb-1">Nombre completo</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Juan Pérez"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#051f20] outline-none transition-shadow"
              style={{ border: '1px solid rgba(22,56,50,0.2)', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,56,50,0.15)')}
              onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#051f20] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#051f20] outline-none transition-shadow"
              style={{ border: '1px solid rgba(22,56,50,0.2)', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,56,50,0.15)')}
              onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#051f20] mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#051f20] outline-none transition-shadow"
              style={{ border: '1px solid rgba(22,56,50,0.2)', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,56,50,0.15)')}
              onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-2.5 rounded-lg text-sm transition-opacity disabled:opacity-50"
            style={{ background: '#163832', color: '#daf1de' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center" style={{ color: 'rgba(22,56,50,0.5)' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-semibold text-[#163832] hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
