'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { MapPin, Users, BadgeCheck, Phone, BedDouble, ChevronRight } from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import HeroParticles from '@/components/HeroParticles'
import GeoPermissionBanner from '@/components/GeoPermissionBanner'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTracking } from '@/hooks/useTracking'

// ─── Types ────────────────────────────────────────────────────

const AMENITY_LABELS: Record<string, { label: string; emoji: string }> = {
  wifi:               { label: 'WiFi',              emoji: '📶' },
  agua_caliente:      { label: 'Agua caliente',     emoji: '🚿' },
  luz_incluida:       { label: 'Luz incluida',      emoji: '💡' },
  gas_incluido:       { label: 'Gas incluido',      emoji: '🔥' },
  cocina:             { label: 'Cocina equipada',   emoji: '🍳' },
  lavarropas:         { label: 'Lavarropas',        emoji: '🌀' },
  amueblado:          { label: 'Amueblado',         emoji: '🪑' },
  aire_acondicionado: { label: 'Aire acondicionado', emoji: '❄️' },
  calefaccion:        { label: 'Calefacción',       emoji: '🌡️' },
  limpieza:           { label: 'Limpieza incluida', emoji: '🧹' },
  desayuno:           { label: 'Desayuno incluido', emoji: '☕' },
  estacionamiento:    { label: 'Estacionamiento',   emoji: '🅿️' },
  seguridad:          { label: 'Seguridad',         emoji: '🔒' },
  patio:              { label: 'Patio / Terraza',   emoji: '🌿' },
  mascotas:           { label: 'Acepta mascotas',   emoji: '🐾' },
}

interface Hospedaje {
  id:           string
  name:         string
  type:         string
  price:        string
  priceMax?:    string
  address:      string
  capacity?:    string
  phone?:       string
  description?: string
  isVerified?:  boolean
  amenities?:   string[]
  images?:      string[]
}

const TYPE_COLORS: Record<string, string> = {
  'Pension':          '#3b82f6',
  'Departamento':     '#8b5cf6',
  'Casa de familia':  '#f59e0b',
  'Habitacion':       '#0EA5E9',
}

const TYPE_OPTIONS = [
  { label: 'Todo', value: '' },
  { label: 'Pensiones', value: 'Pension' },
  { label: 'Departamentos', value: 'Departamento' },
  { label: 'Casa de familia', value: 'Casa de familia' },
  { label: 'Habitaciones', value: 'Habitacion' },
]

// ─── Card ─────────────────────────────────────────────────────

function HospedajeCard({ h }: { h: Hospedaje }) {
  const color = TYPE_COLORS[h.type] ?? '#0F172A'
  const priceLabel = h.priceMax
    ? `${h.price} – ${h.priceMax} / mes`
    : `${h.price} / mes`
  const [imgIdx, setImgIdx] = useState(0)
  const images = h.images ?? []
  const amenities = h.amenities ?? []

  return (
    <div className="app-card flex flex-col h-full overflow-hidden">
      {/* Image gallery */}
      {images.length > 0 ? (
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          <img
            src={images[imgIdx]}
            alt={h.name}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
              >‹</button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
              >›</button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.45)' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}
            >
              {h.type}
            </span>
            {h.isVerified && (
              <span
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: '#E2E8F0', color: '#0F172A' }}
              >
                <BadgeCheck size={10} /> Verificado
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
            {h.name}
          </h3>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <MapPin size={12} style={{ color: 'var(--text-muted-soft)', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{h.address}</p>
          </div>
          {h.capacity && (
            <div className="flex items-center gap-2">
              <Users size={12} style={{ color: 'var(--text-muted-soft)', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{h.capacity}</p>
            </div>
          )}
          {h.description && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {h.description}
            </p>
          )}
          <p className="text-sm font-extrabold mt-1" style={{ color: 'var(--accent)' }}>
            {priceLabel}
          </p>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {amenities.map(id => {
              const a = AMENITY_LABELS[id]
              if (!a) return null
              return (
                <span
                  key={id}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                  style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}
                  title={a.label}
                >
                  {a.emoji} {a.label}
                </span>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {h.phone ? (
          <a
            href={`tel:${h.phone.replace(/\D/g, '')}`}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-80 mt-auto"
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            <Phone size={13} /> {h.phone}
          </a>
        ) : (
          <button
            disabled
            className="w-full py-3 rounded-xl text-sm font-bold mt-auto cursor-not-allowed"
            style={{ background: 'var(--surface-soft)', color: 'rgba(15,23,42,0.3)' }}
          >
            Sin contacto cargado
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function HospedajesPage() {
  const [hospedajes, setHospedajes] = useState<Hospedaje[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('')
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const mountTime = useRef(Date.now())

  const { hasAsked, requestPermission } = useGeolocation()
  const { trackClick, trackTimeOnPage } = useTracking()

  useEffect(() => {
    db.from('hospedajes').latest().limit(50).find()
      .then((data: any) => setHospedajes(data as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Track tiempo en página al salir
  useEffect(() => {
    return () => {
      const seconds = Math.round((Date.now() - mountTime.current) / 1000)
      trackTimeOnPage('/app/hospedajes', seconds)
    }
  }, [trackTimeOnPage])

  const showGeoBanner = !hasAsked && !bannerDismissed

  const handleGeoAllow = async () => {
    setGeoLoading(true)
    await requestPermission('hospedajes_banner')
    setGeoLoading(false)
  }

  const filtered = useMemo(() => {
    if (!selectedType) return hospedajes
    return hospedajes.filter((item) => item.type === selectedType)
  }, [hospedajes, selectedType])

  const verifiedCount = useMemo(
    () => hospedajes.filter((item) => item.isVerified).length,
    [hospedajes]
  )

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">

      <section className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-4">
        <div
          className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
          style={{ background: '#0F172A', position: 'relative' }}
        >
          <HeroParticles />
          <div className="relative z-10 max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#CBD5E1' }}>
              Vivir en Pergamino
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E2E8F0' }}>
              Hospedajes para estudiantes
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#94A3B8' }}>
              Pensiones, departamentos y habitaciones para arrancar más rápido y con información clara.
            </p>
          </div>
        </div>

        <aside className="app-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <p className="app-section-kicker mb-1">Resumen</p>
            <h2 className="app-section-title text-lg">Estado actual</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ background: '#E2E8F0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{hospedajes.length}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>opciones cargadas</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: '#E2E8F0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{verifiedCount}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>verificadas</p>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#E2E8F0' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
              Navegación
            </p>
            <a
              href="/app/inicio"
              className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-[var(--surface)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="text-sm font-bold">Volver al hub principal</span>
              <ChevronRight size={16} style={{ color: 'var(--text-muted-soft)' }} />
            </a>
          </div>
        </aside>
      </section>

      {showGeoBanner && (
        <GeoPermissionBanner
          onAllow={handleGeoAllow}
          onDismiss={() => setBannerDismissed(true)}
          loading={geoLoading}
        />
      )}

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="app-section-kicker mb-1">Filtros</p>
            <h2 className="app-section-title text-xl">Explorá por tipo</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Cargando hospedajes...' : `${filtered.length} resultado${filtered.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TYPE_OPTIONS.map((option) => {
            const active = selectedType === option.value
            return (
              <button
                key={option.value || 'all'}
                onClick={() => setSelectedType(option.value)}
                className="shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: active ? '#0F172A' : '#fff',
                  color: active ? '#E2E8F0' : 'rgba(15,23,42,0.45)',
                  outline: `1px solid ${active ? '#0F172A' : 'rgba(15,23,42,0.09)'}`,
                  border: 'none',
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
            <BedDouble size={18} />
          </div>
          <div>
            <p className="app-section-kicker mb-0.5">Listado</p>
            <h2 className="app-section-title text-xl">Opciones disponibles</h2>
          </div>
        </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="app-card h-56 animate-pulse"
              style={{ background: '#E2E8F0' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="app-card px-5 py-12 text-center"
        >
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted-soft)' }}>
            {hospedajes.length === 0
              ? 'Estamos relevando los hospedajes disponibles. Pronto vas a encontrar opciones con datos útiles para comparar.'
              : 'No hay hospedajes para ese filtro todavía.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(h => (
            <div key={h.id} onClick={() => trackClick(h.id, 'hospedaje', '/app/hospedajes')}>
              <HospedajeCard h={h} />
            </div>
          ))}
        </div>
      )}
      </section>
    </div>
  )
}
