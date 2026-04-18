'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { publicDb as db } from '@/lib/db'
import {
  BarChart2,
  Search,
  MousePointerClick,
  MapPin,
  TrendingUp,
  AlertCircle,
  Users,
  ArrowRight,
  Wifi,
  WifiOff,
  RefreshCw,
  Eye,
  Zap,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

interface LiveEvent {
  id: string
  eventType: string
  page?: string
  entityType?: string
  metadata?: Record<string, unknown>
  timestamp?: string
  createdAt?: string
}

interface ClickStat  { entityId: string; count: number }
interface SearchStat { query: string; count: number; noResults: boolean }
interface PageStat   { page: string; count: number }
interface FunnelStep { label: string; count: number; color: string }

// ─── Utils ────────────────────────────────────────────────────

function timeAgo(ts?: string): string {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60_000) return `hace ${Math.floor(diff / 1000)}s`
  if (diff < 3_600_000) return `hace ${Math.floor(diff / 60_000)}m`
  return `hace ${Math.floor(diff / 3_600_000)}h`
}

function eventColor(type: string): string {
  const map: Record<string, string> = {
    click_item:   '#22c55e',
    search:       '#3b82f6',
    time_on_page: '#a855f7',
    funnel:       '#f59e0b',
    page_view:    '#06b6d4',
  }
  return map[type] ?? '#6b7280'
}

function eventLabel(e: LiveEvent): string {
  if (e.eventType === 'click_item') return `Click en ${e.entityType ?? 'item'}`
  if (e.eventType === 'search') return `Buscó "${e.metadata?.query ?? ''}"`
  if (e.eventType === 'time_on_page') return `${e.metadata?.seconds ?? 0}s en ${e.page}`
  if (e.eventType === 'funnel') return `Funnel: ${e.metadata?.step ?? e.page}`
  if (e.eventType === 'page_view') return `Visitó ${e.page}`
  return e.eventType
}

// ─── KPI Card ─────────────────────────────────────────────────

function KpiCard({
  icon, label, value, sub, color = '#163832'
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: '#fff', border: '1px solid rgba(22,56,50,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black leading-none" style={{ color: '#051f20' }}>{value}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(22,56,50,0.55)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(22,56,50,0.35)' }}>{sub}</p>}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────

function Section({
  title, kicker, icon, badge, children
}: {
  title: string
  kicker: string
  icon: React.ReactNode
  badge?: string | number
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}
          >
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(22,56,50,0.35)' }}>{kicker}</p>
            <h2 className="text-sm font-extrabold" style={{ color: '#051f20' }}>{title}</h2>
          </div>
        </div>
        {badge !== undefined && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────

function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: '#fff', border: '1px solid rgba(22,56,50,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', ...style }}
    >
      {children}
    </div>
  )
}

// ─── Row list item ────────────────────────────────────────────

function Row({
  rank, label, count, suffix = '', highlight = false, maxCount = 1
}: {
  rank?: number
  label: string
  count: number
  suffix?: string
  highlight?: boolean
  maxCount?: number
}) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
  return (
    <div className="px-4 py-3 space-y-1.5">
      <div className="flex items-center gap-3">
        {rank !== undefined && (
          <span
            className="text-[11px] font-black w-5 text-center shrink-0"
            style={{ color: rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#cd7f32' : 'rgba(22,56,50,0.25)' }}
          >
            {rank}
          </span>
        )}
        <span
          className="flex-1 text-xs truncate font-medium"
          style={{ color: highlight ? '#c53030' : '#051f20', fontWeight: highlight ? 700 : 500 }}
        >
          {highlight && <AlertCircle size={10} className="inline mr-1" style={{ color: '#e53e3e' }} />}
          {label}
        </span>
        <span
          className="text-[11px] font-bold shrink-0 px-2.5 py-0.5 rounded-full"
          style={{ background: highlight ? '#fff5f5' : 'rgba(22,56,50,0.05)', color: highlight ? '#c53030' : '#163832' }}
        >
          {count.toLocaleString('es-AR')}{suffix}
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden ml-8" style={{ background: 'rgba(22,56,50,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: highlight ? '#e53e3e' : '#163832' }}
        />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [clicks, setClicks]     = useState<ClickStat[]>([])
  const [searches, setSearches] = useState<SearchStat[]>([])
  const [pages, setPages]       = useState<PageStat[]>([])
  const [funnel, setFunnel]     = useState<FunnelStep[]>([])
  const [barrios, setBarrios]   = useState<{ zona: string; count: number }[]>([])
  const [loading, setLoading]   = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Live feed
  const [liveEvents, setLiveEvents]   = useState<LiveEvent[]>([])
  const [connected, setConnected]     = useState(false)
  const [liveCount, setLiveCount]     = useState(0)
  const unsubEventsRef = useRef<(() => void) | null>(null)
  const unsubPvRef     = useRef<(() => void) | null>(null)

  // ── Load snapshot ─────────────────────────────────────────

  const loadSnapshot = useCallback(async () => {
    try {
      const eventsRaw    = await db.from('user_events').limit(2000).find() as any[]
      const pvRaw        = await db.from('page_views').limit(2000).find() as any[]
      const locationsRaw = await db.from('user_locations').limit(500).find() as any[]

      const clickEvents  = eventsRaw.filter((e: any) => e.eventType === 'click_item')
      const searchEvents = eventsRaw.filter((e: any) => e.eventType === 'search')
      const funnelEvents = eventsRaw.filter((e: any) => e.eventType === 'funnel')

      // Clicks por entidad
      const clickMap: Record<string, number> = {}
      for (const e of clickEvents) {
        if (!e.entityId) continue
        clickMap[e.entityId] = (clickMap[e.entityId] ?? 0) + 1
      }
      setClicks(
        Object.entries(clickMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([entityId, count]) => ({ entityId, count }))
      )

      // Búsquedas
      const searchMap: Record<string, { count: number; noResults: boolean }> = {}
      for (const e of searchEvents) {
        const q = e.metadata?.query?.toLowerCase?.()?.trim()
        if (!q) continue
        if (!searchMap[q]) searchMap[q] = { count: 0, noResults: false }
        searchMap[q].count++
        if (e.metadata?.noResults) searchMap[q].noResults = true
      }
      setSearches(
        Object.entries(searchMap)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 20)
          .map(([query, { count, noResults }]) => ({ query, count, noResults }))
      )

      // Page views
      const pvMap: Record<string, number> = {}
      for (const pv of pvRaw) {
        pvMap[pv.page] = (pvMap[pv.page] ?? 0) + 1
      }
      setPages(
        Object.entries(pvMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([page, count]) => ({ page, count }))
      )

      // Funnel
      const landingCount   = pvRaw.filter((p: any) => p.page === '/').length
      const pergaminoCount = pvRaw.filter((p: any) => p.page?.startsWith('/pergamino')).length
      const registroCount  = pvRaw.filter((p: any) => p.page === '/registro').length
      const completados    = funnelEvents.filter((e: any) => e.metadata?.step === 'registro_completado').length

      setFunnel([
        { label: 'Landing principal', count: landingCount,   color: '#163832' },
        { label: 'Landings SEO',      count: pergaminoCount, color: '#1d4e43' },
        { label: 'Página /registro',  count: registroCount,  color: '#2d7a5f' },
        { label: 'Registro exitoso',  count: completados,    color: '#22c55e' },
      ])

      // Zonas geográficas
      const zonaMap: Record<string, number> = {}
      for (const loc of locationsRaw) {
        if (!loc.latitude || !loc.longitude) continue
        const zona = `${Number(loc.latitude).toFixed(2)},${Number(loc.longitude).toFixed(2)}`
        zonaMap[zona] = (zonaMap[zona] ?? 0) + 1
      }
      setBarrios(
        Object.entries(zonaMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([zona, count]) => ({ zona, count }))
      )

      setLastRefresh(new Date())
    } catch (e) {
      console.error('[analytics] load error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Subscribe realtime ─────────────────────────────────────

  const connectRealtime = useCallback(() => {
    // user_events
    const unsubEvents = db.from('user_events').subscribe((event: unknown) => {
      const e = event as any
      const record: LiveEvent = {
        id:         e?.record?.id ?? e?.id ?? Math.random().toString(),
        eventType:  e?.record?.eventType ?? e?.eventType ?? 'unknown',
        page:       e?.record?.page ?? e?.page,
        entityType: e?.record?.entityType ?? e?.entityType,
        metadata:   e?.record?.metadata ?? e?.metadata,
        timestamp:  e?.record?.timestamp ?? e?.record?.createdAt ?? new Date().toISOString(),
      }
      setLiveEvents(prev => [record, ...prev].slice(0, 30))
      setLiveCount(c => c + 1)
    })
    unsubEventsRef.current = typeof unsubEvents === 'function' ? unsubEvents : null

    // page_views
    const unsubPv = db.from('page_views').subscribe((event: unknown) => {
      const e = event as any
      const record: LiveEvent = {
        id:        e?.record?.id ?? Math.random().toString(),
        eventType: 'page_view',
        page:      e?.record?.page ?? e?.page,
        timestamp: e?.record?.createdAt ?? new Date().toISOString(),
      }
      setLiveEvents(prev => [record, ...prev].slice(0, 30))
      setLiveCount(c => c + 1)
    })
    unsubPvRef.current = typeof unsubPv === 'function' ? unsubPv : null

    setConnected(true)
  }, [])

  const disconnectRealtime = useCallback(() => {
    unsubEventsRef.current?.()
    unsubPvRef.current?.()
    unsubEventsRef.current = null
    unsubPvRef.current = null
    setConnected(false)
  }, [])

  useEffect(() => {
    loadSnapshot()
    connectRealtime()
    return () => { disconnectRealtime() }
  }, [loadSnapshot, connectRealtime, disconnectRealtime])

  // ── Derived stats ──────────────────────────────────────────

  const totalClicks   = clicks.reduce((a, c) => a + c.count, 0)
  const totalSearches = searches.reduce((a, s) => a + s.count, 0)
  const totalVisits   = pages.reduce((a, p) => a + p.count, 0)
  const conversion    = funnel[2]?.count > 0 ? Math.round((funnel[3]?.count / funnel[2]?.count) * 100) : 0
  const noResultSearches = searches.filter(s => s.noResults)
  const maxPageCount  = pages[0]?.count ?? 1
  const maxClickCount = clicks[0]?.count ?? 1
  const maxSearchCount = searches[0]?.count ?? 1

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ background: 'rgba(22,56,50,0.05)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(22,56,50,0.35)' }}>
            Panel admin
          </p>
          <h1 className="text-2xl font-black" style={{ color: '#051f20' }}>Analytics</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(22,56,50,0.4)' }}>
            Actualizado {lastRefresh.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
            style={{
              background: connected ? 'rgba(34,197,94,0.08)' : 'rgba(22,56,50,0.05)',
              color: connected ? '#16a34a' : 'rgba(22,56,50,0.4)',
              border: `1px solid ${connected ? 'rgba(34,197,94,0.2)' : 'rgba(22,56,50,0.08)'}`,
            }}
          >
            {connected
              ? <><span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} /> En vivo</>
              : <><WifiOff size={12} /> Desconectado</>
            }
          </div>
          {/* Refresh */}
          <button
            onClick={loadSnapshot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-70"
            style={{ background: '#163832', color: '#daf1de' }}
          >
            <RefreshCw size={12} />
            Refrescar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={<Eye size={18} />}             label="Pageviews totales"    value={totalVisits.toLocaleString('es-AR')} />
        <KpiCard icon={<MousePointerClick size={18} />} label="Clicks en items"    value={totalClicks.toLocaleString('es-AR')} color="#3b82f6" />
        <KpiCard icon={<Search size={18} />}           label="Búsquedas"           value={totalSearches.toLocaleString('es-AR')} color="#8b5cf6" />
        <KpiCard
          icon={<TrendingUp size={18} />}
          label="Conversión registro"
          value={`${conversion}%`}
          sub={`${funnel[3]?.count ?? 0} de ${funnel[2]?.count ?? 0} visitas`}
          color="#f59e0b"
        />
      </div>

      {/* Live feed + Funnel en la misma fila */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Feed en vivo */}
        <Section title="Actividad en tiempo real" kicker="En vivo" icon={<Zap size={14} />} badge={liveCount > 0 ? `+${liveCount} nuevos` : undefined}>
          <Card>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(22,56,50,0.06)' }}>
              <div className="flex items-center gap-2">
                {connected
                  ? <Wifi size={13} style={{ color: '#22c55e' }} />
                  : <WifiOff size={13} style={{ color: 'rgba(22,56,50,0.3)' }} />
                }
                <span className="text-xs font-semibold" style={{ color: connected ? '#16a34a' : 'rgba(22,56,50,0.4)' }}>
                  {connected ? 'Escuchando user_events + page_views' : 'Sin conexión'}
                </span>
              </div>
              {liveEvents.length > 0 && (
                <button
                  onClick={() => { setLiveEvents([]); setLiveCount(0) }}
                  className="text-[10px] font-semibold hover:opacity-60"
                  style={{ color: 'rgba(22,56,50,0.35)' }}
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
              {liveEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(22,56,50,0.04)' }}
                  >
                    <Zap size={18} style={{ color: 'rgba(22,56,50,0.2)' }} />
                  </div>
                  <p className="text-xs text-center" style={{ color: 'rgba(22,56,50,0.35)' }}>
                    Esperando eventos…<br />Cuando un usuario interactúe, aparece acá.
                  </p>
                </div>
              ) : (
                liveEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderBottom: '1px solid rgba(22,56,50,0.04)' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: eventColor(e.eventType) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: '#051f20' }}>
                        {eventLabel(e)}
                      </p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: 'rgba(22,56,50,0.35)' }}>
                      {timeAgo(e.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Leyenda de colores */}
            <div className="flex flex-wrap gap-3 px-4 py-3" style={{ borderTop: '1px solid rgba(22,56,50,0.06)' }}>
              {[
                { type: 'page_view', label: 'Vista' },
                { type: 'click_item', label: 'Click' },
                { type: 'search', label: 'Búsqueda' },
                { type: 'funnel', label: 'Funnel' },
                { type: 'time_on_page', label: 'Tiempo' },
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: eventColor(type) }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(22,56,50,0.45)' }}>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* Funnel */}
        <Section title="Funnel de conversión" kicker="Embudo" icon={<TrendingUp size={14} />}>
          <Card className="p-5 space-y-5">
            {funnel.map((step, i) => {
              const topCount = funnel[0]?.count ?? 1
              const pct = topCount > 0 ? Math.round((step.count / topCount) * 100) : 0
              return (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {i > 0 && <ArrowRight size={11} style={{ color: 'rgba(22,56,50,0.25)' }} />}
                      <span className="text-xs font-semibold" style={{ color: '#051f20' }}>{step.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black" style={{ color: '#051f20' }}>
                        {step.count.toLocaleString('es-AR')}
                      </span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: i === funnel.length - 1 ? 'rgba(34,197,94,0.1)' : 'rgba(22,56,50,0.05)',
                          color: i === funnel.length - 1 ? '#16a34a' : 'rgba(22,56,50,0.45)',
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(22,56,50,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: step.color }}
                    />
                  </div>
                </div>
              )
            })}
            <p className="text-[11px] pt-1" style={{ color: 'rgba(22,56,50,0.35)' }}>
              Conversión landing → registro: <strong style={{ color: '#163832' }}>{conversion}%</strong>
            </p>
          </Card>
        </Section>
      </div>

      {/* Páginas + Clicks en la misma fila */}
      <div className="grid lg:grid-cols-2 gap-6">

        <Section title="Páginas más visitadas" kicker="Tráfico" icon={<BarChart2 size={14} />} badge={totalVisits}>
          <Card className="divide-y" style={{ borderColor: 'rgba(22,56,50,0.06)' }}>
            {pages.length === 0 ? (
              <p className="px-4 py-5 text-sm" style={{ color: 'rgba(22,56,50,0.35)' }}>Sin datos todavía</p>
            ) : (
              pages.map((p, i) => (
                <Row
                  key={p.page}
                  rank={i + 1}
                  label={p.page}
                  count={p.count}
                  suffix=" vistas"
                  maxCount={maxPageCount}
                />
              ))
            )}
          </Card>
        </Section>

        <Section title="Ítems más clickeados" kicker="Monetización" icon={<MousePointerClick size={14} />} badge={totalClicks}>
          <Card className="divide-y" style={{ borderColor: 'rgba(22,56,50,0.06)' }}>
            {clicks.length === 0 ? (
              <p className="px-4 py-5 text-sm" style={{ color: 'rgba(22,56,50,0.35)' }}>Sin datos todavía</p>
            ) : (
              clicks.map((c, i) => (
                <Row
                  key={c.entityId}
                  rank={i + 1}
                  label={c.entityId.slice(0, 24) + (c.entityId.length > 24 ? '…' : '')}
                  count={c.count}
                  suffix=" clicks"
                  maxCount={maxClickCount}
                />
              ))
            )}
          </Card>
          {clicks.length > 0 && (
            <p className="text-[11px] px-1 pt-1" style={{ color: 'rgba(22,56,50,0.35)' }}>
              Los más clickeados son candidatos a "Destacado" pago.
            </p>
          )}
        </Section>
      </div>

      {/* Búsquedas */}
      <div className="grid lg:grid-cols-2 gap-6">

        <Section title="Búsquedas frecuentes" kicker="Contenido" icon={<Search size={14} />} badge={searches.length}>
          <Card className="divide-y" style={{ borderColor: 'rgba(22,56,50,0.06)' }}>
            {searches.length === 0 ? (
              <p className="px-4 py-5 text-sm" style={{ color: 'rgba(22,56,50,0.35)' }}>Sin datos todavía</p>
            ) : (
              searches.map((s, i) => (
                <Row
                  key={s.query}
                  rank={i + 1}
                  label={s.query}
                  count={s.count}
                  suffix="x"
                  highlight={s.noResults}
                  maxCount={maxSearchCount}
                />
              ))
            )}
          </Card>
        </Section>

        <Section
          title="Búsquedas sin resultado"
          kicker="Qué falta cargar"
          icon={<AlertCircle size={14} />}
          badge={noResultSearches.length > 0 ? `${noResultSearches.length} gaps` : undefined}
        >
          <Card className="divide-y" style={{ borderColor: 'rgba(22,56,50,0.06)' }}>
            {noResultSearches.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.08)' }}
                >
                  <span className="text-lg">🎉</span>
                </div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(22,56,50,0.4)' }}>
                  Ninguna sin resultado por ahora
                </p>
              </div>
            ) : (
              noResultSearches.map((s, i) => (
                <Row
                  key={s.query}
                  rank={i + 1}
                  label={s.query}
                  count={s.count}
                  suffix="x sin resultado"
                  highlight
                  maxCount={noResultSearches[0]?.count ?? 1}
                />
              ))
            )}
          </Card>
          {noResultSearches.length > 0 && (
            <p className="text-[11px] px-1 pt-1" style={{ color: 'rgba(22,56,50,0.35)' }}>
              Estas búsquedas no encontraron nada — cargá esos comercios.
            </p>
          )}
        </Section>
      </div>

      {/* Zonas geográficas */}
      {barrios.length > 0 && (
        <Section title="Zonas con más usuarios" kicker="Geografía" icon={<MapPin size={14} />} badge={barrios.reduce((a, b) => a + b.count, 0)}>
          <Card className="p-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {barrios.map((b, i) => {
                const pct = Math.round((b.count / (barrios[0]?.count ?? 1)) * 100)
                return (
                  <div key={b.zona} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black w-4 text-center"
                          style={{ color: i < 3 ? '#163832' : 'rgba(22,56,50,0.3)' }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'rgba(22,56,50,0.5)' }}>{b.zona}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: '#163832' }}>{b.count} usuarios</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden ml-6" style={{ background: 'rgba(22,56,50,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: '#163832' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] pt-4 mt-1" style={{ color: 'rgba(22,56,50,0.3)', borderTop: '1px solid rgba(22,56,50,0.06)' }}>
              Coordenadas redondeadas a ~1km. Las zonas con más usuarios son candidatas para alianzas con propietarios.
            </p>
          </Card>
        </Section>
      )}

    </div>
  )
}
