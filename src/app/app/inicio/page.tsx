'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/hooks/useUser'
import {
  Phone, ChevronRight, LogIn, LogOut, UserPlus,
  BedDouble, Bus, ShoppingBag, Megaphone, MapPin,
} from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import { logout } from '@/app/actions/auth'
import ProfileCompleteCard from '@/components/ProfileCompleteCard'

// ─── Quick Actions ─────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Hospedajes', Icon: BedDouble,   href: '/app/hospedajes',  bg: '#E2E8F0', color: '#0F172A' },
  { label: 'Colectivos', Icon: Bus,          href: '/app/transportes', bg: '#EDE9FE', color: '#6D28D9' },
  { label: 'Comercios',  Icon: ShoppingBag,  href: '/app/comercios',   bg: '#FCE7F3', color: '#9D174D' },
  { label: 'Muro',       Icon: Megaphone,    href: '/app/muro',        bg: '#FEF3C7', color: '#92400E' },
]

function QuickActions() {
  return (
    <section>
      <p className="app-section-kicker mb-3">Accesos rápidos</p>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {QUICK_ACTIONS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 14px', borderRadius: 15,
              border: '1px solid rgba(15,23,42,0.09)',
              background: '#fff', minWidth: 66, flexShrink: 0,
              textDecoration: 'none', transition: 'transform 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ width: 36, height: 36, borderRadius: 11, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
              <item.Icon size={17} />
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 9.5, fontWeight: 700, color: '#0F172A', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

// ─── SVG Themes ────────────────────────────────────────────────

function SvgConstruccion() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* Scaffolding poles */}
      <rect x="30" y="38" width="3" height="88" rx="1.5" fill="rgba(226,232,240,0.15)" />
      <rect x="167" y="38" width="3" height="88" rx="1.5" fill="rgba(226,232,240,0.15)" />
      {/* Scaffolding planks */}
      <rect x="28" y="65" width="144" height="3" rx="1.5" fill="rgba(226,232,240,0.1)" />
      <rect x="28" y="88" width="144" height="3" rx="1.5" fill="rgba(226,232,240,0.07)" />
      {/* Ground */}
      <rect x="25" y="126" width="150" height="2.5" rx="1.25" fill="rgba(226,232,240,0.1)" />
      {/* House walls */}
      <rect x="52" y="76" width="96" height="50" rx="3" fill="rgba(226,232,240,0.05)" stroke="rgba(226,232,240,0.18)" strokeWidth="1.5" />
      {/* Roof */}
      <path d="M42 78L100 36L158 78" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door */}
      <rect x="84" y="96" width="32" height="30" rx="3" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" />
      {/* Window */}
      <rect x="60" y="86" width="16" height="16" rx="2" fill="rgba(226,232,240,0.07)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <line x1="68" y1="86" x2="68" y2="102" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      <rect x="124" y="86" width="16" height="16" rx="2" fill="rgba(226,232,240,0.07)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <line x1="132" y1="86" x2="132" y2="102" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      {/* Amber bricks being placed */}
      <rect x="52" y="46" width="8" height="5" rx="1.5" fill="rgba(245,158,11,0.4)" />
      <rect x="64" y="46" width="8" height="5" rx="1.5" fill="rgba(245,158,11,0.35)" />
      <rect x="76" y="46" width="8" height="5" rx="1.5" fill="rgba(245,158,11,0.25)" />
      <rect x="58" y="55" width="8" height="5" rx="1.5" fill="rgba(245,158,11,0.2)" />
      <rect x="70" y="55" width="8" height="5" rx="1.5" fill="rgba(245,158,11,0.15)" />
      {/* Hard hat */}
      <ellipse cx="152" cy="40" rx="16" ry="10" fill="#F59E0B" opacity="0.75" />
      <rect x="136" y="47" width="32" height="5" rx="2.5" fill="#F59E0B" opacity="0.55" />
    </svg>
  )
}

function SvgPropietario() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* House filled shape */}
      <path d="M42 84L100 42L158 84V130H42V84Z" fill="rgba(226,232,240,0.05)" stroke="rgba(226,232,240,0.18)" strokeWidth="1.5" />
      {/* Roof line */}
      <path d="M32 86L100 40L168 86" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door */}
      <rect x="80" y="100" width="40" height="30" rx="4" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" />
      {/* Door knob */}
      <circle cx="116" cy="116" r="2.5" fill="rgba(245,158,11,0.5)" />
      {/* Window left */}
      <rect x="52" y="91" width="20" height="20" rx="3" fill="rgba(226,232,240,0.07)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <line x1="62" y1="91" x2="62" y2="111" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      <line x1="52" y1="101" x2="72" y2="101" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      {/* Window right */}
      <rect x="128" y="91" width="20" height="20" rx="3" fill="rgba(226,232,240,0.07)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <line x1="138" y1="91" x2="138" y2="111" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      <line x1="128" y1="101" x2="148" y2="101" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
      {/* Key */}
      <circle cx="155" cy="38" r="13" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
      <circle cx="155" cy="38" r="5" fill="rgba(245,158,11,0.3)" />
      <line x1="163" y1="46" x2="176" y2="59" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="172" y1="57" x2="172" y2="63" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="176" y1="53" x2="176" y2="59" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      {/* Gratis badge */}
      <rect x="28" y="28" width="52" height="20" rx="10" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />
      <text x="54" y="42" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#10B981" letterSpacing="0.8">GRATIS</text>
      {/* Sparkles */}
      <circle cx="36" cy="70" r="2" fill="rgba(245,158,11,0.3)" />
      <circle cx="170" cy="72" r="1.5" fill="rgba(245,158,11,0.25)" />
      <circle cx="22" cy="55" r="1" fill="rgba(226,232,240,0.2)" />
    </svg>
  )
}

function SvgComunidad() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* Connection lines */}
      <line x1="65" y1="72" x2="100" y2="88" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="135" y1="72" x2="100" y2="88" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="65" y1="72" x2="135" y2="72" stroke="rgba(226,232,240,0.1)" strokeWidth="1" strokeDasharray="4 3" />
      {/* Person left */}
      <circle cx="55" cy="56" r="14" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
      <circle cx="55" cy="50" r="5" fill="rgba(99,102,241,0.5)" />
      <path d="M42 75C42 68 48 63 55 63C62 63 68 68 68 75" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Person right */}
      <circle cx="145" cy="56" r="14" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <circle cx="145" cy="50" r="5" fill="rgba(245,158,11,0.5)" />
      <path d="M132 75C132 68 138 63 145 63C152 63 158 68 158 75" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Person center (larger — featured) */}
      <circle cx="100" cy="90" r="18" fill="rgba(226,232,240,0.08)" stroke="rgba(226,232,240,0.25)" strokeWidth="2" />
      <circle cx="100" cy="83" r="7" fill="rgba(226,232,240,0.35)" />
      <path d="M83 110C83 101 91 95 100 95C109 95 117 101 117 110" stroke="rgba(226,232,240,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Heart above */}
      <path d="M100 38C100 38 107 30 113 30C119 30 122 36 122 40C122 46 100 58 100 58C100 58 78 46 78 40C78 36 81 30 87 30C93 30 100 38 100 38Z" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1.5" />
      {/* UNNOBA tag */}
      <rect x="66" y="122" width="68" height="18" rx="9" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="100" y="135" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="rgba(99,102,241,0.8)" letterSpacing="0.5">UNNOBA · PERGAMINO</text>
    </svg>
  )
}

function SvgTransporte() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* Road */}
      <rect x="0" y="112" width="200" height="16" rx="0" fill="rgba(226,232,240,0.07)" />
      <line x1="20" y1="120" x2="50" y2="120" stroke="rgba(226,232,240,0.15)" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />
      <line x1="80" y1="120" x2="110" y2="120" stroke="rgba(226,232,240,0.15)" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />
      <line x1="140" y1="120" x2="170" y2="120" stroke="rgba(226,232,240,0.15)" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />
      {/* Bus body */}
      <rect x="28" y="55" width="144" height="60" rx="10" fill="rgba(226,232,240,0.07)" stroke="rgba(226,232,240,0.2)" strokeWidth="2" />
      {/* Front accent */}
      <rect x="155" y="62" width="12" height="46" rx="0" fill="rgba(245,158,11,0.08)" />
      {/* Destination sign */}
      <rect x="36" y="62" width="80" height="16" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="76" y="73.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#F59E0B" letterSpacing="0.5">PERGAMINO</text>
      {/* Windows */}
      <rect x="36" y="84" width="24" height="18" rx="4" fill="rgba(226,232,240,0.1)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <rect x="66" y="84" width="24" height="18" rx="4" fill="rgba(226,232,240,0.1)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <rect x="96" y="84" width="24" height="18" rx="4" fill="rgba(226,232,240,0.1)" stroke="rgba(226,232,240,0.2)" strokeWidth="1.5" />
      <rect x="126" y="84" width="18" height="18" rx="4" fill="rgba(226,232,240,0.06)" stroke="rgba(226,232,240,0.15)" strokeWidth="1.5" />
      {/* Wheels */}
      <circle cx="58" cy="114" r="11" fill="rgba(15,23,42,0.8)" stroke="rgba(226,232,240,0.2)" strokeWidth="2" />
      <circle cx="58" cy="114" r="4" fill="rgba(226,232,240,0.15)" />
      <circle cx="142" cy="114" r="11" fill="rgba(15,23,42,0.8)" stroke="rgba(226,232,240,0.2)" strokeWidth="2" />
      <circle cx="142" cy="114" r="4" fill="rgba(226,232,240,0.15)" />
      {/* Headlights */}
      <rect x="158" y="75" width="10" height="8" rx="2" fill="rgba(245,158,11,0.5)" />
      <rect x="158" y="91" width="10" height="6" rx="2" fill="rgba(245,158,11,0.3)" />
      {/* Route number badge */}
      <circle cx="35" cy="47" r="14" fill="rgba(245,158,11,0.15)" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="35" y="51.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#F59E0B">7</text>
    </svg>
  )
}

function SvgBusqueda() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* Background grid dots */}
      {[40,60,80,100,120,140,160].map(x =>
        [35,55,75,95,115].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="rgba(226,232,240,0.08)" />
        ))
      )}
      {/* Magnifying glass circle */}
      <circle cx="90" cy="72" r="36" fill="rgba(226,232,240,0.05)" stroke="rgba(226,232,240,0.2)" strokeWidth="3" />
      <circle cx="90" cy="72" r="26" fill="rgba(226,232,240,0.04)" stroke="rgba(226,232,240,0.12)" strokeWidth="1.5" />
      {/* Inner content — house icon inside */}
      <path d="M80 76L90 64L100 76V86H80V76Z" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <path d="M76 77L90 62L104 77" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Handle */}
      <line x1="116" y1="96" x2="148" y2="128" stroke="rgba(226,232,240,0.35)" strokeWidth="7" strokeLinecap="round" />
      <line x1="116" y1="96" x2="148" y2="128" stroke="rgba(226,232,240,0.15)" strokeWidth="10" strokeLinecap="round" />
      {/* Search ripples */}
      <circle cx="90" cy="72" r="46" stroke="rgba(245,158,11,0.07)" strokeWidth="2" />
      <circle cx="90" cy="72" r="58" stroke="rgba(245,158,11,0.04)" strokeWidth="1.5" />
      {/* Label */}
      <rect x="132" y="38" width="52" height="18" rx="9" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.25)" strokeWidth="1" />
      <text x="158" y="50" textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(245,158,11,0.8)" letterSpacing="0.5">BUSCANDO</text>
    </svg>
  )
}

function SvgMapa() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
      {/* Map background */}
      <rect x="25" y="30" width="150" height="100" rx="10" fill="rgba(226,232,240,0.05)" stroke="rgba(226,232,240,0.15)" strokeWidth="1.5" />
      {/* Grid lines */}
      <line x1="25" y1="63" x2="175" y2="63" stroke="rgba(226,232,240,0.07)" strokeWidth="1" />
      <line x1="25" y1="96" x2="175" y2="96" stroke="rgba(226,232,240,0.07)" strokeWidth="1" />
      <line x1="75" y1="30" x2="75" y2="130" stroke="rgba(226,232,240,0.07)" strokeWidth="1" />
      <line x1="125" y1="30" x2="125" y2="130" stroke="rgba(226,232,240,0.07)" strokeWidth="1" />
      {/* Streets */}
      <path d="M25 75L175 75" stroke="rgba(226,232,240,0.15)" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 30L100 130" stroke="rgba(226,232,240,0.15)" strokeWidth="3" strokeLinecap="round" />
      {/* Location pin */}
      <path d="M100 48C100 48 115 60 115 70C115 78 108 84 100 84C92 84 85 78 85 70C85 60 100 48 100 48Z" fill="#F59E0B" opacity="0.9" />
      <circle cx="100" cy="70" r="5" fill="#0F172A" />
      {/* Pin shadow */}
      <ellipse cx="100" cy="90" rx="8" ry="3" fill="rgba(245,158,11,0.2)" />
      {/* Secondary pins */}
      <circle cx="55" cy="55" r="5" fill="rgba(99,102,241,0.5)" stroke="rgba(99,102,241,0.6)" strokeWidth="1" />
      <circle cx="148" cy="105" r="4" fill="rgba(226,232,240,0.3)" stroke="rgba(226,232,240,0.4)" strokeWidth="1" />
      <circle cx="62" cy="108" r="3.5" fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      {/* Compass */}
      <circle cx="158" cy="42" r="10" fill="rgba(226,232,240,0.08)" stroke="rgba(226,232,240,0.2)" strokeWidth="1" />
      <text x="158" y="46" textAnchor="middle" fontSize="10" fontWeight="800" fill="rgba(245,158,11,0.7)">N</text>
    </svg>
  )
}

// Map of theme id → component
const SVG_THEMES: Record<string, React.FC> = {
  construccion: SvgConstruccion,
  propietario:  SvgPropietario,
  comunidad:    SvgComunidad,
  transporte:   SvgTransporte,
  busqueda:     SvgBusqueda,
  mapa:         SvgMapa,
}

// Auto-select a svgTheme based on message content
function autoTheme(kicker: string, title: string): string {
  const text = `${kicker} ${title}`.toLowerCase()
  if (/construc|relevan|verific|pronto|armando/.test(text)) return 'construccion'
  if (/propietar|publicá|publicar|dueño|dueno|llave|gratis/.test(text)) return 'propietario'
  if (/estudiant|comunidad|muro|unnoba|hecho por|juntos/.test(text)) return 'comunidad'
  if (/colectivo|transporte|bus|linea/.test(text)) return 'transporte'
  if (/busca|encontrá|encontra|busqueda/.test(text)) return 'busqueda'
  if (/mapa|ubicacion|ubicación|zona|barrio/.test(text)) return 'mapa'
  return 'construccion'
}

// ─── Hospedajes Section ────────────────────────────────────────

interface Hospedaje {
  id: string; name: string; type: string; price: string; priceMax?: string
  address: string; phone?: string; isVerified?: boolean; isFeatured?: boolean
  images?: string[]; amenities?: string[]
}

// ─── Hero Messages (fallback cuando no hay hospedaje destacado) ─
// Configurable desde /app/adm — por ahora hardcodeado aquí
// Formato futuro: tabla `hero_messages` { id, kicker, title, body, cta_label, cta_href, active }

interface HeroMessage {
  id: string
  kicker: string
  title: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  badge?: { label: string; color: string }
  svgTheme?: string
}

const HERO_MESSAGES_DEFAULT: HeroMessage[] = [
  {
    id: 'construccion',
    kicker: 'En construcción',
    title: 'Estamos relevando hospedajes.',
    body: 'Verificamos cada opción antes de publicarla. Pronto vas a encontrar pensiones, departamentos y habitaciones con precios reales.',
    ctaLabel: 'Sumar mi hospedaje',
    ctaHref: 'https://wa.me/5491124025239?text=Hola%2C%20quiero%20sumar%20mi%20hospedaje',
    badge: { label: 'Próximamente', color: '#F59E0B' },
    svgTheme: 'construccion',
  },
  {
    id: 'propietario',
    kicker: '¿Tenés un hospedaje?',
    title: 'Publicá gratis en Recién Llegué.',
    body: 'Miles de estudiantes buscan alojamiento cada año. Sumá tu pensión, depto o habitación y llegá directo a ellos sin comisiones.',
    ctaLabel: 'Escribinos por WhatsApp',
    ctaHref: 'https://wa.me/5491124025239?text=Hola%2C%20quiero%20publicar%20mi%20hospedaje',
    badge: { label: 'Gratis', color: '#10B981' },
    svgTheme: 'propietario',
  },
  {
    id: 'comunidad',
    kicker: 'Hecho por estudiantes',
    title: 'La info que nadie te da cuando llegás.',
    body: 'Pergamino tiene mucho para ofrecer. Estamos armando la guía más completa de alojamiento para que tu llegada sea más fácil.',
    ctaLabel: 'Ver el muro',
    ctaHref: '/app/muro',
    badge: { label: 'UNNOBA · Pergamino', color: '#6366F1' },
    svgTheme: 'comunidad',
  },
]

const CARD_H_MOBILE  = 230
const CARD_H_DESKTOP = 260

type CarouselItem =
  | { kind: 'hospedaje'; data: Hospedaje }
  | { kind: 'message';   data: HeroMessage }

function HeroCarousel({ items }: { items: CarouselItem[] }) {
  const [idx, setIdx] = useState(0)
  const total = items.length

  // Auto-avanza cada 5s, se pausa al hover
  const paused = useRef(false)
  useEffect(() => {
    if (total < 2) return
    const id = setInterval(() => {
      if (!paused.current) setIdx(i => (i + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [total])

  const item = items[idx]

  const inner =
    item.kind === 'hospedaje'
      ? <HospedajeHeroSlide h={item.data} />
      : <MessageHeroSlide msg={item.data} />

  return (
    <div
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      {inner}

      {/* Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 mt-2.5">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 20 : 6, height: 6,
                borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0,
                background: i === idx
                  ? '#0F172A'
                  : it.kind === 'hospedaje'
                    ? 'rgba(15,23,42,0.25)'
                    : 'rgba(15,23,42,0.12)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function HospedajeHeroSlide({ h }: { h: Hospedaje }) {
  const imgs = h.images ?? []
  const [imgIdx, setImgIdx] = useState(0)

  // Auto-avanza imágenes cada 3s
  useEffect(() => {
    if (imgs.length < 2) return
    const id = setInterval(() => setImgIdx(i => (i + 1) % imgs.length), 3000)
    return () => clearInterval(id)
  }, [imgs.length])

  const RightMedia = () => {
    if (imgs.length === 0) {
      return (
        <div className="rounded-xl w-full h-full flex items-center justify-center" style={{
          background: 'repeating-linear-gradient(45deg,rgba(226,232,240,0.04) 0,rgba(226,232,240,0.04) 1px,transparent 1px,transparent 8px),rgba(226,232,240,0.06)',
        }}>
          <BedDouble size={32} style={{ color: 'rgba(226,232,240,0.2)' }} />
        </div>
      )
    }
    if (imgs.length === 1) {
      return <img src={imgs[0]} alt={h.name} className="rounded-xl w-full h-full object-cover" style={{ minHeight: 0 }} />
    }
    // 2+ imágenes: grid 2 columnas o animado
    return (
      <div className="relative rounded-xl overflow-hidden w-full h-full">
        <img
          src={imgs[imgIdx]}
          alt={h.name}
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ minHeight: 0 }}
        />
        {/* Contador de fotos */}
        <div className="absolute bottom-1.5 right-1.5 flex gap-1">
          {imgs.slice(0, 4).map((_, i) => (
            <div key={i} style={{
              width: i === imgIdx ? 14 : 5, height: 5, borderRadius: 999,
              background: i === imgIdx ? '#F59E0B' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <a href="/app/hospedajes" className="rounded-[20px] overflow-hidden mb-1 relative" style={{ background: '#0F172A', textDecoration: 'none', display: 'block' }}>
      {/* Mobile image background overlay */}
      {imgs.length > 0 && (
        <div className="lg:hidden absolute inset-0">
          <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.95) 40%, rgba(15,23,42,0.6))' }} />
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(148,163,184,0.1), transparent 60%)' }} />

      {/* Mobile */}
      <div className="lg:hidden relative z-10 p-5 flex flex-col justify-between" style={{ height: CARD_H_MOBILE }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: '#F59E0B', color: '#0F172A' }}>
              Hospedaje
            </span>
            {h.isVerified && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: 'rgba(226,232,240,0.15)', color: '#E2E8F0' }}>
                Verificado
              </span>
            )}
            {imgs.length > 0 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(226,232,240,0.12)', color: 'rgba(226,232,240,0.6)' }}>
                📷 {imgs.length}
              </span>
            )}
          </div>
          <h3 className="font-bold text-base leading-snug line-clamp-1" style={{ color: '#fff' }}>{h.name}</h3>
          <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
            <MapPin size={10} /> <span className="line-clamp-1">{h.address}</span>
          </p>
          {h.type && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(226,232,240,0.35)' }}>{h.type}</p>}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-extrabold text-lg" style={{ color: '#E2E8F0' }}>
            {h.price}<span className="text-[10px] font-normal opacity-40 ml-1">/mes</span>
          </p>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold" style={{ background: '#F59E0B', color: '#0F172A' }}>
            Ver más →
          </span>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid relative z-10 p-[22px] gap-4" style={{ gridTemplateColumns: '1fr 1fr', height: CARD_H_DESKTOP }}>
        <div className="flex flex-col justify-between overflow-hidden">
          <div>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2" style={{ background: '#F59E0B', color: '#0F172A' }}>
              Hospedaje
            </span>
            <h3 className="font-bold leading-snug line-clamp-1" style={{ fontSize: 15, color: '#fff' }}>{h.name}</h3>
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{h.address}</p>
          </div>
          <div>
            <p className="font-extrabold mb-2" style={{ fontSize: 22, color: '#E2E8F0' }}>
              {h.price}<span className="text-xs font-normal opacity-40 ml-1">/mes</span>
            </p>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold" style={{ background: '#F59E0B', color: '#0F172A' }}>
              Ver más →
            </span>
          </div>
        </div>
        <div style={{ minHeight: 0 }}>
          <RightMedia />
        </div>
      </div>
    </a>
  )
}

function MessageHeroSlide({ msg }: { msg: HeroMessage }) {
  return (
    <a
      href={msg.ctaHref ?? '/app/hospedajes'}
      target={msg.ctaHref?.startsWith('http') ? '_blank' : undefined}
      rel={msg.ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="rounded-[20px] overflow-hidden mb-1 relative"
      style={{ background: '#0F172A', textDecoration: 'none', display: 'block' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(148,163,184,0.15), transparent 60%)' }} />

      {/* Mobile */}
      <div className="lg:hidden relative z-10 p-5 flex flex-col justify-between" style={{ height: CARD_H_MOBILE }}>
        <div>
          {msg.badge && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2" style={{ background: msg.badge.color, color: '#0F172A' }}>
              {msg.badge.label}
            </span>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>{msg.kicker}</p>
          <h3 className="font-bold text-sm leading-snug mb-1.5" style={{ color: '#fff' }}>{msg.title}</h3>
          <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: 'rgba(226,232,240,0.5)' }}>{msg.body}</p>
        </div>
        {msg.ctaLabel && (
          <span className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold" style={{ background: '#F59E0B', color: '#0F172A' }}>
            {msg.ctaLabel} →
          </span>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid relative z-10 p-[22px] gap-4" style={{ gridTemplateColumns: '1fr 1fr', height: CARD_H_DESKTOP }}>
        <div className="flex flex-col justify-between overflow-hidden">
          <div>
            {msg.badge && (
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2" style={{ background: msg.badge.color, color: '#0F172A' }}>
                {msg.badge.label}
              </span>
            )}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>{msg.kicker}</p>
            <h3 className="font-bold leading-snug mb-1.5 line-clamp-2" style={{ fontSize: 15, color: '#fff' }}>{msg.title}</h3>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'rgba(226,232,240,0.5)' }}>{msg.body}</p>
          </div>
          {msg.ctaLabel && (
            <span className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold" style={{ background: '#F59E0B', color: '#0F172A' }}>
              {msg.ctaLabel} →
            </span>
          )}
        </div>
        <div className="rounded-xl flex items-center justify-center overflow-hidden" style={{
          background: 'repeating-linear-gradient(45deg,rgba(226,232,240,0.025) 0,rgba(226,232,240,0.025) 1px,transparent 1px,transparent 8px)',
          padding: '12px 8px',
        }}>
          {(() => {
            const theme = msg.svgTheme ?? autoTheme(msg.kicker, msg.title)
            const SvgComp = SVG_THEMES[theme]
            return SvgComp ? <SvgComp /> : <BedDouble size={32} style={{ color: 'rgba(226,232,240,0.15)' }} />
          })()}
        </div>
      </div>
    </a>
  )
}

function HospedajesSection() {
  const [items, setItems] = useState<Hospedaje[]>([])
  const [heroMessages, setHeroMessages] = useState<HeroMessage[]>(HERO_MESSAGES_DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load hospedajes
    db.from('hospedajes').latest().limit(20).find()
      .then((data: any) => setItems(data as any))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Load hero_messages from DB (overrides hardcoded if any active exist)
    db.from('heromessages').eq('active', true).latest().limit(10).find()
      .then((data: any) => {
        const rows = data as any[]
        if (!rows || rows.length === 0) return
        setHeroMessages(rows.map((r: any) => ({
          id: r.id,
          kicker: r.kicker ?? '',
          title: r.title ?? '',
          body: r.body ?? '',
          ctaLabel: r.ctaLabel ?? undefined,
          ctaHref: r.ctaHref ?? undefined,
          badge: r.badgeLabel ? { label: r.badgeLabel, color: r.badgeColor ?? '#F59E0B' } : undefined,
          svgTheme: r.svgTheme ?? undefined,
        })))
      })
      .catch(() => {})
  }, [])

  // Carrusel unificado: hospedajes primero, luego mensajes
  const carouselItems: CarouselItem[] = [
    ...items.map(h => ({ kind: 'hospedaje' as const, data: h })),
    ...heroMessages.map(m => ({ kind: 'message' as const, data: m })),
  ]

  // Mini cards: todos los hospedajes excepto el primero (el featured del carrusel)
  const mini = items.slice(1, 7)

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="app-section-kicker mb-0.5">Alojamiento</p>
          <h2 className="app-section-title text-xl">Hospedajes</h2>
        </div>
        <a href="/app/hospedajes" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider hover:opacity-60 transition-opacity" style={{ color: '#0F172A' }}>
          Ver todo <ChevronRight size={13} />
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="rounded-2xl h-44 animate-pulse" style={{ background: '#E2E8F0' }} />
          <div className="flex gap-3 overflow-hidden">
            {[1,2,3].map(i => <div key={i} className="rounded-2xl h-20 w-28 shrink-0 animate-pulse" style={{ background: '#E2E8F0' }} />)}
          </div>
        </div>
      ) : (
        <>
          <HeroCarousel items={carouselItems} />

          {/* Mini-cards — solo si hay hospedajes adicionales */}
          {mini.length > 0 && (
            <div className="mt-3">
              {/* Mobile: horizontal scroll */}
              <div className="lg:hidden" style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
                {mini.map(h => {
                  const thumb = h.images?.[0]
                  return (
                    <a
                      key={h.id}
                      href="/app/hospedajes"
                      className="shrink-0 rounded-2xl p-3 flex flex-col gap-1.5"
                      style={{ minWidth: 130, background: '#fff', border: '1px solid rgba(15,23,42,0.08)', textDecoration: 'none' }}
                    >
                      <div className="w-full h-14 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: '#E2E8F0' }}>
                        {thumb
                          ? <img src={thumb} alt={h.name} className="w-full h-full object-cover" />
                          : <BedDouble size={18} style={{ color: '#64748B' }} />
                        }
                      </div>
                      <p className="font-bold text-xs leading-snug line-clamp-1" style={{ color: '#0F172A' }}>{h.name}</p>
                      <p className="text-[10px] font-semibold" style={{ color: '#F59E0B' }}>{h.price}/mes</p>
                    </a>
                  )
                })}
              </div>

              {/* Desktop: 3-col grid */}
              <div className="hidden lg:grid gap-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                {mini.slice(0, 3).map(h => {
                  const thumb = h.images?.[0]
                  return (
                    <a
                      key={h.id}
                      href="/app/hospedajes"
                      className="rounded-[14px] p-3.5 flex flex-col gap-2"
                      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)', textDecoration: 'none' }}
                    >
                      <div className="w-full rounded-lg overflow-hidden flex items-center justify-center" style={{ height: 64, background: '#E2E8F0' }}>
                        {thumb
                          ? <img src={thumb} alt={h.name} className="w-full h-full object-cover" />
                          : <BedDouble size={20} style={{ color: '#64748B' }} />
                        }
                      </div>
                      <p className="font-bold text-xs leading-snug line-clamp-1" style={{ color: '#0F172A' }}>{h.name}</p>
                      <p className="text-[10px] font-semibold" style={{ color: 'rgba(15,23,42,0.45)' }}>{h.type} · {h.address?.split(',')[0]}</p>
                      <p className="font-extrabold text-sm" style={{ color: '#0F172A' }}>{h.price}<span className="text-[10px] font-normal opacity-40">/mes</span></p>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// ─── Muro Preview ──────────────────────────────────────────────

interface Post {
  id: string; title: string; category: string; content?: string
  authorName?: string; createdAt?: string
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Avisos':       { bg: '#DBEAFE', color: '#1E40AF' },
  'Consultas':    { bg: '#E0E7FF', color: '#4338CA' },
  'Compraventa':  { bg: '#FCE7F3', color: '#9D174D' },
  'Eventos':      { bg: '#FEF3C7', color: '#92400E' },
  'General':      { bg: '#F1F5F9', color: '#475569' },
}

function MuroPreview() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.from('muro_posts').latest().limit(2).find()
      .then((data: any) => setPosts(data as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="app-section-kicker mb-1">Comunidad</p>
          <h2 className="app-section-title text-xl">Muro</h2>
        </div>
        <a
          href="/app/muro"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider hover:opacity-60 transition-opacity"
          style={{ color: '#0F172A' }}
        >
          Ver todo <ChevronRight size={13} />
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="app-card h-16 animate-pulse" style={{ background: '#E2E8F0' }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="app-card px-5 py-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted-soft)' }}>Sé el primero en publicar en el muro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['General']
            const initials = post.authorName
              ? post.authorName.split(' ').map((w:string) => w[0]).join('').slice(0,2).toUpperCase()
              : '?'
            return (
              <a
                key={post.id}
                href="/app/muro"
                className="app-card px-4 py-4 flex items-center gap-3"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: '#E2E8F0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#475569',
                }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: cat.bg, color: cat.color }}>
                      {post.category}
                    </span>
                  </div>
                  <p className="font-bold text-sm leading-snug line-clamp-1" style={{ color: '#0F172A' }}>{post.title}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'rgba(15,23,42,0.3)', flexShrink: 0 }} />
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}

// ─── Desktop Aside ─────────────────────────────────────────────

function HomeDesktopAside({ username, isAdmin }: { username: string | null; isAdmin: boolean }) {
  const quickLinks = isAdmin
    ? [{ label: 'Ir a Perfil', href: '/app/perfil' }, { label: 'Panel Admin', href: '/app/adm/dashboard' }]
    : [{ label: 'Ver Perfil', href: '/app/perfil' }, { label: 'Abrir Muro', href: '/app/muro' }]

  return (
    <aside className="hidden lg:flex lg:flex-col gap-4">
      <div className="app-card p-4 space-y-1">
        <p className="app-section-kicker px-2 pt-1 pb-2">Atajos</p>
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href}
            className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[rgba(15,23,42,0.04)]"
            style={{ color: '#0F172A' }}>
            <span className="text-sm font-bold">{link.label}</span>
            <ChevronRight size={16} style={{ color: 'rgba(15,23,42,0.35)' }} />
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
              className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[rgba(15,23,42,0.04)]"
              style={{ color: '#0F172A' }}>
              <span className="inline-flex items-center gap-2 text-sm font-bold">{l.icon}{l.label}</span>
              <ChevronRight size={16} style={{ color: 'rgba(15,23,42,0.35)' }} />
            </a>
          ))}
        </div>
      )}

      {/* Muro preview on desktop */}
      <MuroPreview />
    </aside>
  )
}

// ─── PWA Install Popup ─────────────────────────────────────────

function PwaInstallPopup() {
  const [show, setShow] = useState(false)
  const [prompt, setPrompt] = useState<any>(null)

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault(); setPrompt(e)
      if (window.matchMedia('(display-mode: standalone)').matches ||
          localStorage.getItem('pwa-popup-dismissed') === 'true') return

      const visits = Number(localStorage.getItem('rl_app_visits') ?? '0') + 1
      localStorage.setItem('rl_app_visits', String(visits))
      if (visits < 2) return

      window.setTimeout(() => setShow(true), 8000)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-sm rounded-[32px] p-8 text-center relative overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 18px 50px rgba(15,23,42,0.22)' }}>
        <svg className="absolute top-0 right-0 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="100" cy="0" r="80" fill="none" stroke="#0F172A" strokeWidth="1" />
          <circle cx="100" cy="0" r="60" fill="none" stroke="#0F172A" strokeWidth="1" />
        </svg>
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg relative z-10"
          style={{ background: '#0F172A' }}>🧉</div>
        <h2 className="text-2xl font-black mb-3 tracking-tight" style={{ color: '#0F172A' }}>Instalá la App</h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(15,23,42,0.58)' }}>
          Agregá <span className="font-bold">Recienllegue</span> a tu pantalla de inicio para acceder más rápido.
        </p>
        <div className="space-y-3">
          <button onClick={async () => { prompt?.prompt(); await prompt?.userChoice; setShow(false) }}
            className="w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-[0.98]"
            style={{ background: '#0F172A', color: '#F59E0B' }}>
            INSTALAR AHORA
          </button>
          <button onClick={() => { localStorage.setItem('pwa-popup-dismissed', 'true'); setShow(false) }}
            className="w-full py-2 text-xs font-bold uppercase tracking-widest transition-opacity opacity-40 hover:opacity-100"
            style={{ color: '#0F172A' }}>
            Tal vez más tarde
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Contact Card ──────────────────────────────────────────────

function ContactCard() {
  const WA = 'https://wa.me/5491124025239?text=Hola%2C%20quiero%20sumar%20mi%20comercio%20a%20Recien%20Llegue'
  return (
    <div className="app-card px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm leading-relaxed" style={{ color: '#1E3A5F' }}>
        ¿Tenés un comercio y querés sumarte, o encontraste un bug?{' '}
        <span style={{ color: '#0F172A', fontWeight: 700 }}>Escribinos.</span>
      </p>
      <a href={WA} target="_blank" rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: '#0F172A', color: '#F59E0B' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Escribinos por WhatsApp
      </a>
    </div>
  )
}

function DuenoOnboardingCard({ missingFields }: { missingFields: string[] }) {
  const ready = missingFields.length === 0

  return (
    <div
      className="app-card px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{ borderLeft: '3px solid #F59E0B' }}
    >
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(15,23,42,0.45)' }}>
          Cuenta comercio
        </p>
        <p className="text-base font-extrabold" style={{ color: '#0F172A' }}>
          {ready ? 'Ya tenés tu contacto cargado' : 'Terminá de preparar tu perfil comercial'}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(15,23,42,0.55)' }}>
          {ready
            ? 'Podés escribirnos para sumar tu comercio u hospedaje al relevamiento.'
            : 'Agregá un teléfono de contacto para que podamos validar y publicar tu comercio más rápido.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        {!ready && (
          <a
            href="/app/perfil"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all hover:opacity-85"
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            Completar perfil <ChevronRight size={13} />
          </a>
        )}
        <a
          href="https://wa.me/5491124025239?text=Hola%2C%20quiero%20sumar%20mi%20comercio%20a%20Recien%20Llegue"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all hover:opacity-85"
          style={{ background: ready ? '#0F172A' : '#E2E8F0', color: ready ? '#F59E0B' : '#0F172A' }}
        >
          <Phone size={13} /> Escribir por WhatsApp
        </a>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────

export default function InicioPage() {
  const { user, isLoggedIn } = useUser()
  const isAdmin = user?.role === 'admin'
  const isDueno = user?.role === 'dueno'
  const [missingProfileFields, setMissingProfileFields] = useState<string[]>([])

  // Cargar perfil para detectar campos faltantes
  useEffect(() => {
    if (!user) return
    db.from('profiles').eq('userId', user.id).find()
      .then((res: any) => {
        const profile = res[0]
        if (!profile) return
        const missing: string[] = []
        const role = profile.role ?? user.role
        if (role === 'dueno') {
          if (!profile.contact) missing.push('contact')
        } else {
          if (!profile.career)        missing.push('career')
          if (!profile.city_origin)   missing.push('city_origin')
          if (!profile.year_of_study) missing.push('year_of_study')
        }
        setMissingProfileFields(missing)
      })
      .catch(() => {})
  }, [user])

  return (
    <div className="pb-24 lg:pb-12 max-w-6xl mx-auto lg:px-0">
      <PwaInstallPopup />

      {/* Mobile: greeting + quick actions en la misma sección */}
      <div className="lg:hidden px-4 sm:px-5 pt-5 pb-0">
        {/* Fila saludo + avatar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-medium" style={{ color: 'rgba(15,23,42,0.45)' }}>Buen día</p>
            <h1 className="font-black tracking-tight leading-none mt-0.5" style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.5rem, 6vw, 1.75rem)', color: '#0F172A' }}>
              {user?.name?.split(' ')[0] ?? 'Bienvenido'} 👋
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin size={11} style={{ color: 'rgba(15,23,42,0.4)' }} />
              <span className="text-[11px] font-medium" style={{ color: 'rgba(15,23,42,0.4)' }}>Pergamino, Buenos Aires</span>
            </div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: user?.name
              ? `hsl(${[...(user.name)].reduce((a,c)=>a+c.charCodeAt(0),0) % 360},42%,56%)`
              : '#E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-head)',
          }}>
            {user?.name?.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase() ?? '?'}
          </div>
        </div>

        {/* Quick actions — alineados al ancho del saludo */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {QUICK_ACTIONS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                padding: '14px 16px', borderRadius: 16,
                border: '1px solid rgba(15,23,42,0.09)',
                background: '#fff', minWidth: 76, flexShrink: 0,
                textDecoration: 'none', transition: 'transform 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <item.Icon size={19} />
              </div>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 10.5, fontWeight: 700, color: '#0F172A', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop header row: greeting + quick actions */}
      <div className="hidden lg:flex items-end justify-between px-8 pt-8 mb-6">
        <div>
          <p className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.45)' }}>Buen día</p>
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-head)', color: '#0F172A' }}>
            {user?.name?.split(' ')[0] ?? 'Bienvenido'} 👋
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {QUICK_ACTIONS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                padding: '14px 18px', borderRadius: 16,
                border: '1px solid rgba(15,23,42,0.09)',
                background: '#fff', minWidth: 80,
                textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 13, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <item.Icon size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, color: '#0F172A', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Profile complete card */}
      {isLoggedIn && missingProfileFields.length > 0 && (
        <div className="px-4 sm:px-5 lg:px-8 mt-4">
          <ProfileCompleteCard
            missingFields={missingProfileFields}
            variant={isDueno ? 'dueno' : undefined}
          />
        </div>
      )}

      {isLoggedIn && isDueno && (
        <div className="px-4 sm:px-5 lg:px-8 mt-4">
          <DuenoOnboardingCard missingFields={missingProfileFields} />
        </div>
      )}

      {/* Main content */}
      <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6 lg:items-start mt-6 px-4 sm:px-5 lg:px-8">
        {/* Left col */}
        <div className="space-y-8">
          <HospedajesSection />
          {/* Muro preview on mobile */}
          <div className="lg:hidden">
            <MuroPreview />
          </div>
          <ContactCard />
        </div>

        {/* Right col desktop: aside with muro */}
        <HomeDesktopAside username={user?.name || null} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
