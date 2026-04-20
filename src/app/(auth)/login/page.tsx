'use client'
import { login } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div
        className="bg-white rounded-2xl shadow-sm px-8 py-10"
        style={{ border: '1px solid rgba(15,23,42,0.08)' }}
      >
        <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Bienvenido de vuelta</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(15,23,42,0.5)' }}>
          Ingresá a tu cuenta
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#0F172A] outline-none transition-shadow"
              style={{
                border: '1px solid rgba(15,23,42,0.2)',
                background: '#fff',
              }}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.15)')}
              onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#0F172A] outline-none transition-shadow"
              style={{
                border: '1px solid rgba(15,23,42,0.2)',
                background: '#fff',
              }}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.15)')}
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
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center" style={{ color: 'rgba(15,23,42,0.5)' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="font-semibold text-[#0F172A] hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
