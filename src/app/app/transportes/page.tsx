'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Bus, MapPin, Navigation, Phone, Route } from 'lucide-react'
import { publicDb as db } from '@/lib/db'
import AppSectionNav from '@/components/AppSectionNav'
import HeroParticles from '@/components/HeroParticles'

const MapaColectivos = dynamic(() => import('./MapaColectivos'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#eef6f0' }}>
      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
        Cargando mapa...
      </p>
    </div>
  ),
})

interface Tramo { longitud_km: number; puntos: [number, number][] }
interface Ramal {
  id: string
  nombre: string
  ramal: string
  empresa: string
  color: string
  actualizacion: string
  ida: Tramo[]
  vuelta: Tramo[]
}

interface Remis {
  id: string
  nombre: string
  telefono: string
  referencia: string
  destacado: boolean
}

function totalKm(tramos: Tramo[]) {
  return tramos.reduce((sum, tramo) => sum + tramo.longitud_km, 0).toFixed(1)
}

function RamalCard({ ramal, activo, onClick }: { ramal: Ramal; activo: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl px-4 py-3.5 flex items-center gap-4 transition-all"
      style={{
        background: activo ? `${ramal.color}14` : 'var(--surface)',
        border: `1px solid ${activo ? `${ramal.color}50` : 'var(--border-subtle)'}`,
      }}
    >
      <div className="shrink-0 w-3 h-3 rounded-full" style={{ background: ramal.color }} />

      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
          {ramal.ramal}
        </p>
        <p className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
          {ramal.empresa}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {totalKm(ramal.ida)} km
        </p>
        <p className="text-[9px]" style={{ color: 'var(--text-muted-soft)' }}>
          ida
        </p>
      </div>
    </button>
  )
}

function RamalPills({ ramales, activoId, onSelect }: { ramales: Ramal[]; activoId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {ramales.map((ramal) => {
        const activo = ramal.id === activoId
        return (
          <button
            key={ramal.id}
            onClick={() => onSelect(ramal.id)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all"
            style={{
              background: activo ? ramal.color : `${ramal.color}15`,
              color: activo ? '#fff' : ramal.color,
              border: `1.5px solid ${activo ? ramal.color : `${ramal.color}40`}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: activo ? 'rgba(255,255,255,0.7)' : ramal.color }} />
            {ramal.ramal}
          </button>
        )
      })}
    </div>
  )
}

function Leyenda({ ramal }: { ramal: Ramal | null }) {
  if (!ramal) {
    return (
      <div className="flex items-center gap-4 px-1">
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
          Seleccioná un ramal para ver su recorrido
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-4 px-1">
      <div className="flex items-center gap-2">
        <svg width="20" height="4" viewBox="0 0 20 4">
          <line x1="0" y1="2" x2="20" y2="2" stroke={ramal.color} strokeWidth="3" />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          IDA · {totalKm(ramal.ida)} km
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="20" height="4" viewBox="0 0 20 4">
          <line x1="0" y1="2" x2="20" y2="2" stroke={ramal.color} strokeWidth="2.5" strokeDasharray="5 4" />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          VUELTA · {totalKm(ramal.vuelta)} km
        </span>
      </div>
    </div>
  )
}

export default function TransportesPage() {
  const [ramales, setRamales] = useState<Ramal[]>([])
  const [remises, setRemises] = useState<Remis[]>([])
  const [loading, setLoading] = useState(true)
  const [remisLoading, setRemisLoading] = useState(true)
  const [activoId, setActivoId] = useState<string | null>(null)
  const [tab, setTab] = useState<'colectivos' | 'remises'>('colectivos')

  useEffect(() => {
    db.from('remises').oldest().limit(50).find()
      .then((data) => setRemises(data as Remis[]))
      .catch(() => {})
      .finally(() => setRemisLoading(false))
  }, [])

  useEffect(() => {
    db.from('colectivos').oldest().limit(20).find()
      .then((data) => {
        setRamales(data as Ramal[])
        if (data?.length) setActivoId(data[0].id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const ramalActivo = ramales.find((ramal) => ramal.id === activoId) ?? null
  const destacados = useMemo(() => remises.filter((item) => item.destacado).length, [remises])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6">
      <AppSectionNav />

      <section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
        <div
          className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
          style={{ background: '#163832' }}
        >
          <HeroParticles />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#a8ddb5' }}>
              Moverse rápido
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#daf1de' }}>
              Transportes para ir y volver sin perderte
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b8e4bf' }}>
              Colectivos y remises en una sola pantalla, con rutas visibles y contactos directos para resolver movilidad diaria.
            </p>
          </div>
        </div>

        <aside className="app-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <p className="app-section-kicker mb-1">Resumen</p>
            <h2 className="app-section-title text-lg">Panorama de movilidad</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{ramales.length}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>ramales cargados</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{destacados}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>remises destacados</p>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#eef6f0' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
              Cobertura
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Pergamino · La Nueva Perla SA
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Los recorridos pueden variar. Última verificación visible: 26/03/2026.
            </p>
          </div>
        </aside>
      </section>

      <section className="app-card overflow-hidden">
        <div className="px-4 lg:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <p className="app-section-kicker mb-1">Opciones</p>
            <h2 className="app-section-title text-xl">Elegí cómo moverte</h2>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl self-start md:self-auto" style={{ background: '#eef6f0' }}>
            {(['colectivos', 'remises'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: tab === item ? 'var(--surface)' : 'transparent',
                  color: tab === item ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow: tab === item ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {item === 'colectivos' ? 'Colectivos' : 'Remises'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'colectivos' && (
          <div className="flex flex-col gap-4 p-4 lg:p-6">
            <div className="lg:hidden space-y-3">
              {loading ? (
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="shrink-0 rounded-full h-8 w-16 animate-pulse" style={{ background: '#eef6f0' }} />
                  ))}
                </div>
              ) : (
                <RamalPills ramales={ramales} activoId={activoId} onSelect={setActivoId} />
              )}
              <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
                <Leyenda ramal={ramalActivo} />
              </div>
            </div>

            <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4 min-h-[560px]">
              <div className="hidden lg:flex flex-col gap-3">
                <div className="rounded-[24px] p-4" style={{ background: '#eef6f0' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface)', color: 'var(--accent)' }}>
                      <Bus size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Ramales disponibles</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Seleccioná uno para ver el recorrido.</p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {loading
                      ? Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-2xl h-14 animate-pulse" style={{ background: 'var(--surface)' }} />
                      ))
                      : ramales.map((ramal) => (
                        <RamalCard key={ramal.id} ramal={ramal} activo={activoId === ramal.id} onClick={() => setActivoId(ramal.id)} />
                      ))}
                  </div>
                </div>

                <div className="rounded-[24px] p-4" style={{ background: '#eef6f0' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface)', color: 'var(--accent)' }}>
                      <Route size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Lectura rápida</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Línea continua para ida y punteada para vuelta.</p>
                    </div>
                  </div>
                  <Leyenda ramal={ramalActivo} />
                </div>
              </div>

              <div className="rounded-[24px] overflow-hidden border" style={{ borderColor: 'var(--border-subtle)', minHeight: '420px' }}>
                <div className="relative h-full min-h-[420px]">
                  {!loading && ramales.length > 0 && <MapaColectivos ramales={ramales} activoId={activoId} />}

                  {ramalActivo && (
                    <div
                      className="absolute top-3 right-3 z-[1000] rounded-2xl px-4 py-3 pointer-events-none"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(22,56,50,0.08)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ramalActivo.color }} />
                        <p className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>
                          {ramalActivo.ramal}
                        </p>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {ramalActivo.empresa}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'remises' && (
          <div className="p-4 lg:p-6">
            <div className="max-w-3xl space-y-4">
              <div>
                <p className="app-section-kicker mb-1">Disponibles</p>
                <h2 className="app-section-title text-xl">Remises y contactos rápidos</h2>
              </div>

              {remisLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="app-card h-20 animate-pulse" style={{ background: '#eef6f0' }} />
                ))
              ) : remises.length === 0 ? (
                <div className="app-card px-5 py-12 text-center">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted-soft)' }}>
                    No hay remises disponibles por el momento.
                  </p>
                </div>
              ) : (
                remises.map((remis) => (
                  <div
                    key={remis.id}
                    className="rounded-[24px] px-5 py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap"
                    style={{
                      background: remis.destacado ? 'var(--accent)' : 'var(--surface)',
                      border: remis.destacado ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: remis.destacado ? 'rgba(218,241,222,0.15)' : 'var(--surface-soft)' }}
                    >
                      <Navigation size={17} style={{ color: remis.destacado ? 'var(--accent-contrast)' : 'var(--accent)' }} />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-extrabold text-sm" style={{ color: remis.destacado ? 'var(--accent-contrast)' : 'var(--text-primary)' }}>
                          {remis.nombre}
                        </p>
                        {remis.destacado && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-contrast)', color: 'var(--accent)' }}>
                            Cerca UNNOBA
                          </span>
                        )}
                      </div>

                      {remis.referencia && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={10} style={{ color: remis.destacado ? 'rgba(218,241,222,0.6)' : 'var(--text-muted-soft)' }} />
                          <p className="text-[10px]" style={{ color: remis.destacado ? 'rgba(218,241,222,0.75)' : 'var(--text-muted)' }}>
                            {remis.referencia}
                          </p>
                        </div>
                      )}
                    </div>

                    <a
                      href={`tel:${remis.telefono.replace(/\D/g, '')}`}
                      className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
                      style={{
                        background: remis.destacado ? 'var(--accent-contrast)' : 'var(--accent)',
                        color: remis.destacado ? 'var(--accent)' : 'var(--accent-contrast)',
                      }}
                    >
                      <Phone size={12} />
                      {remis.telefono}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
