'use client'

import { useState, useEffect } from 'react'
import { Star, Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { createFeatured, updateFeatured, deleteFeatured } from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface FeaturedBusiness {
  id: string
  city_slug: string
  service_slug: string
  name: string
  tagline: string
  address?: string
  phone?: string
  website?: string
  status: 'active' | 'inactive'
  created_at: string
}

// ─── Toast ────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold"
      style={{
        background: type === 'success' ? '#0F172A' : '#991b1b',
        color: type === 'success' ? '#E2E8F0' : '#fee2e2',
        minWidth: 240,
      }}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────

function FeaturedRow({
  item,
  onToggle,
  onDelete,
}: {
  item: FeaturedBusiness
  onToggle: (id: string, current: 'active' | 'inactive') => void
  onDelete: (id: string) => void
}) {
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const isActive = item.status === 'active'

  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>
            {item.name}
          </p>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.06)',
              color: isActive ? '#065f46' : 'rgba(15,23,42,0.4)',
            }}
          >
            {isActive ? 'activo' : 'inactivo'}
          </span>
        </div>
        <p className="text-xs mb-1.5" style={{ color: 'rgba(15,23,42,0.5)' }}>
          {item.tagline}
        </p>
        <div className="flex flex-wrap gap-3 text-[11px] font-mono" style={{ color: 'rgba(15,23,42,0.4)' }}>
          <span>{item.city_slug} / {item.service_slug}</span>
          {item.address && <span>📍 {item.address}</span>}
          {item.phone && <span>📞 {item.phone}</span>}
          {item.website && (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              {item.website}
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          disabled={loadingToggle}
          onClick={async () => {
            setLoadingToggle(true)
            await onToggle(item.id, item.status)
            setLoadingToggle(false)
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{
            background: isActive ? 'rgba(15,23,42,0.06)' : 'rgba(16,185,129,0.08)',
            color: isActive ? '#0F172A' : '#065f46',
          }}
        >
          {isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
          {loadingToggle ? '...' : isActive ? 'Desactivar' : 'Activar'}
        </button>

        <button
          disabled={loadingDelete}
          onClick={async () => {
            setLoadingDelete(true)
            await onDelete(item.id)
            setLoadingDelete(false)
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{ background: '#fee2e2', color: '#991b1b' }}
        >
          <Trash2 size={13} />
          {loadingDelete ? '...' : 'Eliminar'}
        </button>
      </div>
    </div>
  )
}

// ─── Empty form state ─────────────────────────────────────────

const EMPTY_FORM = {
  city_slug: 'pergamino',
  service_slug: '',
  name: '',
  tagline: '',
  address: '',
  phone: '',
  website: '',
  status: 'active' as 'active' | 'inactive',
}

// ─── Page ─────────────────────────────────────────────────────

export default function DestacadosPage() {
  const [items, setItems] = useState<FeaturedBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type })
  const hideToast = () => setToast(null)

  const loadData = () => {
    db.from('featured_businesses').latest().limit(50).find()
      .then((data: any) => {
        setItems(data as any)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (id: string, current: 'active' | 'inactive') => {
    const next = current === 'active' ? 'inactive' : 'active'
    const res = await updateFeatured(id, { status: next })
    if (res.data) {
      setItems(prev => prev.map(x => x.id === id ? { ...x, status: next } : x))
      showToast(`Destacado ${next === 'active' ? 'activado' : 'desactivado'}.`, 'success')
    } else {
      showToast('Error al cambiar el estado.', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este destacado?')) return
    const res = await deleteFeatured(id)
    if (!res.error) {
      setItems(prev => prev.filter(x => x.id !== id))
      showToast('Destacado eliminado.', 'success')
    } else {
      showToast('Error al eliminar.', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service_slug.trim() || !form.name.trim() || !form.tagline.trim()) {
      showToast('Completá los campos obligatorios.', 'error')
      return
    }
    setSubmitting(true)
    const payload = {
      city_slug: form.city_slug,
      service_slug: form.service_slug.trim(),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      website: form.website.trim() || undefined,
      status: form.status,
    }
    const res = await createFeatured(payload)
    setSubmitting(false)
    if (res.data) {
      showToast('Destacado creado exitosamente.', 'success')
      setForm(EMPTY_FORM)
      loadData()
    } else {
      showToast('Error al crear el destacado.', 'error')
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  })

  const inputStyle = {
    background: '#fff',
    border: '1px solid rgba(15,23,42,0.12)',
    color: '#0F172A',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 500,
    width: '100%',
    outline: 'none',
  } as React.CSSProperties

  const labelStyle = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'rgba(15,23,42,0.45)',
    display: 'block',
    marginBottom: 5,
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-5xl">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(15,23,42,0.08)' }}
          >
            <Star size={16} style={{ color: '#0F172A' }} />
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0F172A' }}>
            Destacados
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>
          Comercios que aparecen destacados en las landing pages de servicios.
        </p>
      </div>

      {/* Form */}
      <div
        className="rounded-2xl p-6 mb-10"
        style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
      >
        <h2 className="text-base font-extrabold mb-5 flex items-center gap-2" style={{ color: '#0F172A' }}>
          <Plus size={15} style={{ color: '#0F172A' }} />
          Nuevo destacado
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            {/* City slug */}
            <div>
              <label style={labelStyle}>Ciudad *</label>
              <select style={inputStyle} value={form.city_slug} onChange={e => setForm(p => ({ ...p, city_slug: e.target.value }))}>
                <option value="pergamino">pergamino</option>
              </select>
            </div>

            {/* Service slug */}
            <div>
              <label style={labelStyle}>Slug del servicio *</label>
              <input
                type="text"
                placeholder="ej: alojamiento-estudiantes"
                style={inputStyle}
                {...field('service_slug')}
              />
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Nombre del comercio *</label>
              <input
                type="text"
                placeholder="ej: Departamentos Del Centro"
                style={inputStyle}
                {...field('name')}
              />
            </div>

            {/* Tagline */}
            <div>
              <label style={labelStyle}>Tagline *</label>
              <input
                type="text"
                placeholder="ej: Alquileres amueblados cerca de la UNNOBA"
                style={inputStyle}
                {...field('tagline')}
              />
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>Dirección (opcional)</label>
              <input
                type="text"
                placeholder="ej: Av. Colón 450, Pergamino"
                style={inputStyle}
                {...field('address')}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Teléfono (opcional)</label>
              <input
                type="text"
                placeholder="ej: 2477-123456"
                style={inputStyle}
                {...field('phone')}
              />
            </div>

            {/* Website */}
            <div>
              <label style={labelStyle}>Sitio web (opcional)</label>
              <input
                type="url"
                placeholder="https://..."
                style={inputStyle}
                {...field('website')}
              />
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Estado</label>
              <select style={inputStyle} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            <Plus size={14} />
            {submitting ? 'Guardando...' : 'Crear destacado'}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="text-base font-extrabold mb-4" style={{ color: '#0F172A' }}>
          Destacados actuales
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-20 animate-pulse"
                style={{ background: 'rgba(15,23,42,0.05)' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.4)' }}>
              No hay destacados cargados todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <FeaturedRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
