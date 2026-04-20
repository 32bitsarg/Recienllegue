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
  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const avatarHue = user?.name
    ? [...user.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
    : 200

  return (
    <>
      {/* ── DESKTOP TOP BAR — todas las páginas de la app ── */}
      <header
        className="hidden lg:flex items-center h-14 sticky top-0 z-50 px-6 gap-1"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(15,23,42,0.09)',
          boxShadow: '0 1px 0 rgba(15,23,42,0.06)',
        }}
      >
        {/* Logo */}
        <a href="/app/inicio" className="flex items-center mr-6" style={{ textDecoration: 'none' }}>
          <Image src="/logo.svg" alt="Recién Llegué" width={100} height={32} style={{ width: 'auto', height: 28 }} />
        </a>

        {/* Nav links */}
        {isAdmPage ? (
          <a
            href="/app/inicio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
            style={{ color: 'rgba(15,23,42,0.5)', background: 'rgba(15,23,42,0.06)' }}
          >
            <ArrowLeft size={13} /> Volver a la app
          </a>
        ) : (
          links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl text-xs font-bold transition-all"
                style={{
                  background: active ? '#0F172A' : 'rgba(15,23,42,0.06)',
                  color: active ? '#E2E8F0' : 'rgba(15,23,42,0.5)',
                  textDecoration: 'none',
                }}
              >
                <Icon size={14} /> {label}
              </a>
            )
          })
        )}

        {/* Right: admin link + avatar */}
        <div className="ml-auto flex items-center gap-3">
          {isAdmin && !isAdmPage && (
            <a
              href="/app/adm/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{ background: 'rgba(15,23,42,0.06)', color: 'rgba(15,23,42,0.5)', textDecoration: 'none' }}
            >
              <LayoutDashboard size={13} /> Admin
            </a>
          )}
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `hsl(${avatarHue},42%,56%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-head)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
        </div>
      </header>

      {/* ── MOBILE FLOATING BOTTOM NAV ── */}
      <nav
        className="lg:hidden fixed z-50 flex items-center"
        style={{
          bottom: 14,
          left: 14,
          right: 14,
          height: 60,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: 22,
          boxShadow: '0 4px 28px rgba(15,23,42,0.14)',
          padding: '6px',
        }}
      >
        {/* Admin mode */}
        {isAdmin && isAdmPage ? (
          <>
            <a
              href="/app/adm/dashboard"
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[16px] transition-all"
              style={{
                background: pathname === '/app/adm/dashboard' ? '#0F172A' : 'transparent',
                color: pathname === '/app/adm/dashboard' ? '#F59E0B' : 'rgba(15,23,42,0.4)',
              }}
            >
              <LayoutDashboard size={18} strokeWidth={pathname === '/app/adm/dashboard' ? 2.2 : 1.7} />
              {pathname === '/app/adm/dashboard' && (
                <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Admin</span>
              )}
            </a>
            <a
              href="/app/inicio"
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[16px] transition-all"
              style={{ color: 'rgba(15,23,42,0.4)' }}
            >
              <Home size={18} strokeWidth={1.7} />
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
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[16px] transition-all"
                  style={{
                    background: active ? '#0F172A' : 'transparent',
                    color: active ? '#F59E0B' : 'rgba(15,23,42,0.4)',
                  }}
                >
                  <Icon size={active ? 18 : 17} strokeWidth={active ? 2.2 : 1.7} />
                  {active && (
                    <span className="text-[8px] font-bold uppercase tracking-wide leading-none">
                      {label}
                    </span>
                  )}
                </a>
              )
            })}
            {isAdmin ? (
              <a
                href="/app/adm/dashboard"
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[16px] transition-all"
                style={{ color: 'rgba(15,23,42,0.4)' }}
              >
                <LayoutDashboard size={17} strokeWidth={1.7} />
              </a>
            ) : (
              <a
                href="/"
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-[16px] transition-all"
                style={{ color: 'rgba(15,23,42,0.35)' }}
              >
                <ArrowLeft size={16} strokeWidth={1.7} />
                <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Web</span>
              </a>
            )}
          </>
        )}
      </nav>
    </>
  )
}
