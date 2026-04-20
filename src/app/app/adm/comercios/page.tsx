'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import {
  createComercio,
  updateComercio,
  deleteComercio,
} from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface ComercioRecord {
  id:             string
  name:           string
  category:       string
  rating:         number
  address:        string
  phone:          string
  googleMapsUrl:  string
  distanceMeters: number | null
  walkTime:       string
  isFeatured:     boolean
  isVerified:     boolean
}

const EMPTY_FORM = {
  name: '',
  category: '',
  rating: 0,
  address: '',
  phone: '',
  googleMapsUrl: '',
  distanceMeters: '',
  walkTime: '',
  isFeatured: false,
  isVerified: false,
}

// ─── Config removed as it uses the SDK client ─────────────────

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

function ComercioForm({
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
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ej: Confiteria La Paz"
          />
        </Field>
        <Field label="Categoria">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.category}
            onChange={e => set('category', e.target.value)}
            placeholder="Ej: Cafeteria"
          />
        </Field>
        <Field label="Calificacion (0–5)">
          <input
            type="number" min={0} max={5} step={0.1}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.rating}
            onChange={e => set('rating', parseFloat(e.target.value) || 0)}
          />
        </Field>
        <Field label="Direccion">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="Av. del Valle 350"
          />
        </Field>
        <Field label="Telefono">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="(02477) 43-0000"
          />
        </Field>
        <Field label="Google Maps URL">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.googleMapsUrl}
            onChange={e => set('googleMapsUrl', e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </Field>
        <Field label="Distancia en metros (opcional)">
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.distanceMeters}
            onChange={e => set('distanceMeters', e.target.value)}
            placeholder="350"
          />
        </Field>
        <Field label="Tiempo a pie (ej: 5 min)">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.walkTime}
            onChange={e => set('walkTime', e.target.value)}
            placeholder="5 min caminando"
          />
        </Field>
      </div>

      <div className="flex gap-6 mb-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={e => set('isFeatured', e.target.checked)}
            className="w-4 h-4 accent-[#0F172A]"
          />
          <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Destacado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={e => set('isVerified', e.target.checked)}
            className="w-4 h-4 accent-[#0F172A]"
          />
          <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Verificado</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(form)}
          disabled={submitting || !form.name.trim()}
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

export default function AdminComerciosPage() {
  const [records, setRecords] = useState<ComercioRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId]   = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    db.from('comercios').latest().limit(100).find()
      .then((records: any) => setRecords(records as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    const payload = {
      ...form,
      rating: Number(form.rating) || 0,
      distanceMeters: form.distanceMeters ? Number(form.distanceMeters) : null,
      reviewsCount: 0,
    }
    const res = await createComercio(payload)
    if (res.data) {
      setRecords(prev => [res.data, ...prev])
      setShowAdd(false)
    }
    setSubmitting(false)
  }

  const handleUpdate = async (id: string, form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    const payload = {
      ...form,
      rating: Number(form.rating) || 0,
      distanceMeters: form.distanceMeters ? Number(form.distanceMeters) : null,
    }
    const res = await updateComercio(id, payload)
    if (res.data) {
      setRecords(prev => prev.map(r => r.id === id ? res.data : r))
      setEditId(null)
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este comercio?')) return
    await deleteComercio(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
            Comercios
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
        <ComercioForm
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
            No hay comercios cargados todavia.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id}>
              {editId === r.id ? (
                <ComercioForm
                  initial={{
                    name: r.name ?? '',
                    category: r.category ?? '',
                    rating: r.rating ?? 0,
                    address: r.address ?? '',
                    phone: r.phone ?? '',
                    googleMapsUrl: r.googleMapsUrl ?? '',
                    distanceMeters: r.distanceMeters != null ? String(r.distanceMeters) : '',
                    walkTime: r.walkTime ?? '',
                    isFeatured: r.isFeatured ?? false,
                    isVerified: r.isVerified ?? false,
                  }}
                  onSubmit={form => handleUpdate(r.id, form)}
                  onCancel={() => setEditId(null)}
                  submitting={submitting}
                />
              ) : (
                <div
                  className="rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-extrabold text-sm" style={{ color: '#0F172A' }}>
                        {r.name}
                      </p>
                      {r.isFeatured && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#E2E8F0', color: '#0F172A' }}
                        >
                          Destacado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.45)' }}>
                        {r.category}
                      </p>
                      {r.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={10} fill="#0F172A" stroke="none" />
                          <span className="text-[11px] font-bold" style={{ color: '#0F172A' }}>
                            {r.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setEditId(r.id); setShowAdd(false) }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
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
