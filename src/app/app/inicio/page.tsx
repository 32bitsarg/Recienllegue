'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '@/hooks/useUser'
import {
  Phone, ChevronRight, LogIn, LogOut, UserPlus,
  Sparkles, ArrowRight,
} from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import AppSectionNav from '@/components/AppSectionNav'
import { logout } from '@/app/actions/auth'

// ─────────────────────────────────────────────────────────────────
// 3D Tilt card — wrapper div que tiltea, inner div clipea
// El glare (reflejo de luz) es lo que hace VISIBLE el efecto 3D
// ─────────────────────────────────────────────────────────────────

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  innerClassName?: string
  innerStyle?: React.CSSProperties
  strength?: number
  glareColor?: string
  as?: 'div' | 'a'
  href?: string
}

function TiltCard({
  children,
  className = '',
  style,
  innerClassName = '',
  innerStyle,
  strength = 10,
  glareColor = 'rgba(255,255,255,0.12)',
  as: Tag = 'div',
  href,
}: TiltCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !wrapperRef.current) return
    const el = wrapperRef.current
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width   // 0..1
      const y = (e.clientY - rect.top)  / rect.height  // 0..1
      const rx = (y - 0.5) * -strength  // rotateX: arriba=positivo
      const ry = (x - 0.5) *  strength  // rotateY: derecha=positivo
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
      if (glareRef.current) {
        // El glare sigue el cursor — efecto de luz especular
        glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${glareColor}, transparent 65%)`
        glareRef.current.style.opacity = '1'
      }
    })
  }, [reduced, strength, glareColor])

  const handleMouseLeave = useCallback(() => {
    if (!wrapperRef.current) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    wrapperRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }, [])

  // Touch: tilt sutil en mobile
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (reduced || !wrapperRef.current || e.touches.length === 0) return
    const el = wrapperRef.current
    const touch = e.touches[0]
    const rect = el.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    const y = (touch.clientY - rect.top)  / rect.height
    const mobileStrength = strength * 0.4
    el.style.transition = 'none'
    el.style.transform = `perspective(700px) rotateX(${(y - 0.5) * -mobileStrength}deg) rotateY(${(x - 0.5) * mobileStrength}deg)`
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${glareColor}, transparent 65%)`
      glareRef.current.style.opacity = '0.6'
    }
  }, [reduced, strength, glareColor])

  const handleTouchEnd = useCallback(() => {
    if (!wrapperRef.current) return
    wrapperRef.current.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)'
    wrapperRef.current.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }, [])

  const inner = (
    // inner: este div clipea el contenido con border-radius
    <div
      className={`relative overflow-hidden ${innerClassName}`}
      style={{ height: '100%', ...innerStyle }}
    >
      {children}
      {/* Glare overlay — invisible hasta que el mouse se mueve */}
      <div
        ref={glareRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
          zIndex: 20,
          borderRadius: 'inherit',
        }}
      />
    </div>
  )

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={className}
      style={{
        transition: 'transform 0.2s cubic-bezier(0.23,1,0.32,1)',
        willChange: 'transform',
        // Sin overflow aquí: el clip lo hace el inner
        ...style,
      }}
    >
      {Tag === 'a' && href ? (
        <a href={href} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
          {inner}
        </a>
      ) : inner}
    </div>
  )
}

// ─── Hero Particles Canvas ─────────────────────────────────────
// Figuras geométricas que caen lentamente, con profundidad 3D
// Misma estética que las decoraciones SVG del hero anterior

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    // Alias no-nullable para uso en closures internas
    const ctx: CanvasRenderingContext2D = rawCtx
    const cvs: HTMLCanvasElement = canvas

    type Shape = 'circle' | 'dot' | 'line' | 'arc' | 'cross' | 'triangle'
    const SHAPES: Shape[] = ['circle', 'dot', 'line', 'arc', 'cross', 'triangle']

    interface Particle {
      x: number; y: number; z: number
      vx: number; vy: number
      size: number; opacity: number
      shape: Shape
      rotation: number; rotSpeed: number
    }

    let w = 0; let h = 0

    function mkParticle(randomY = false): Particle {
      const z = Math.random()                   // 0 = fondo, 1 = frente
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -40,
        z,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.12 + z * 0.38,                   // frente cae más rápido
        size: 3 + z * 18,                       // frente es más grande
        opacity: 0.05 + z * 0.2,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.018,
      }
    }

    const COUNT = 55
    let particles: Particle[] = []

    function drawShape(p: Particle) {
      const s = p.size
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.strokeStyle = '#daf1de'
      ctx.fillStyle = '#daf1de'
      ctx.lineWidth = 0.9

      switch (p.shape) {
        case 'circle':
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke()
          break
        case 'dot':
          ctx.beginPath(); ctx.arc(0, 0, Math.max(1, s * 0.15), 0, Math.PI * 2); ctx.fill()
          break
        case 'line':
          ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke()
          break
        case 'arc':
          ctx.beginPath(); ctx.arc(0, 0, s, 0.2, Math.PI * 0.85); ctx.stroke()
          break
        case 'cross':
          ctx.beginPath()
          ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0)
          ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5)
          ctx.stroke()
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -s)
          ctx.lineTo(s * 0.866, s * 0.5)
          ctx.lineTo(-s * 0.866, s * 0.5)
          ctx.closePath(); ctx.stroke()
          break
      }
      ctx.restore()
    }

    let animId: number
    let running = true

    function tick() {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        drawShape(p)
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed
        if (p.y > h + 40) Object.assign(p, mkParticle(false))
        if (p.x < -40) p.x = w + 40
        if (p.x > w + 40) p.x = -40
      }
      animId = requestAnimationFrame(tick)
    }

    function resize() {
      w = cvs.offsetWidth
      h = cvs.offsetHeight
      cvs.width = w
      cvs.height = h
      if (particles.length === 0)
        particles = Array.from({ length: COUNT }, () => mkParticle(true))
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cvs)
    resize()
    tick()

    return () => { running = false; cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}

// ─── Hero Carousel ─────────────────────────────────────────────

const CAROUSEL_INTERVAL = 4500

function HeroCarousel({ username }: { username: string | null }) {
  const [current, setCurrent] = useState(0)

  const slides = [
    {
      content: (
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#daf1de', opacity: 0.65 }}>
            Pergamino · UNNOBA
          </p>
          <h2 className="font-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#daf1de' }}>
            Todos llegamos<br />por primera vez.
          </h2>
          <p className="text-[15px] max-w-md leading-relaxed font-medium" style={{ color: '#b8e4bf' }}>
            Esta app es tu guía. Hospedajes, transporte, comercios — todo en un lugar.
          </p>
          <a href="/app/hospedajes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{ background: 'rgba(218,241,222,0.18)', color: '#daf1de', border: '1px solid rgba(218,241,222,0.28)', backdropFilter: 'blur(4px)' }}>
            Explorar hospedajes <ArrowRight size={14} />
          </a>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#daf1de', opacity: 0.65 }}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h2 className="font-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#daf1de' }}>
            {username
              ? <><span style={{ color: '#a8ddb5' }}>{username.split(' ')[0]}</span>,<br />¿qué buscás hoy?</>
              : <>¿Qué andás<br />buscando hoy?</>}
          </h2>
          <p className="text-[15px] max-w-md leading-relaxed font-medium" style={{ color: '#b8e4bf' }}>
            Hospedajes, transportes, comercios y comunidad.
          </p>
          <a href="/app/transportes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{ background: 'rgba(218,241,222,0.18)', color: '#daf1de', border: '1px solid rgba(218,241,222,0.28)', backdropFilter: 'blur(4px)' }}>
            Ver transportes <ArrowRight size={14} />
          </a>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#daf1de', opacity: 0.65 }}>
            En construcción
          </p>
          <h2 className="font-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#daf1de' }}>
            Estamos{' '}
            <span className="italic" style={{ WebkitTextStroke: '1.5px #a8ddb5', color: 'transparent' }}>
              creciendo
            </span>
            <br />para que encuentres<br />todo en un lugar.
          </h2>
          <p className="text-[15px] max-w-md leading-relaxed font-medium" style={{ color: '#b8e4bf' }}>
            Cada semana sumamos comercios, servicios y recursos para estudiantes.
          </p>
        </div>
      ),
    },
  ]

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])
  useEffect(() => {
    const id = setInterval(next, CAROUSEL_INTERVAL)
    return () => clearInterval(id)
  }, [next])

  return (
    <div style={{
      position: 'relative',
      background: '#163832',
      overflow: 'hidden',
      paddingBottom: 56,
    }}>
      {/* Canvas de partículas — position:absolute, no afecta layout */}
      <HeroParticles />

      {/* Slides */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 700ms cubic-bezier(0.77,0,0.18,1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: '100%',
              minHeight: 360,
              display: 'flex',
              alignItems: 'center',
              padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px)',
            }}
          >
            {slide.content}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div
        style={{
          position: 'absolute', bottom: 20, left: 'clamp(20px, 5vw, 64px)',
          display: 'flex', gap: 8, zIndex: 3,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 24 : 6, height: 6,
              borderRadius: 9999, background: '#daf1de',
              opacity: i === current ? 0.92 : 0.35,
              transition: 'all 300ms', border: 'none', cursor: 'pointer', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Contador */}
      <div style={{ position: 'absolute', bottom: 20, right: 'clamp(20px, 5vw, 64px)', zIndex: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#daf1de', opacity: 0.4 }}>
          {current + 1}/{slides.length}
        </span>
      </div>
    </div>
  )
}

// ─── Onboarding Section ────────────────────────────────────────

const USE_CASES = [
  {
    emoji: '🏠',
    question: '¿Dónde vivir?',
    desc: 'Pensiones, cuartos y alquileres cerca de UNNOBA.',
    href: '/app/hospedajes',
    bg: '#163832',
  },
  {
    emoji: '🚌',
    question: '¿Cómo moverme?',
    desc: 'Colectivos con mapa y remises con llamada directa.',
    href: '/app/transportes',
    bg: '#1a4038',
  },
  {
    emoji: '🛍️',
    question: '¿Dónde comer y comprar?',
    desc: 'Comercios y restós útiles para el día a día.',
    href: '/app/comercios',
    bg: '#163832',
  },
  {
    emoji: '📢',
    question: '¿Qué pasa en el barrio?',
    desc: 'Avisos, pedidos y publicaciones de la comunidad.',
    href: '/app/muro',
    bg: '#1a4038',
  },
]

function OnboardingSection() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(22,56,50,0.07)' }}>
          <Sparkles size={15} style={{ color: '#163832' }} />
        </div>
        <div>
          <p className="app-section-kicker mb-0.5">Guía rápida</p>
          <h2 className="app-section-title text-xl">¿Qué podés hacer acá?</h2>
        </div>
      </div>

      {/* Horizontal scroll borde a borde */}
      <div style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <div style={{ display: 'inline-flex', gap: 12, paddingRight: 16 }}>
          {USE_CASES.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                width: 196, minHeight: 200, flexShrink: 0,
                borderRadius: 20, background: item.bg, padding: '20px',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 32, lineHeight: 1 }}>{item.emoji}</span>
              <div>
                <p style={{ color: '#daf1de', fontWeight: 800, fontSize: 15, lineHeight: 1.3, marginBottom: 6 }}>
                  {item.question}
                </p>
                <p style={{ color: '#b8e4bf', fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
                  {item.desc}
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#a8ddb5', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Ver sección <ArrowRight size={10} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <p className="text-[11px] mt-3 text-center font-medium" style={{ color: 'rgba(22,56,50,0.38)' }}>
        Deslizá para ver todas →
      </p>
    </section>
  )
}

// ─── Desktop Aside ─────────────────────────────────────────────

function HomeDesktopAside({ username, isAdmin }: { username: string | null; isAdmin: boolean }) {
  const quickLinks = isAdmin
    ? [{ label: 'Ir a Perfil', href: '/app/perfil' }, { label: 'Panel Admin', href: '/app/adm/dashboard' }]
    : [{ label: 'Ver Perfil', href: '/app/perfil' }, { label: 'Abrir Muro', href: '/app/muro' }]

  return (
    <aside className="hidden lg:flex lg:flex-col gap-4 lg:w-[320px]">
      {/* Atajos */}
      <div className="app-card p-4 space-y-1">
        <p className="app-section-kicker px-2 pt-1 pb-2">Atajos rápidos</p>
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href}
            className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[rgba(22,56,50,0.04)]"
            style={{ color: '#051f20' }}>
            <span className="text-sm font-bold">{link.label}</span>
            <ChevronRight size={16} style={{ color: 'rgba(22,56,50,0.35)' }} />
          </a>
        ))}
        {username && (
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[rgba(220,38,38,0.04)]"
              style={{ color: '#dc2626' }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold">
                <LogOut size={16} /> Cerrar sesión
              </span>
            </button>
          </form>
        )}
      </div>

      {!username && (
        <div className="app-card p-4 space-y-1">
          <p className="app-section-kicker px-2 pt-1 pb-2">Cuenta</p>
          {[
            { href: '/login', icon: <LogIn size={16} />, label: 'Ingresar' },
            { href: '/registro', icon: <UserPlus size={16} />, label: 'Crear cuenta' },
          ].map((l) => (
            <a key={l.href} href={l.href}
              className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[rgba(22,56,50,0.04)]"
              style={{ color: '#051f20' }}>
              <span className="inline-flex items-center gap-2 text-sm font-bold">{l.icon}{l.label}</span>
              <ChevronRight size={16} style={{ color: 'rgba(22,56,50,0.35)' }} />
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}

// ─── Comercios Destacados ──────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  'Restaurante': '🍽️', 'Restaurante familiar': '🍽️',
  'Restaurante de comida para llevar': '🥡', 'Restaurante de comida rápida': '🍔',
  'Cafetería': '☕', 'Tienda de café': '☕',
  'Panadería': '🥐', 'Pizzería': '🍕', 'Pizza para llevar': '🍕',
  'Bar': '🍺', 'Pub': '🍺', 'Pub restaurante': '🍺', 'Cervecería artesanal': '🍻',
  'Club nocturno': '🎵', 'Supermercado': '🛒', 'Tienda de alimentación': '🛒',
  'Tienda general': '🏪', 'Tienda de alimentos naturales': '🌿',
  'Kiosco': '🗞️', 'Quiosco': '🗞️', 'Frutería': '🍎',
  'Pollería': '🍗', 'Comida a domicilio': '🛵', 'Centro comercial': '🏬',
}

interface Comercio {
  id: string; name: string; category: string; rating: number
  phone: string; googleMapsUrl: string
}

function ComerciosDestacados() {
  const [items, setItems] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.from('comercios').eq('isFeatured', true).limit(6).find()
      .then(data => setItems(data as any)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="app-section-kicker mb-1">Para estudiantes</p>
          <h2 className="app-section-title text-xl">Comercios destacados</h2>
        </div>
        <a href="/app/comercios"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider hover:opacity-60 transition-opacity"
          style={{ color: '#163832' }}>
          Ver todos <ChevronRight size={13} />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="app-card overflow-hidden animate-pulse">
                <div className="h-14" style={{ background: 'rgba(22,56,50,0.06)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-2 w-1/3 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
                  <div className="h-3.5 w-2/3 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
                </div>
              </div>
            ))
          : items.filter(Boolean).map(c => {
              const emoji = CATEGORY_EMOJI[c.category] ?? '📍'
              return (
                <TiltCard
                  key={c.id}
                  as="a"
                  href="/app/comercios"
                  strength={12}
                  glareColor="rgba(22,56,50,0.08)"
                  innerStyle={{ borderRadius: 24, background: '#fff', border: '1px solid rgba(22,56,50,0.08)' }}
                  style={{ boxShadow: '0 4px 20px rgba(22,56,50,0.06)' }}
                >
                  <div className="flex items-center justify-center h-14" style={{ background: 'rgba(22,56,50,0.04)' }}>
                    <span className="text-2xl select-none">{emoji}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(22,56,50,0.45)' }}>
                      {c.category}
                    </p>
                    <p className="font-extrabold text-sm leading-snug line-clamp-1" style={{ color: '#051f20' }}>
                      {c.name}
                    </p>
                    {c.rating > 0 && (
                      <p className="text-[10px] mt-1 font-semibold" style={{ color: 'rgba(22,56,50,0.45)' }}>
                        ★ {c.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </TiltCard>
              )
            })}
      </div>
    </section>
  )
}

// ─── Remises ──────────────────────────────────────────────────

interface Remis {
  id: string; nombre: string; telefono: string
  referencia?: string; destacado?: boolean
}

function RemisesSection() {
  const [remises, setRemises] = useState<Remis[]>([])

  useEffect(() => {
    db.from('remises').limit(50).find().then(data => setRemises(data as any)).catch(() => {})
  }, [])

  const principal = remises.find(r => r.destacado) ?? remises[0]
  const otros = remises.filter(r => r.id !== principal?.id).slice(0, 3)
  if (remises.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="app-section-kicker mb-1">Movilidad</p>
          <h2 className="app-section-title text-xl">Remises cercanos</h2>
        </div>
        <a href="/app/transportes"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider hover:opacity-60 transition-opacity"
          style={{ color: '#163832' }}>
          Ver todos <ChevronRight size={13} />
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Card principal con tilt */}
        <TiltCard
          strength={6}
          glareColor="rgba(218,241,222,0.18)"
          innerStyle={{ borderRadius: 20, background: '#163832', padding: '28px', minHeight: 200 }}
          className="lg:col-span-2"
          style={{ minHeight: 200 }}
        >
          <svg className="absolute right-0 top-0 h-full pointer-events-none" viewBox="0 0 200 200" aria-hidden>
            <circle cx="200" cy="100" r="120" fill="none" stroke="#daf1de" strokeWidth="1" opacity="0.12" />
            <circle cx="200" cy="100" r="80" fill="none" stroke="#daf1de" strokeWidth="1" opacity="0.08" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: 144 }}>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
                style={{ background: '#daf1de', color: '#163832' }}>
                Destacado
              </span>
              <h3 className="font-extrabold tracking-tight leading-snug mb-2"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#daf1de' }}>
                {principal.nombre}
              </h3>
              {principal.referencia && (
                <p className="text-sm leading-relaxed" style={{ color: '#b8e4bf' }}>
                  {principal.referencia}
                </p>
              )}
            </div>
            <a href={`tel:${principal.telefono.replace(/\D/g, '')}`}
              className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] self-start"
              style={{ background: '#daf1de', color: '#163832' }}>
              <Phone size={14} /> {principal.telefono}
            </a>
          </div>
        </TiltCard>

        {/* Otros */}
        <div className="flex flex-col gap-3">
          {otros.map(r => (
            <div key={r.id} className="app-card px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm" style={{ color: '#051f20' }}>{r.nombre}</p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(22,56,50,0.5)' }}>{r.telefono}</p>
              </div>
              <a href={`tel:${r.telefono.replace(/\D/g, '')}`}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:opacity-80"
                style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}>
                <Phone size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Eventos ──────────────────────────────────────────────────

interface Evento {
  id: string; title: string; description: string; date: string
  time?: string; location?: string; imageUrl?: string; link?: string; isFeatured?: boolean
}

function EventoModal({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(5,31,32,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#fff', maxHeight: '92dvh' }}
        onClick={e => e.stopPropagation()}>
        {evento.imageUrl
          ? <div className="relative w-full" style={{ height: 200 }}>
              <img src={evento.imageUrl} alt={evento.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,31,32,0.5), transparent 60%)' }} />
            </div>
          : <div className="w-full flex items-center justify-center" style={{ height: 100, background: '#daf1de' }}>
              <span className="text-4xl">🎭</span>
            </div>}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 200px)' }}>
          <div className="sm:hidden w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(22,56,50,0.15)' }} />
          <h2 className="text-xl font-extrabold tracking-tight mb-3" style={{ color: '#051f20' }}>{evento.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {evento.date && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#daf1de', color: '#163832' }}>
                📅 {evento.date}{evento.time ? ` · ${evento.time}` : ''}
              </span>
            )}
            {evento.location && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}>
                📍 {evento.location}
              </span>
            )}
          </div>
          {evento.description && <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(5,31,32,0.7)' }}>{evento.description}</p>}
          <div className="flex gap-3">
            {evento.link && (
              <a href={evento.link} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-center hover:opacity-80 transition-opacity"
                style={{ background: '#163832', color: '#daf1de' }}>
                Ver más info
              </a>
            )}
            <button onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-bold hover:opacity-70 transition-opacity"
              style={{ background: 'rgba(22,56,50,0.07)', color: '#163832' }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventosSection() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selected, setSelected] = useState<Evento | null>(null)

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA')
    db.from('eventos').gte('dateSortable', today).order('dateSortable', { ascending: true }).limit(50).get()
      .then(res => res.data && setEventos(res.data as any)).catch(() => {})
  }, [])

  if (eventos.length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="app-section-kicker mb-1">Agenda</p>
          <h2 className="app-section-title text-xl">Eventos en Pergamino</h2>
        </div>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(22,56,50,0.06)', color: 'rgba(22,56,50,0.5)', border: '1px solid rgba(22,56,50,0.08)' }}>
          ← Deslizá
        </span>
      </div>

      <div style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <div style={{ display: 'inline-flex', gap: 12, paddingRight: 16 }}>
          {eventos.map(ev => (
            <button key={ev.id} onClick={() => setSelected(ev)}
              className="text-left rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform"
              style={{ width: 200, minWidth: 200, flexShrink: 0, background: '#fff', border: '1px solid rgba(22,56,50,0.08)', boxShadow: '0 4px 16px rgba(22,56,50,0.06)' }}>
              {ev.imageUrl
                ? <div style={{ height: 110 }}><img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" /></div>
                : <div className="w-full flex items-center justify-center" style={{ height: 80, background: '#daf1de' }}><span className="text-2xl">🎭</span></div>}
              <div className="p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(22,56,50,0.45)' }}>
                  {ev.date}{ev.time ? ` · ${ev.time}` : ''}
                </p>
                <p className="font-extrabold text-sm leading-snug" style={{ color: '#051f20' }}>{ev.title}</p>
                {ev.location && <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(22,56,50,0.45)' }}>📍 {ev.location}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && <EventoModal evento={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

// ─── PWA Cards ─────────────────────────────────────────────────

function PwaInstallCard() {
  const [prompt, setPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    setStandalone(window.matchMedia('(display-mode: standalone)').matches)
    setDismissed(localStorage.getItem('pwa-card-dismissed') === 'true')
    const h = (e: Event) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  if (standalone || dismissed || !prompt) return null

  return (
    <div className="app-card lg:hidden px-5 py-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <img src="/icons/icon-96.png" className="w-10 h-10 rounded-xl shrink-0" alt="" />
        <div>
          <p className="font-extrabold text-sm" style={{ color: '#051f20' }}>Instalá Recienllegue</p>
          <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'rgba(22,56,50,0.55)' }}>
            Más rápido, sin abrir el browser. Funciona offline.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={async () => { prompt.prompt(); await prompt.userChoice; setPrompt(null) }}
          className="px-4 py-2 rounded-xl text-xs font-bold"
          style={{ background: '#163832', color: '#daf1de' }}>
          Instalar
        </button>
        <button onClick={() => { localStorage.setItem('pwa-card-dismissed', 'true'); setDismissed(true) }}
          className="text-xs font-medium" style={{ color: 'rgba(22,56,50,0.45)' }}>
          Ahora no
        </button>
      </div>
    </div>
  )
}

function PwaInstallPopup() {
  const [show, setShow] = useState(false)
  const [prompt, setPrompt] = useState<any>(null)

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault(); setPrompt(e)
      if (!window.matchMedia('(display-mode: standalone)').matches &&
          localStorage.getItem('pwa-popup-dismissed') !== 'true') setShow(true)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(5,31,32,0.82)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-sm rounded-[32px] p-8 text-center relative overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 18px 50px rgba(22,56,50,0.22)' }}>
        <svg className="absolute top-0 right-0 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="100" cy="0" r="80" fill="none" stroke="#163832" strokeWidth="1" />
          <circle cx="100" cy="0" r="60" fill="none" stroke="#163832" strokeWidth="1" />
        </svg>
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg relative z-10"
          style={{ background: '#163832' }}>🧉</div>
        <h2 className="text-2xl font-black mb-3 tracking-tight" style={{ color: '#051f20' }}>Instalá la App</h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(5,31,32,0.58)' }}>
          Agregá <span className="font-bold">Recienllegue</span> a tu pantalla de inicio para acceder más rápido.
        </p>
        <div className="space-y-3">
          <button onClick={async () => { prompt?.prompt(); await prompt?.userChoice; setShow(false) }}
            className="w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-[0.98]"
            style={{ background: '#163832', color: '#daf1de' }}>
            INSTALAR AHORA
          </button>
          <button onClick={() => { localStorage.setItem('pwa-popup-dismissed', 'true'); setShow(false) }}
            className="w-full py-2 text-xs font-bold uppercase tracking-widest transition-opacity opacity-40 hover:opacity-100"
            style={{ color: '#163832' }}>
            Tal vez más tarde
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Otros cards ───────────────────────────────────────────────

function RedisenoCard() {
  return (
    <div className="rounded-2xl px-7 py-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      style={{ background: 'linear-gradient(135deg, #051f20 0%, #163832 60%, #1e4d44 100%)', border: '1px solid rgba(218,241,222,0.08)' }}>
      <svg className="absolute right-0 top-0 h-full opacity-10 pointer-events-none" viewBox="0 0 300 160" aria-hidden>
        <circle cx="260" cy="30" r="90" fill="none" stroke="#daf1de" strokeWidth="1" />
        <circle cx="260" cy="30" r="60" fill="none" stroke="#daf1de" strokeWidth="1" />
        <circle cx="260" cy="30" r="35" fill="none" stroke="#daf1de" strokeWidth="1" />
      </svg>
      <div className="relative z-10 flex items-start gap-4">
        <span className="text-3xl select-none mt-0.5">🎨</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#a8ddb5' }}>En construcción</p>
          <h3 className="font-extrabold text-base leading-snug mb-1.5" style={{ color: '#daf1de' }}>
            Nos estamos rediseñando.<br />
            <span style={{ color: '#a8ddb5' }}>Porque te lo merecés.</span>
          </h3>
          <p className="text-xs leading-relaxed max-w-sm" style={{ color: '#daf1de', opacity: 0.6 }}>
            Nueva versión con más funciones, mejor diseño y todo lo que nos fuiste pidiendo.
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactCard() {
  const WA = 'https://wa.me/5491124025239?text=Hola%2C%20quiero%20sumar%20mi%20comercio%20a%20Recien%20Llegue'
  return (
    <div className="app-card px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm leading-relaxed" style={{ color: '#235347' }}>
        ¿Tenés un comercio y querés sumarte, o encontraste un bug?{' '}
        <span style={{ color: '#051f20', fontWeight: 700 }}>Escribinos.</span>
      </p>
      <a href={WA} target="_blank" rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: '#163832', color: '#daf1de' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Escribinos por WhatsApp
      </a>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────

export default function InicioPage() {
  const { user } = useUser()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="pb-24 lg:pb-12 lg:px-8 max-w-6xl mx-auto">
      <PwaInstallPopup />

      {/* Top nav desktop */}
      <div className="px-4 sm:px-5 lg:px-0 pt-5 lg:pt-8">
        <AppSectionNav />
      </div>

      {/* Hero + aside */}
      <div className="lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-4 lg:items-start">
        <div
          className="lg:rounded-[32px] lg:overflow-hidden lg:shadow-2xl lg:shadow-[rgba(22,56,50,0.15)]"
          style={{ background: '#163832' }}
        >
          <HeroCarousel username={user?.name || null} />
        </div>
        <HomeDesktopAside username={user?.name || null} isAdmin={isAdmin} />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 mt-8 sm:mt-10 space-y-10 sm:space-y-12">
        <PwaInstallCard />
        <OnboardingSection />
        <EventosSection />
        <ComerciosDestacados />
        <RemisesSection />
        <RedisenoCard />
        <ContactCard />
      </div>
    </div>
  )
}
