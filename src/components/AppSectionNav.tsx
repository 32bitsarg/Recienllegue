'use client'

import { usePathname } from 'next/navigation'
import { BedDouble, Bus, Home, LayoutDashboard, LogOut, Megaphone, ShoppingBag, User } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { logout } from '@/app/actions/auth'

const links = [
  { label: 'Inicio', href: '/app/inicio', icon: Home },
  { label: 'Hospedajes', href: '/app/hospedajes', icon: BedDouble },
  { label: 'Comercios', href: '/app/comercios', icon: ShoppingBag },
  { label: 'Transportes', href: '/app/transportes', icon: Bus },
  { label: 'Muro', href: '/app/muro', icon: Megaphone },
  { label: 'Perfil', href: '/app/perfil', icon: User },
]

export default function AppSectionNav() {
  const pathname = usePathname()
  const { user } = useUser()
  const isAdmin = user?.role === 'admin'

  return (
    <nav className="hidden lg:block">
      <div
        className="app-card p-2.5 sticky top-6"
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all"
                style={{
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--accent-contrast)' : 'var(--text-primary)',
                  border: `1px solid ${active ? 'transparent' : 'transparent'}`,
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
              </a>
            )
          })}

          <div className="ml-auto flex items-center gap-2">
            {isAdmin && (
              <a
                href="/app/adm/dashboard"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all"
                style={{
                  background: pathname.startsWith('/app/adm') ? 'var(--accent)' : 'var(--surface-soft)',
                  color: pathname.startsWith('/app/adm') ? 'var(--accent-contrast)' : 'var(--accent)',
                }}
              >
                <LayoutDashboard size={15} />
                <span>Admin</span>
              </a>
            )}
            {user && (
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:opacity-70"
                  style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}
                >
                  <LogOut size={15} />
                  <span>Salir</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
