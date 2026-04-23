'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Star,
  Store,
  Heart,
  X,
} from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import HeroParticles from '@/components/HeroParticles'
import GeoPermissionBanner from '@/components/GeoPermissionBanner'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTracking } from '@/hooks/useTracking'
import { useUser } from '@/hooks/useUser'
import PublicShareButton from '@/components/PublicShareButton'
import { loadSavedItems, upsertSavedItem, deleteSavedItem, type SavedItem } from '@/lib/user-saved-items'

interface Comercio {
  id: string
  name: string
  category: string
  rating: number
  reviewsCount: number
  address: string
  phone: string
  googleMapsUrl: string
  distanceMeters: number | null
  walkTime: string
  isFeatured: boolean
  isVerified: boolean
  lat: number | null
  lng: number | null
  updatedAt?: string
  createdAt?: string
}

function relativeUpdated(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const days = Math.floor((Date.now() - date.getTime()) / 86400000)
  if (days <= 0) return 'Actualizado hoy'
  if (days === 1) return 'Actualizado hace 1 día'
  if (days < 30) return `Actualizado hace ${days} días`
  return `Actualizado hace ${Math.floor(days / 30)} meses`
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const LIMIT = 12

const CATEGORIES = [
  { label: 'Todo', value: '' },
  { label: 'Restaurantes', value: 'Restaurante' },
  { label: 'Cafés', value: 'Cafetería' },
  { label: 'Panaderías', value: 'Panadería' },
  { label: 'Pizzerías', value: 'Pizzería' },
  { label: 'Bares', value: 'Bar' },
  { label: 'Supermercados', value: 'Supermercado' },
  { label: 'Kioscos', value: 'Kiosco' },
]

const CATEGORY_EMOJI: Record<string, string> = {
  Restaurante: '🍽️',
  'Restaurante familiar': '🍽️',
  'Restaurante de comida para llevar': '🥡',
  'Restaurante de comida rápida': '🍔',
  Cafetería: '☕',
  'Tienda de café': '☕',
  Panadería: '🥐',
  Pizzería: '🍕',
  'Pizza para llevar': '🍕',
  Bar: '🍺',
  Pub: '🍺',
  'Pub restaurante': '🍺',
  'Cervecería artesanal': '🍻',
  'Club nocturno': '🎵',
  Supermercado: '🛒',
  'Tienda de alimentación': '🛒',
  'Tienda general': '🏪',
  'Tienda de alimentos naturales': '🌿',
  Kiosco: '🗞️',
  Quiosco: '🗞️',
  Frutería: '🍎',
  Pollería: '🍗',
  'Comida a domicilio': '🛵',
  'Centro comercial': '🏬',
  Comercio: '🏪',
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          fill={i <= full ? 'var(--accent)' : 'none'}
          stroke={i <= full ? 'var(--accent)' : 'rgba(15,23,42,0.25)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="app-card overflow-hidden animate-pulse">
      <div className="h-20 w-full" style={{ background: '#E2E8F0' }} />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded-full" style={{ background: 'rgba(15,23,42,0.06)' }} />
        <div className="h-4 w-3/4 rounded-full" style={{ background: 'rgba(15,23,42,0.06)' }} />
        <div className="h-3 w-1/2 rounded-full" style={{ background: 'rgba(15,23,42,0.06)' }} />
        <div className="h-10 w-full rounded-2xl" style={{ background: '#E2E8F0' }} />
      </div>
    </div>
  )
}

function walkLabel(meters: number): string {
  const mins = Math.round(meters / 80)
  if (mins <= 1) return '1 min a pie'
  if (mins < 60) return `${mins} min a pie`
  return `${Math.round(mins / 60)}h a pie`
}

function ComercioCard({
  comercio,
  getDistanceKm,
  canClaim,
  saved,
  onSave,
  onRemove,
  onContact,
}: {
  comercio: Comercio
  getDistanceKm?: (lat: number, lng: number) => number | null
  canClaim: boolean
  saved?: SavedItem
  onSave: (comercio: Comercio) => void
  onRemove: (saved: SavedItem) => void
  onContact: (comercio: Comercio) => void
}) {
  const emoji = CATEGORY_EMOJI[comercio.category] ?? '📍'

  const userDistanceLabel = (() => {
    if (!getDistanceKm || comercio.lat == null || comercio.lng == null) return null
    const km = getDistanceKm(comercio.lat, comercio.lng)
    if (km == null) return null
    return walkLabel(km * 1000)
  })()

  return (
    <article className="app-card overflow-hidden flex flex-col h-full">
      <div
        className="relative flex items-center justify-center h-20 shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.08), rgba(15,23,42,0.02))' }}
      >
        <span className="text-4xl select-none">{emoji}</span>

        {comercio.isFeatured && (
          <span
            className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: '#F59E0B', color: '#0F172A' }}
          >
            Destacado
          </span>
        )}

        {comercio.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <Star size={10} fill="var(--accent)" stroke="none" />
            <span className="text-[11px] font-bold" style={{ color: 'var(--accent)' }}>
              {comercio.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
            {comercio.category}
          </p>
          <h3 className="font-extrabold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {comercio.name}
          </h3>
        </div>

        <div className="flex flex-col gap-1.5">
          {comercio.reviewsCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Stars rating={comercio.rating} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {comercio.reviewsCount.toLocaleString('es-AR')} reseñas
              </span>
            </div>
          )}

          {(userDistanceLabel || comercio.walkTime) && (
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={11} style={{ color: userDistanceLabel ? 'var(--accent)' : undefined }} />
              <span className="text-[10px] font-medium" style={{ color: userDistanceLabel ? 'var(--accent)' : undefined }}>
                {userDistanceLabel ?? comercio.walkTime}
              </span>
              {!userDistanceLabel && comercio.walkTime && (
                <span className="text-[9px] opacity-50">desde UNNOBA</span>
              )}
            </div>
          )}

          {comercio.address && (
            <p className="text-[10px] leading-snug line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {comercio.address}
            </p>
          )}
          {relativeUpdated(comercio.updatedAt || comercio.createdAt) && (
            <p className="text-[10px]" style={{ color: 'var(--text-muted-soft)' }}>
              {relativeUpdated(comercio.updatedAt || comercio.createdAt)}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          {comercio.phone ? (
            <a
              href={`tel:${comercio.phone.replace(/\s/g, '')}`}
              onClick={() => onContact(comercio)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-90"
              style={{ background: 'rgba(15,23,42,0.06)', color: '#1E3A5F' }}
            >
              <Phone size={12} /> Llamar
            </a>
          ) : (
            <div
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-[11px] font-semibold"
              style={{ background: 'var(--surface-soft)', color: 'var(--text-muted-soft)' }}
            >
              Sin teléfono
            </div>
          )}

          {comercio.googleMapsUrl && (
            <a
              href={comercio.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 rounded-xl transition-colors hover:opacity-80"
              style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
        <div onClick={(event) => event.stopPropagation()} className="grid grid-cols-1 gap-2">
          {saved ? (
            <button onClick={() => onRemove(saved)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <Heart size={12} fill="currentColor" /> Guardado
            </button>
          ) : (
            <button onClick={() => onSave(comercio)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
              <Heart size={12} /> Guardar comercio
            </button>
          )}
        </div>
        <div onClick={(event) => event.stopPropagation()} className="grid grid-cols-2 gap-2">
          <a
            href={`/app/comercios/${comercio.id}`}
            className="flex items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-90"
            style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
          >
            Ver detalle
          </a>
          <PublicShareButton title={comercio.name} text="Mirá este comercio en Recién Llegué" url={`/comercios/${comercio.id}`} />
        </div>
        {canClaim && (
          <a
            href={`/app/propietario?claim=${encodeURIComponent(comercio.id)}&name=${encodeURIComponent(comercio.name)}`}
            onClick={(event) => event.stopPropagation()}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-90"
            style={{ background: '#FEF3C7', color: '#92400e' }}
          >
            <Store size={12} /> ¿Es tu comercio? Reclamar
          </a>
        )}
      </div>
    </article>
  )
}

function Paginator({ pagination, onChange }: { pagination: Pagination; onChange: (page: number) => void }) {
  const { page, pages } = pagination
  if (pages <= 1) return null

  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)

    const items: (number | '...')[] = [1]
    if (page > 3) items.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i += 1) items.push(i)
    if (page < pages - 2) items.push('...')
    items.push(pages)
    return items
  }

  const btn = (content: React.ReactNode, target: number, active = false, disabled = false) => (
    <button
      key={`${target}-${String(content)}`}
      onClick={() => !disabled && onChange(target)}
      disabled={disabled}
      className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all"
      style={{
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--accent-contrast)' : disabled ? 'rgba(15,23,42,0.2)' : 'var(--accent)',
        border: `1px solid ${active ? 'transparent' : 'var(--border-subtle)'}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {content}
    </button>
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {btn(<ChevronLeft size={14} />, page - 1, false, page === 1)}
      {getPages().map((item, index) =>
        item === '...'
          ? (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted-soft)' }}>
              …
            </span>
            )
          : btn(item, item, item === page)
      )}
      {btn(<ChevronRight size={14} />, page + 1, false, page === pages)}
    </div>
  )
}

function ComerciosContent() {
  // Todos los comercios cargados de una (120 registros)
  const [allComercios, setAllComercios] = useState<Comercio[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountTime = useRef(Date.now())
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  const { coords, hasAsked, requestPermission, getDistanceKm } = useGeolocation()
  const { trackClick, trackContact, trackSearch, trackTimeOnPage } = useTracking()
  const { user } = useUser()
  const searchParams = useSearchParams()
  const canClaimCommerce = user?.role === 'dueno' || user?.role === 'comercio' || user?.role === 'admin'

  const refreshSaved = useCallback(async () => {
    if (!user?.id) {
      setSavedItems([])
      return
    }
    const items = await loadSavedItems(user.id, 'comercio')
    setSavedItems(items)
  }, [user?.id])

  useEffect(() => {
    void refreshSaved()
  }, [refreshSaved])

  const savedById = useMemo(() => {
    return new Map(savedItems.map((item) => [item.entityId, item]))
  }, [savedItems])

  const handleSave = async (comercio: Comercio) => {
    if (!user?.id) {
      window.location.href = '/login'
      return
    }
    await upsertSavedItem({
      userId: user.id,
      entityType: 'comercio',
      entityId: comercio.id,
      status: 'saved',
      compare: false,
    })
    await refreshSaved()
  }

  const handleRemove = async (saved: SavedItem) => {
    await deleteSavedItem(saved.id)
    await refreshSaved()
  }

  const handleContact = (comercio: Comercio) => {
    trackContact(comercio.id, 'comercio', 'phone', '/app/comercios')
  }

  // Pre-fill search from URL ?q= param (e.g. from navbar search)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const showGeoBanner = !hasAsked && !bannerDismissed

  // Cargar todos de una sola vez
  useEffect(() => {
    db.from('comercios').limit(500).find()
      .then((data: any) => setAllComercios(data as Comercio[]))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Track tiempo en página al salir
  useEffect(() => {
    return () => {
      const seconds = Math.round((Date.now() - mountTime.current) / 1000)
      trackTimeOnPage('/app/comercios', seconds)
    }
  }, [trackTimeOnPage])

  const handleGeoAllow = async () => {
    setGeoLoading(true)
    await requestPermission('comercios_banner')
    setGeoLoading(false)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      // Calcular resultados al momento del debounce para saber si hubo 0 resultados
      const q = value.toLowerCase()
      const count = allComercios.filter(c =>
        (!category || c.category === category) &&
        (!q || c.name?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q))
      ).length
      trackSearch(value, '/app/comercios', count)
    }, 800)
  }

  const handlePage = (page: number) => {
    setCurrentPage(page)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Filtrar + ordenar client-side
  const filtered = useMemo(() => {
    let list = allComercios

    if (category) {
      list = list.filter((c) => c.category === category)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      )
    }

    // Ordenar: si hay ubicación del usuario, por distancia; si no, destacados primero
    if (coords) {
      list = [...list].sort((a, b) => {
        const dA = a.lat != null && a.lng != null ? getDistanceKm(a.lat, a.lng) ?? Infinity : Infinity
        const dB = b.lat != null && b.lng != null ? getDistanceKm(b.lat, b.lng) ?? Infinity : Infinity
        return dA - dB
      })
    } else {
      list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    }

    return list
  }, [allComercios, category, search, coords, getDistanceKm])

  // Paginación client-side
  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT)

  const pagination: Pagination = {
    page: safePage,
    pages: totalPages,
    total: filtered.length,
    limit: LIMIT,
  }

  const featuredCount = useMemo(
    () => allComercios.filter((c) => c.isFeatured).length,
    [allComercios]
  )

  const ratedCount = useMemo(
    () => allComercios.filter((c) => c.rating > 0).length,
    [allComercios]
  )

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      {showGeoBanner && (
        <GeoPermissionBanner
          onAllow={handleGeoAllow}
          onDismiss={() => setBannerDismissed(true)}
          loading={geoLoading}
        />
      )}

      <section className="space-y-4">
        <div
          className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
          style={{ background: '#0F172A' }}
        >
          <HeroParticles />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#CBD5E1' }}>
              Moverse por Pergamino
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E2E8F0' }}>
              Comercios para resolver el día a día
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#94A3B8' }}>
              Restaurantes, cafés, kioscos y servicios útiles cerca de la zona universitaria y del centro.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['🍽️ Restaurantes', '☕ Cafés', '🥐 Panaderías', '🍕 Pizzerías', '🛒 Super', '🗞️ Kioscos'].map((label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ background: 'rgba(226,232,240,0.12)', color: '#E2E8F0', border: '1px solid rgba(226,232,240,0.18)' }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="app-card p-4 sm:p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl p-3" style={{ background: '#E2E8F0' }}>
            <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{allComercios.length}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>lugares relevados</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: '#E2E8F0' }}>
            <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{featuredCount}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>destacados</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: '#E2E8F0' }}>
            <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{ratedCount}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>con calificación</p>
          </div>
          <div className="rounded-2xl p-3 flex flex-col gap-1">
            <a href="/app/inicio" className="flex items-center justify-between text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Hub principal <ChevronRight size={14} style={{ color: 'var(--text-muted-soft)' }} />
            </a>
            <a href="/app/transportes" className="flex items-center justify-between text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Transportes <ChevronRight size={14} style={{ color: 'var(--text-muted-soft)' }} />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="app-section-kicker mb-1">Explorar</p>
            <h2 className="app-section-title text-xl">Encontrá por nombre o categoría</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading
            ? 'Cargando comercios...'
            : coords
              ? `${pagination.total} lugares · ordenados por cercanía 📍`
              : `${pagination.total} lugares disponibles`
          }
          </p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_260px] gap-4">
          <div className="app-card px-4 py-3 flex items-center gap-3">
            <Search size={15} style={{ color: 'var(--text-muted-soft)', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Buscar por nombre, dirección o referencia"
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: 'var(--text-primary)' }}
            />
            {search && (
              <button onClick={() => handleSearch('')} style={{ color: 'var(--text-muted-soft)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="app-card px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
                <ShoppingBag size={16} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Sección activa</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {category ? CATEGORIES.find((item) => item.value === category)?.label : 'Todas las categorías'}
                </p>
              </div>
            </div>
            {category && (
              <button
                onClick={() => setCategory('')}
                className="text-xs font-bold px-3 py-2 rounded-xl"
                style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((item) => {
            const active = category === item.value
            return (
              <button
                key={item.value || 'all'}
                onClick={() => setCategory(item.value)}
                className="shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: active ? '#0F172A' : '#fff',
                  color: active ? '#E2E8F0' : 'rgba(15,23,42,0.45)',
                  outline: `1px solid ${active ? '#0F172A' : 'rgba(15,23,42,0.09)'}`,
                  border: 'none',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </section>

      {error && (
        <div className="app-card px-5 py-4 text-sm font-medium text-center" style={{ color: '#b42318', background: '#fff1f1' }}>
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="app-section-kicker mb-0.5">Listado</p>
            <h2 className="app-section-title text-xl">Comercios disponibles</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: LIMIT }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="app-card px-5 py-12 text-center">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted-soft)' }}>
              No se encontraron comercios{search ? ` para "${search}"` : ''}.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map((comercio) => (
                <div key={comercio.id} onClick={() => trackClick(comercio.id, 'comercio', '/app/comercios')}>
                  <ComercioCard
                    comercio={comercio}
                    getDistanceKm={coords ? getDistanceKm : undefined}
                    canClaim={canClaimCommerce}
                    saved={savedById.get(comercio.id)}
                    onSave={handleSave}
                    onRemove={handleRemove}
                    onContact={handleContact}
                  />
                </div>
              ))}
            </div>
            <Paginator pagination={pagination} onChange={handlePage} />
          </>
        )}
      </section>
    </div>
  )
}

export default function ComerciosPage() {
  return (
    <Suspense>
      <ComerciosContent />
    </Suspense>
  )
}
