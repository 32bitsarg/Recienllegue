'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HeroParticles from '@/components/HeroParticles'

const QUOTES = [
  {
    text: 'Llegué a Pergamino sin conocer a nadie y en 48 horas ya tenía alojamiento. Literal me salvó.',
    name: 'Martina L.',
    career: 'Ing. Informática · UNNOBA',
  },
  {
    text: 'La sección de remises y colectivos es lo más. La primera semana no sabía cómo ir a la facultad.',
    name: 'Sebastián G.',
    career: 'Administración · UNNOBA',
  },
]

const Q = QUOTES[Math.floor(Math.random() * QUOTES.length)]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>

      {/* ── Panel izquierdo (desktop) ─────────────────── */}
      <div
        className="hidden lg:flex lg:flex-col lg:justify-between relative overflow-hidden"
        style={{ width: 460, flexShrink: 0, background: '#0F172A', minHeight: '100vh' }}
      >
        <HeroParticles />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img src="/logo.svg" alt="Recién Llegué" className="h-9 w-auto" style={{ filter: 'invert(1)' }} />
            <span className="font-black text-lg tracking-tight" style={{ color: '#E2E8F0' }}>
              Recién Llegué
            </span>
          </Link>
        </div>

        {/* Copy central */}
        <div className="relative z-10 px-10 py-12 space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(226,232,240,0.45)' }}>
            Tu guía universitaria
          </p>
          <h2 className="font-black tracking-tight leading-[1.08]"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#E2E8F0' }}>
            Todo lo que necesitás,<br />
            <span style={{ color: '#fff' }}>en un solo lugar.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#94A3B8' }}>
            Alojamiento verificado, transporte, comercios y comunidad para instalarte en Pergamino desde el primer día.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 p-10 pt-0">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(226,232,240,0.08)', border: '1px solid rgba(226,232,240,0.12)' }}>
            <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'rgba(226,232,240,0.75)' }}>
              &ldquo;{Q.text}&rdquo;
            </p>
            <div>
              <p className="text-xs font-bold" style={{ color: '#E2E8F0' }}>{Q.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(226,232,240,0.45)' }}>{Q.career}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel derecho — formulario ─────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Header mobile */}
        <header className="lg:hidden border-b px-5 h-14 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(15,23,42,0.08)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Recién Llegué" className="h-7 w-auto" />
            <span className="font-black text-base tracking-tight" style={{ color: '#0F172A' }}>
              Recién Llegué
            </span>
          </Link>
          <span className="text-sm" style={{ color: 'rgba(15,23,42,0.5)' }}>
            {isLogin ? (
              <>¿No tenés cuenta?{' '}
                <Link href="/registro" className="font-bold text-[#0F172A] hover:underline">Registrate</Link>
              </>
            ) : (
              <>¿Ya tenés?{' '}
                <Link href="/login" className="font-bold text-[#0F172A] hover:underline">Ingresar</Link>
              </>
            )}
          </span>
        </header>

        {/* Contenido centrado */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">

          {/* Link contextual desktop */}
          <div className="hidden lg:block w-full max-w-sm mb-8 text-right">
            <span className="text-sm" style={{ color: 'rgba(15,23,42,0.5)' }}>
              {isLogin ? (
                <>¿No tenés cuenta?{' '}
                  <Link href="/registro" className="font-bold text-[#0F172A] hover:underline">Registrate</Link>
                </>
              ) : (
                <>¿Ya tenés cuenta?{' '}
                  <Link href="/login" className="font-bold text-[#0F172A] hover:underline">Iniciá sesión</Link>
                </>
              )}
            </span>
          </div>

          {children}
        </main>

        <footer className="px-5 py-5 text-center">
          <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.3)' }}>
            © 2026 Recién Llegué · Hecho por estudiantes, para estudiantes.
          </p>
        </footer>
      </div>
    </div>
  )
}
