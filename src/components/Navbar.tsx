'use client';

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Search } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { logout } from "@/app/actions/auth";

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { user, isLoggedIn, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Pergamino', href: '/pergamino' },
    { label: 'App', href: '/app/inicio' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (q: string, e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/app/comercios?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: '#ffffff',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(15,23,42,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <a href="/" className="flex items-center group">
            <img src="/logo.svg" alt="Recién Llegué" className="h-8 w-auto transition-transform group-hover:scale-105" />
          </a>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-wider transition-colors"
                style={{
                  fontFamily: 'var(--font-head)',
                  color: '#0F172A',
                  opacity: pathname === link.href ? 1 : 0.45,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => {
                  if (pathname !== link.href) e.currentTarget.style.opacity = '0.45';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* DESKTOP SEARCH */}
          <form
            onSubmit={(e) => handleSearch(searchQuery, e)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full"
            style={{ background: 'rgba(15,23,42,0.06)', border: '1px solid rgba(15,23,42,0.09)', minWidth: 220 }}
          >
            <Search size={14} style={{ color: '#0F172A', opacity: 0.4, flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar comercios…"
              className="bg-transparent outline-none text-[11px] font-medium w-full"
              style={{ color: '#0F172A' }}
            />
          </form>

          {/* CTA + AUTH */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {isLoggedIn ? (
                  <div className="hidden sm:flex items-center gap-4">
                    <a href="/app/perfil" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#0F172A', fontFamily: 'var(--font-head)' }}>
                      <User size={14} />
                      {user?.name || 'Mi Perfil'}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
                      style={{ color: '#0F172A', border: '1px solid rgba(15,23,42,0.14)', fontFamily: 'var(--font-head)' }}
                    >
                      <LogOut size={14} />
                      Salir
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href="/registro"
                      className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                      style={{ background: '#0F172A', color: '#F59E0B', fontFamily: 'var(--font-head)' }}
                    >
                      Crear cuenta
                    </a>
                    <a
                      href="/login"
                      className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
                      style={{ color: '#0F172A', border: '1px solid rgba(15,23,42,0.14)', fontFamily: 'var(--font-head)' }}
                    >
                      Ingresar
                    </a>
                  </>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: '#0F172A' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 p-4 lg:hidden"
          >
            <div
              className="rounded-2xl p-6 space-y-4 shadow-xl"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              {/* Mobile search */}
              <form
                onSubmit={(e) => handleSearch(mobileSearchQuery, e)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full"
                style={{ background: 'rgba(15,23,42,0.06)', border: '1px solid rgba(15,23,42,0.09)' }}
              >
                <Search size={14} style={{ color: '#0F172A', opacity: 0.4, flexShrink: 0 }} />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={e => setMobileSearchQuery(e.target.value)}
                  placeholder="Buscar comercios…"
                  className="bg-transparent outline-none text-[12px] font-medium w-full"
                  style={{ color: '#0F172A' }}
                />
              </form>

              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-semibold uppercase tracking-wide py-2 transition-colors"
                  style={{ color: '#0F172A', fontFamily: 'var(--font-head)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
                {isLoggedIn ? (
                  <>
                    <a
                      href="/app/perfil"
                      className="text-center px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: '#0F172A', color: '#F59E0B', fontFamily: 'var(--font-head)' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Mi Perfil ({user?.name})
                    </a>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="text-center px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: '#0F172A', border: '1px solid rgba(15,23,42,0.14)', fontFamily: 'var(--font-head)' }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/registro"
                      className="text-center px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: '#0F172A', color: '#F59E0B', fontFamily: 'var(--font-head)' }}
                    >
                      Crear cuenta
                    </a>
                    <a
                      href="/login"
                      className="text-center px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: '#0F172A', border: '1px solid rgba(15,23,42,0.14)', fontFamily: 'var(--font-head)' }}
                    >
                      Ingresar
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
