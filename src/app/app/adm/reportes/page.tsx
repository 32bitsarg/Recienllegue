'use client'

import { useState, useEffect } from 'react'
import { Flag, Link as LinkIcon } from 'lucide-react'
import { deleteReport, hidePost, banUser } from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

interface Report {
  id:         string
  postId:     string
  userId:     string
  reason:     string
  created_at: string
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'ahora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function ReportRow({ report, onRemove }: { report: Report; onRemove: (id: string) => void }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handle = async (action: () => Promise<void>, key: string) => {
    setLoading(key)
    try {
      await action()
      onRemove(report.id)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>
          {report.reason}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[11px] font-mono" style={{ color: 'rgba(15,23,42,0.4)' }}>
            Post: {report.postId.slice(0, 12)}...
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.35)' }}>
            {relTime(report.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <a
          href="/app/muro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
        >
          <LinkIcon size={11} /> Ver post
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

export default function ReportesPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  useEffect(() => {
    setLoading(true)
    db.from('muro_reports').latest().page(page).limit(LIMIT).get()
      .then((res: any) => {
        setReports(res.data as any)
        setTotal(res.total)
      })
      .finally(() => setLoading(false))
  }, [page])

  const pages = Math.ceil(total / LIMIT)

  return (
    <div className="px-4 lg:px-8 py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
            Reportes
          </h1>
          <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>
            {total} reporte{total !== 1 ? 's' : ''} pendiente{total !== 1 ? 's' : ''}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.08)' }}
        >
          <Flag size={18} style={{ color: '#ef4444' }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl h-20 animate-pulse"
              style={{ background: 'rgba(15,23,42,0.05)' }} />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div
          className="rounded-2xl p-14 text-center"
          style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.4)' }}>
            No hay reportes pendientes.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map(r => (
              <ReportRow
                key={r.id}
                report={r}
                onRemove={id => {
                  setReports(prev => prev.filter(x => x.id !== id))
                  setTotal(prev => prev - 1)
                }}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30 transition-opacity hover:opacity-70"
                style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)', color: '#0F172A' }}
              >
                Anterior
              </button>
              <span className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.5)' }}>
                {page} / {pages}
              </span>
              <button
                disabled={page === pages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30 transition-opacity hover:opacity-70"
                style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)', color: '#0F172A' }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
