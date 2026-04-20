'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Flag, BedDouble, Link as LinkIcon } from 'lucide-react'
import { deleteReport, hidePost, banUser } from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface StatCard {
  label: string
  value: number | null
  Icon: React.ElementType
  color: string
}

interface Report {
  id: string
  postId: string
  userId: string
  reason: string
  created_at: string
}

// ─── Relative time ────────────────────────────────────────────

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'ahora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

// ─── Stat card ────────────────────────────────────────────────

function StatCardBlock({ stat }: { stat: StatCard }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: stat.color + '15' }}
      >
        <stat.Icon size={18} style={{ color: stat.color }} />
      </div>
      <div>
        <p className="text-3xl font-black" style={{ color: '#0F172A' }}>
          {stat.value === null ? (
            <span className="inline-block w-12 h-7 rounded-lg animate-pulse"
              style={{ background: 'rgba(15,23,42,0.08)' }} />
          ) : (
            stat.value.toLocaleString('es-AR')
          )}
        </p>
        <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(15,23,42,0.5)' }}>
          {stat.label}
        </p>
      </div>
    </div>
  )
}

// ─── Report row ───────────────────────────────────────────────

function ReportRow({ report, onRemove }: { report: Report; onRemove: (id: string) => void }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handle = async (action: () => Promise<void>, key: string) => {
    setLoading(key)
    try {
      await action()
      onRemove(report.id)
    } catch {
      // silently ignore
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>
          {report.reason}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[11px] font-mono" style={{ color: 'rgba(15,23,42,0.4)' }}>
            Post: {report.postId?.slice(0, 12)}...
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.35)' }}>
            {relTime(report.created_at)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href="/app/muro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
        >
          <LinkIcon size={11} />
          Ver post
        </a>

        <button
          disabled={!!loading}
          onClick={() => handle(() => deleteReport(report.id), 'ignore')}
          className="px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
        >
          {loading === 'ignore' ? 'Ignorando...' : 'Ignorar'}
        </button>

        <button
          disabled={!!loading}
          onClick={() => handle(() => hidePost(report.postId, report.id), 'hide')}
          className="px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{ background: '#fef3c7', color: '#92400e' }}
        >
          {loading === 'hide' ? 'Ocultando...' : 'Ocultar post'}
        </button>

        <button
          disabled={!!loading}
          onClick={() => handle(() => banUser(report.userId, report.id), 'ban')}
          className="px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{ background: '#fee2e2', color: '#991b1b' }}
        >
          {loading === 'ban' ? 'Baneando...' : 'Banear usuario'}
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Usuarios registrados', value: null, Icon: Users,       color: '#3b82f6' },
    { label: 'Posts en el muro',     value: null, Icon: MessageSquare, color: '#8b5cf6' },
    { label: 'Reportes pendientes',  value: null, Icon: Flag,        color: '#ef4444' },
    { label: 'Hospedajes cargados',  value: null, Icon: BedDouble,   color: '#0EA5E9' },
  ])
  const [reports, setReports] = useState<Report[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      db.from('profiles').count(),
      db.from('muro').count(),
      db.from('muro_reports').count(),
      db.from('hospedajes').count(),
    ]).then(([users, posts, rpts, hosp]) => {
      setStats([
        { label: 'Usuarios registrados', value: users, Icon: Users,        color: '#3b82f6' },
        { label: 'Posts en el muro',     value: posts, Icon: MessageSquare, color: '#8b5cf6' },
        { label: 'Reportes pendientes',  value: rpts,  Icon: Flag,         color: '#ef4444' },
        { label: 'Hospedajes cargados',  value: hosp,  Icon: BedDouble,    color: '#0EA5E9' },
      ])
    })

    db.from('muro_reports').latest().limit(10).find()
      .then((data: any) => {
        setReports(data as any)
        setReportsLoading(false)
      })
  }, [])

  return (
    <div className="px-4 lg:px-8 py-8 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>
          Vision general de la plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => <StatCardBlock key={s.label} stat={s} />)}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: 'Hospedajes', href: '/app/adm/hospedajes' },
          { label: 'Comercios',  href: '/app/adm/comercios' },
          { label: 'Transportes', href: '/app/adm/transportes' },
          { label: 'Mensajes del carrusel', href: '/app/adm/hero_messages' },
        ].map(l => (
          <a
            key={l.href}
            href={l.href}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
            style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)', border: '1px solid rgba(15,23,42,0.08)' }}
          >
            {l.label} →
          </a>
        ))}
      </div>

      {/* Reports */}
      <div>
        <h2 className="text-base font-extrabold mb-4" style={{ color: '#0F172A' }}>
          Reportes recientes
        </h2>

        {reportsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-20 animate-pulse"
                style={{ background: 'rgba(15,23,42,0.05)' }} />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.4)' }}>
              No hay reportes pendientes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(r => (
              <ReportRow
                key={r.id}
                report={r}
                onRemove={id => setReports(prev => prev.filter(x => x.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
