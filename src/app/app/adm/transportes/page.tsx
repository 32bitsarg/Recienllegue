'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import {
  createRemis,
  updateRemis,
  deleteRemis,
  setRemisDestacado,
} from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface RemisRecord {
  id:         string
  nombre:     string
  telefono:   string
  referencia: string
  destacado:  boolean
}

const EMPTY_FORM = {
  nombre: '',
  telefono: '',
  referencia: '',
  destacado: false,
}

// ─── Input helpers ────────────────────────────────────────────

const inputStyle = {
  background: 'rgba(15,23,42,0.04)',
  border: '1px solid rgba(15,23,42,0.1)',
  color: '#0F172A',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: 'rgba(15,23,42,0.5)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────

function RemisForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial: typeof EMPTY_FORM
  onSubmit: (data: typeof EMPTY_FORM) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Nombre">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            placeholder="Ej: Remis Central"
          />
        </Field>
        <Field label="Telefono">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.telefono}
            onChange={e => set('telefono', e.target.value)}
            placeholder="(02477) 43-0000"
          />
        </Field>
        <Field label="Referencia (opcional)">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.referencia}
            onChange={e => set('referencia', e.target.value)}
            placeholder="Ej: Cerca de la UNNOBA"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer mb-5">
        <input
          type="checkbox"
          checked={form.destacado}
          onChange={e => set('destacado', e.target.checked)}
          className="w-4 h-4 accent-[#0F172A]"
        />
        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>
          Destacado (recomendado para estudiantes)
        </span>
      </label>

      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(form)}
          disabled={submitting || !form.nombre.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: '#0F172A', color: '#F59E0B' }}
        >
          <Check size={14} />
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
        >
          <X size={14} />
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function AdminTransportesPage() {
  const [records, setRecords] = useState<RemisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId]   = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    db.from('remises').oldest().limit(50).find()
      .then((records: any) => setRecords(records as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allIds = records.map(r => r.id)

  const handleCreate = async (form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    const res = await createRemis(form)
    if (res.data) {
      let updated = [...records, res.data]
      // If destacado, update all others locally
      if (form.destacado) {
        await setRemisDestacado(res.data.id, allIds)
        updated = updated.map(r =>
          r.id === res.data.id
            ? { ...r, destacado: true }
            : { ...r, destacado: false }
        )
      }
      setRecords(updated)
      setShowAdd(false)
    }
    setSubmitting(false)
  }

  const handleUpdate = async (id: string, form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    if (form.destacado) {
      await setRemisDestacado(id, allIds)
      setRecords(prev =>
        prev.map(r => ({
          ...r,
          destacado: r.id === id,
        }))
      )
      setEditId(null)
    } else {
      const res = await updateRemis(id, form)
      if (res.data) {
        setRecords(prev => prev.map(r => r.id === id ? res.data : r))
        setEditId(null)
      }
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este remis?')) return
    await deleteRemis(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  const handleSetDestacado = async (id: string) => {
    await setRemisDestacado(id, allIds)
    setRecords(prev =>
      prev.map(r => ({
        ...r,
        destacado: r.id === id,
      }))
    )
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
            Remises
          </h1>
          <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>
            {records.length} registros
          </p>
        </div>
        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setEditId(null) }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            <Plus size={14} />
            Agregar
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <RemisForm
          initial={EMPTY_FORM}
          onSubmit={handleCreate}
          onCancel={() => setShowAdd(false)}
          submitting={submitting}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl h-20 animate-pulse"
              style={{ background: 'rgba(15,23,42,0.05)' }} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.4)' }}>
            No hay remises cargados todavia.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id}>
              {editId === r.id ? (
                <RemisForm
                  initial={{
                    nombre: r.nombre ?? '',
                    telefono: r.telefono ?? '',
                    referencia: r.referencia ?? '',
                    destacado: r.destacado ?? false,
                  }}
                  onSubmit={form => handleUpdate(r.id, form)}
                  onCancel={() => setEditId(null)}
                  submitting={submitting}
                />
              ) : (
                <div
                  className="rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={{
                    background: r.destacado ? '#0F172A' : '#fff',
                    border: r.destacado ? 'none' : '1px solid rgba(15,23,42,0.08)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-extrabold text-sm"
                        style={{ color: r.destacado ? '#E2E8F0' : '#0F172A' }}>
                        {r.nombre}
                      </p>
                      {r.destacado && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#E2E8F0', color: '#0F172A' }}
                        >
                          Destacado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px]"
                      style={{ color: r.destacado ? 'rgba(226,232,240,0.6)' : 'rgba(15,23,42,0.45)' }}>
                      {r.telefono}
                      {r.referencia ? ` · ${r.referencia}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!r.destacado && (
                      <button
                        onClick={() => handleSetDestacado(r.id)}
                        title="Marcar como destacado"
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                        style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
                      >
                        <Star size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => { setEditId(r.id); setShowAdd(false) }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{
                        background: r.destacado ? 'rgba(226,232,240,0.15)' : 'rgba(15,23,42,0.06)',
                        color: r.destacado ? '#E2E8F0' : '#0F172A',
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{
                        background: r.destacado ? 'rgba(255,100,100,0.15)' : 'rgba(220,38,38,0.08)',
                        color: r.destacado ? '#fca5a5' : '#dc2626',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
