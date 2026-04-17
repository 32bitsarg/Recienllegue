'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import AppSectionNav from '@/components/AppSectionNav'
import HeroParticles from '@/components/HeroParticles'

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
          stroke={i <= full ? 'var(--accent)' : 'rgba(22,56,50,0.25)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="app-card overflow-hidden animate-pulse">
      <div className="h-20 w-full" style={{ background: '#eef6f0' }} />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
        <div className="h-4 w-3/4 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
        <div className="h-3 w-1/2 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
        <div className="h-10 w-full rounded-2xl" style={{ background: '#eef6f0' }} />
      </div>
    </div>
  )
}

function ComercioCard({ comercio }: { comercio: Comercio }) {
  const emoji = CATEGORY_EMOJI[comercio.category] ?? '📍'

  return (
    <article className="app-card overflow-hidden flex flex-col h-full">
      <div
        className="relative flex items-center justify-center h-20 shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(22,56,50,0.08), rgba(22,56,50,0.02))' }}
      >
        <span className="text-4xl select-none">{emoji}</span>

        {comercio.isFeatured && (
          <span
            className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: 'var(--accent-contrast)', color: 'var(--accent)' }}
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

          {comercio.walkTime && (
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={11} />
              <span className="text-[10px] font-medium">{comercio.walkTime}</span>
            </div>
          )}

          {comercio.address && (
            <p className="text-[10px] leading-snug line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {comercio.address}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          {comercio.phone ? (
            <a
              href={`tel:${comercio.phone.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
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
        color: active ? 'var(--accent-contrast)' : disabled ? 'rgba(22,56,50,0.2)' : 'var(--accent)',
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

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, total: 0, pages: 1, limit: LIMIT })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (params: { page: number; search: string; category: string }) => {
    setLoading(true)
    setError(null)

    try {
      let query = db.from('comercios').latest().page(params.page).limit(LIMIT)

      if (params.search) query = query.search(params.search)
      if (params.category) query = query.eq('category', params.category)

      const res = await query.get()
      setComercios(res.data as Comercio[])
      setPagination({
        page: res.page || 1,
        pages: res.pages || 1,
        total: res.total,
        limit: LIMIT,
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load({ page: 1, search, category })
  }, [category, load])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => load({ page: 1, search: value, category }), 350)
  }

  const handlePage = (page: number) => {
    load({ page, search, category })
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const featuredCount = useMemo(
    () => comercios.filter((comercio) => comercio.isFeatured).length,
    [comercios]
  )

  const ratedCount = useMemo(
    () => comercios.filter((comercio) => comercio.rating > 0).length,
    [comercios]
  )

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      <AppSectionNav />

      <section className="space-y-4">
        <div
          className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
          style={{ background: '#163832' }}
        >
          <HeroParticles />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#a8ddb5' }}>
              Moverse por Pergamino
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#daf1de' }}>
              Comercios para resolver el día a día
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b8e4bf' }}>
              Restaurantes, cafés, kioscos y servicios útiles cerca de la zona universitaria y del centro.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['🍽️ Restaurantes', '☕ Cafés', '🥐 Panaderías', '🍕 Pizzerías', '🛒 Super', '🗞️ Kioscos'].map((label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ background: 'rgba(218,241,222,0.12)', color: '#daf1de', border: '1px solid rgba(218,241,222,0.18)' }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="app-card p-4 sm:p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
            <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{pagination.total}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>lugares relevados</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
            <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{featuredCount}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>destacados</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
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
            {loading ? 'Actualizando listado...' : `${pagination.total} lugares disponibles en esta búsqueda`}
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
                  background: active ? 'var(--accent)' : 'var(--surface)',
                  color: active ? 'var(--accent-contrast)' : 'var(--accent)',
                  border: `1px solid ${active ? 'transparent' : 'var(--border-subtle)'}`,
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
        ) : comercios.length === 0 ? (
          <div className="app-card px-5 py-12 text-center">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted-soft)' }}>
              No se encontraron comercios{search ? ` para "${search}"` : ''}.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {comercios.map((comercio) => (
                <ComercioCard key={comercio.id} comercio={comercio} />
              ))}
            </div>
            <Paginator pagination={pagination} onChange={handlePage} />
          </>
        )}
      </section>
    </div>
  )
}
