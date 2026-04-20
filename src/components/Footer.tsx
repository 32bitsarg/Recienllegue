export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#F59E0B' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Recién Llegué" className="h-7 w-auto" style={{ filter: 'invert(1) opacity(0.8)' }} />
          <span className="text-sm font-bold tracking-tight opacity-70" style={{ fontFamily: 'var(--font-head)' }}>
            Recién Llegué
          </span>
        </div>
        <p className="text-[11px] opacity-40 text-center" style={{ fontFamily: 'var(--font-body)' }}>
          © {new Date().getFullYear()} Recién Llegué · Para estudiantes universitarios argentinos
        </p>
        <div className="flex items-center gap-6">
          <a href="/pergamino" className="text-[11px] font-semibold opacity-40 hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-head)' }}>
            Pergamino
          </a>
          <a href="/login" className="text-[11px] font-semibold opacity-40 hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-head)' }}>
            Ingresar
          </a>
          <a href="/registro" className="text-[11px] font-semibold opacity-40 hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-head)' }}>
            Registro
          </a>
        </div>
      </div>
    </footer>
  )
}
