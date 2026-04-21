'use client'
import { register } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'
import PageTracker from '@/components/PageTracker'
import { publicDb } from '@/lib/db'
import { generateId } from '@/lib/uuid'
import { ArrowLeft, GraduationCap, Store } from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'estudiante' | 'comercio'>('estudiante')
  const [step, setStep] = useState<1 | 2>(1)

  async function handleSubmit(formData: FormData) {
    const pwd     = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string
    if (pwd !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
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

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none transition-shadow"
  const inputStyle = { border: '1px solid rgba(15,23,42,0.15)', background: '#F8FAFC' }

  return (
    <div className="w-full max-w-sm">
      <PageTracker page="/registro" />

      {/* Progress header */}
      <div className="mb-6">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-4 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(15,23,42,0.45)' }}
          >
            <ArrowLeft size={13} /> Volver
          </button>
        )}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(15,23,42,0.4)' }}>
            Paso {step} de 2
          </p>
          <p className="text-[11px] font-semibold" style={{ color: 'rgba(15,23,42,0.35)' }}>
            {step === 1 ? 'Seleccioná tu rol' : 'Tus datos'}
          </p>
        </div>
        <div className="flex gap-1.5">
          {[1, 2].map(n => (
            <div
              key={n}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: n <= step ? '#F59E0B' : 'rgba(15,23,42,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
        style={{ border: '1px solid rgba(15,23,42,0.08)' }}
      >
        {step === 1 ? (
          /* ── Step 1: Role picker ── */
          <div className="px-7 py-8">
            <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Crear cuenta</h1>
            <p className="text-sm mb-7" style={{ color: 'rgba(15,23,42,0.5)' }}>
              ¿Cómo vas a usar Recién Llegué?
            </p>

            <div className="space-y-3">
              {([
                {
                  value: 'estudiante' as const,
                  label: 'Estudiante',
                  desc: 'Buscás hospedaje, transporte y servicios para instalarte',
                  icon: <GraduationCap size={22} />,
                },
                {
                  value: 'comercio' as const,
                  label: 'Comercio',
                  desc: 'Tenés un negocio y querés aparecer en la plataforma',
                  icon: <Store size={22} />,
                },
              ] as const).map(({ value, label, desc, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className="w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left"
                  style={{
                    border: role === value ? '2px solid #0F172A' : '2px solid rgba(15,23,42,0.1)',
                    background: role === value ? 'rgba(15,23,42,0.03)' : '#fff',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: role === value ? '#0F172A' : 'rgba(15,23,42,0.07)',
                      color: role === value ? '#F59E0B' : 'rgba(15,23,42,0.4)',
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{label}</p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(15,23,42,0.5)' }}>{desc}</p>
                  </div>
                  <div
                    className="ml-auto w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: role === value ? '#0F172A' : 'rgba(15,23,42,0.2)',
                      background: role === value ? '#0F172A' : 'transparent',
                    }}
                  >
                    {role === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-6 font-bold py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
              style={{ background: '#0F172A', color: '#F59E0B' }}
            >
              Continuar →
            </button>

            <p className="mt-5 text-sm text-center" style={{ color: 'rgba(15,23,42,0.5)' }}>
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="font-semibold text-[#0F172A] hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </div>
        ) : (
          /* ── Step 2: Form fields ── */
          <div className="px-7 py-8">
            <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">
              {role === 'estudiante' ? 'Datos de estudiante' : 'Datos del comercio'}
            </h1>
            <p className="text-sm mb-7" style={{ color: 'rgba(15,23,42,0.5)' }}>
              {role === 'comercio' ? 'Sé parte de Recién Llegué' : 'Unite a la comunidad de Pergamino'}
            </p>

            <form action={handleSubmit} className="space-y-4">
              <input type="hidden" name="role" value={role} />

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,23,42,0.45)' }}>
                  {role === 'comercio' ? 'Nombre del comercio' : 'Nombre completo'}
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={role === 'comercio' ? 'Ej: Pizzería Don José' : 'Juan Pérez'}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.12)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,23,42,0.45)' }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.12)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              {role === 'comercio' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,23,42,0.45)' }}>
                    Teléfono de contacto <span style={{ color: 'rgba(15,23,42,0.3)', fontWeight: 500 }}>(opcional)</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Ej: 2477-123456"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.12)')}
                    onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,23,42,0.45)' }}>
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.12)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,23,42,0.45)' }}>
                  Repetir contraseña
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.12)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-3 rounded-xl text-sm transition-opacity disabled:opacity-50 hover:opacity-90 mt-2"
                style={{ background: '#0F172A', color: '#F59E0B' }}
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-5 text-sm text-center" style={{ color: 'rgba(15,23,42,0.5)' }}>
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="font-semibold text-[#0F172A] hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
