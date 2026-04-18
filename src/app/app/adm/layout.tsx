'use client'

import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BedDouble,
  Store,
  Car,
  Flag,
  BarChart2,
  ArrowLeft,
} from 'lucide-react'

// ─── Nav links ────────────────────────────────────────────────

const NAV = [
  { href: '/app/adm/dashboard',   label: 'Dashboard',   Icon: LayoutDashboard },
  { href: '/app/adm/hospedajes',  label: 'Hospedajes',  Icon: BedDouble       },
  { href: '/app/adm/comercios',   label: 'Comercios',   Icon: Store           },
  { href: '/app/adm/transportes', label: 'Transportes', Icon: Car             },
  { href: '/app/adm/reportes',    label: 'Reportes',    Icon: Flag            },
  { href: '/app/adm/analytics',   label: 'Analytics',   Icon: BarChart2       },
]

// ─── Spinner ──────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(22,56,50,0.15)', borderTopColor: '#163832' }}
      />
    </div>
  )
}

// ─── Access denied ────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(220,38,38,0.08)' }}
      >
        <Flag size={24} style={{ color: '#dc2626' }} />
      </div>
      <div>
        <h2 className="text-xl font-extrabold mb-1" style={{ color: '#051f20' }}>
          Acceso denegado
        </h2>
        <p className="text-sm" style={{ color: 'rgba(22,56,50,0.5)' }}>
          No tenes permisos para acceder a esta seccion.
        </p>
      </div>
      <Link
        href="/app/inicio"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
        style={{ background: '#163832', color: '#daf1de' }}
      >
        <ArrowLeft size={14} />
        Volver al inicio
      </Link>
    </div>
  )
}

// ─── Sidebar nav link ─────────────────────────────────────────

function NavLink({ href, label, Icon, mobile }: {
  href: string; label: string; Icon: React.ElementType; mobile?: boolean
}) {
  const pathname = usePathname()
  const active   = pathname === href || pathname.startsWith(href + '/')

  if (mobile) {
    return (
      <Link
        href={href}
        className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
        style={{
          background: active ? '#163832' : 'transparent',
          color:      active ? '#daf1de' : 'rgba(22,56,50,0.5)',
        }}
      >
        <Icon size={13} />
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: active ? '#163832' : 'transparent',
        color:      active ? '#daf1de' : 'rgba(22,56,50,0.6)',
      }}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}

// ─── Layout ───────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()

  if (loading) return <Spinner />

  if (!user || user.role !== 'admin') return <AccessDenied />

  return (
    <div className="flex min-h-[calc(100dvh-56px)]">

      {/* Sidebar — desktop only */}
      <aside
        className="hidden lg:flex flex-col w-52 shrink-0 px-3 py-4"
        style={{ borderRight: '1px solid rgba(22,56,50,0.08)', background: '#fff' }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest px-3.5 mb-3"
          style={{ color: 'rgba(22,56,50,0.35)' }}>
          Administracion
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(n => <NavLink key={n.href} {...n} />)}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile horizontal nav */}
        <div
          className="lg:hidden flex gap-1 px-3 py-2 overflow-x-auto"
          style={{
            borderBottom: '1px solid rgba(22,56,50,0.08)',
            background: '#fff',
            scrollbarWidth: 'none',
          }}
        >
          {NAV.map(n => <NavLink key={n.href} {...n} mobile />)}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
