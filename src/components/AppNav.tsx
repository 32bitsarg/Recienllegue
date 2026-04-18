'use client'

import { usePathname } from 'next/navigation'
import { Home, BedDouble, ShoppingBag, Bus, Megaphone, User, LayoutDashboard, ArrowLeft } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import Image from 'next/image'

const links = [
  { label: 'Inicio',      href: '/app/inicio',      icon: Home },
  { label: 'Hospedajes',  href: '/app/hospedajes',  icon: BedDouble },
  { label: 'Comercios',   href: '/app/comercios',   icon: ShoppingBag },
  { label: 'Transportes', href: '/app/transportes', icon: Bus },
  { label: 'Muro',        href: '/app/muro',        icon: Megaphone },
  { label: 'Perfil',      href: '/app/perfil',      icon: User },
]

export default function AppNav() {
  const pathname = usePathname()
  const { user } = useUser()
  const isAdmin = user?.role === 'admin'
  const isAdmPage = pathname.startsWith('/app/adm')

  return (
    <>
      {/* ── DESKTOP TOP BAR — solo en /app/adm/* ── */}
      {isAdmPage && (
        <header
          className="hidden lg:flex items-center justify-between px-6 h-14 sticky top-0 z-50"
          style={{
            background: 'rgba(248,250,248,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(22,56,50,0.07)',
          }}
        >
          <a href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <ArrowLeft size={13} style={{ color: '#163832' }} />
            <Image src="/logo.svg" alt="Recién Llegué" width={90} height={28} className="object-contain" />
          </a>
          <a
            href="/app/inicio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{ color: 'rgba(22,56,50,0.5)' }}
          >
            <Home size={13} />
            Volver a la app
          </a>
        </header>
      )}

      {/* ── MOBILE BOTTOM NAV ──────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around px-1 pb-safe"
        style={{
          height: '60px',
          background: 'rgba(248, 250, 248, 0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(22, 56, 50, 0.07)',
        }}
      >
        {/* Admin mode: dashboard + back */}
        {isAdmin && isAdmPage ? (
          <>
            <a
              href="/app/adm/dashboard"
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
              style={{ color: '#163832', opacity: pathname === '/app/adm/dashboard' ? 1 : 0.38 }}
            >
              <LayoutDashboard size={pathname === '/app/adm/dashboard' ? 21 : 19}
                strokeWidth={pathname === '/app/adm/dashboard' ? 2.2 : 1.7} />
              {pathname === '/app/adm/dashboard' && (
                <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Admin</span>
              )}
            </a>
            <a
              href="/app/inicio"
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
              style={{ color: '#235347', opacity: 0.45 }}
            >
              <Home size={19} strokeWidth={1.7} />
              <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Volver</span>
            </a>
          </>
        ) : (
          <>
            {links.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <a
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
                  style={{ color: active ? '#163832' : '#235347', opacity: active ? 1 : 0.32 }}
                >
                  <Icon size={active ? 21 : 19} strokeWidth={active ? 2.2 : 1.7} />
                  {active && (
                    <span className="text-[8px] font-bold uppercase tracking-wide leading-none">
                      {label}
                    </span>
                  )}
                </a>
              )
            })}
            {/* Admin shortcut — solo si es admin y no está en adm */}
            {isAdmin ? (
              <a
                href="/app/adm/dashboard"
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
                style={{ color: '#235347', opacity: 0.32 }}
              >
                <LayoutDashboard size={19} strokeWidth={1.7} />
              </a>
            ) : (
              <a
                href="/"
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
                style={{ color: '#235347', opacity: 0.28 }}
              >
                <ArrowLeft size={17} strokeWidth={1.7} />
                <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Web</span>
              </a>
            )}
          </>
        )}
      </nav>
    </>
  )
}
