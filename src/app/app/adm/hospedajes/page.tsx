'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, Upload, Image as ImageIcon } from 'lucide-react'
import {
  createHospedaje,
  updateHospedaje,
  deleteHospedaje,
} from '@/app/actions/admin'
import { publicDb as db, getUserDb } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface HospedajeRecord {
  id: string
  name: string
  type: string
  address: string
  price: string
  priceMax: string
  capacity: string
  phone: string
  description: string
  isVerified: boolean
  amenities: string[]
  images: string[]
}

// ─── Constants ────────────────────────────────────────────────

type HospedajeForm = Omit<HospedajeRecord, 'id'>

const EMPTY_FORM: HospedajeForm = {
  name: '',
  type: 'Pension',
  address: '',
  price: '',
  priceMax: '',
  capacity: '',
  phone: '',
  description: '',
  isVerified: false,
  amenities: [],
  images: [],
}

const TYPES = ['Pension', 'Departamento', 'Casa de familia', 'Habitacion']

const AMENITIES_LIST = [
  { id: 'wifi',             label: 'WiFi',              emoji: '📶' },
  { id: 'agua_caliente',    label: 'Agua caliente',     emoji: '🚿' },
  { id: 'luz_incluida',     label: 'Luz incluida',      emoji: '💡' },
  { id: 'gas_incluido',     label: 'Gas incluido',      emoji: '🔥' },
  { id: 'cocina',           label: 'Cocina equipada',   emoji: '🍳' },
  { id: 'lavarropas',       label: 'Lavarropas',        emoji: '🌀' },
  { id: 'amueblado',        label: 'Amueblado',         emoji: '🪑' },
  { id: 'aire_acondicionado', label: 'Aire acondicionado', emoji: '❄️' },
  { id: 'calefaccion',      label: 'Calefacción',       emoji: '🌡️' },
  { id: 'limpieza',         label: 'Limpieza incluida', emoji: '🧹' },
  { id: 'desayuno',         label: 'Desayuno incluido', emoji: '☕' },
  { id: 'estacionamiento',  label: 'Estacionamiento',   emoji: '🅿️' },
  { id: 'seguridad',        label: 'Seguridad',         emoji: '🔒' },
  { id: 'patio',            label: 'Patio / Terraza',   emoji: '🌿' },
  { id: 'mascotas',         label: 'Acepta mascotas',   emoji: '🐾' },
]

// ─── Helpers ──────────────────────────────────────────────────

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

async function uploadImage(file: File, token: string): Promise<string | null> {
  try {
    const compressed = await compressImage(file, 900, 0.82)
    const userDb = getUserDb(token)
    const res = await userDb.storage.upload(compressed)
    return res.data?.url ?? null
  } catch {
    return null
  }
}

function compressImage(file: File, maxSize: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) { height = Math.round(height * maxSize / width); width = maxSize }
        else { width = Math.round(width * maxSize / height); height = maxSize }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('toBlob failed')); return }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.onerror = reject
    img.src = url
  })
}

// ─── Image Uploader ───────────────────────────────────────────

function ImageUploader({
  images,
  onChange,
}: {
  images: string[]
  onChange: (images: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const getToken = () =>
    document.cookie.split('; ').find(r => r.startsWith('mb_token_pub='))?.split('=').slice(1).join('=') ?? ''

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const token = getToken()
    if (!token) { alert('No hay sesión activa'); return }

    setUploading(true)
    setUploadingCount(files.length)
    const urls: string[] = []

    for (const file of Array.from(files)) {
      const url = await uploadImage(file, token)
      if (url) urls.push(url)
      setUploadingCount(c => c - 1)
    }

    onChange([...images, ...urls])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(220,38,38,0.9)', color: '#fff' }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
        style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A', border: '1px dashed rgba(15,23,42,0.15)' }}
      >
        {uploading ? (
          <>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0F172A', borderTopColor: 'transparent' }} />
            Subiendo {uploadingCount > 0 ? `(${uploadingCount} restantes)` : ''}...
          </>
        ) : (
          <>
            <Upload size={14} />
            {images.length > 0 ? 'Agregar más fotos' : 'Subir fotos'}
          </>
        )}
      </button>
      <p className="text-[10px]" style={{ color: 'rgba(15,23,42,0.35)' }}>
        JPG o PNG · Máx 5MB por imagen · Se comprimen automáticamente
      </p>
    </div>
  )
}

// ─── Amenities Picker ─────────────────────────────────────────

function AmenitiesPicker({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (a: string[]) => void
}) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter(a => a !== id)
        : [...selected, id]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AMENITIES_LIST.map(({ id, label, emoji }) => {
        const active = selected.includes(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: active ? '#0F172A' : 'rgba(15,23,42,0.05)',
              color: active ? '#F59E0B' : 'rgba(15,23,42,0.55)',
              border: active ? '1px solid #0F172A' : '1px solid rgba(15,23,42,0.1)',
            }}
          >
            <span>{emoji}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────

function HospedajeForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  error,
}: {
  initial: HospedajeForm
  onSubmit: (data: HospedajeForm) => void
  onCancel: () => void
  submitting: boolean
  error?: string | null
}) {
  const [form, setForm] = useState<HospedajeForm>(initial)
  const set = (k: keyof HospedajeForm, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="rounded-2xl p-6 mb-6 space-y-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }}>

      {/* Basic fields */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(15,23,42,0.35)' }}>
          Datos básicos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ej: Pensión San Martín"
            />
          </Field>
          <Field label="Tipo">
            <select
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.type}
              onChange={e => set('type', e.target.value)}
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Dirección">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Av. San Martín 1240"
            />
          </Field>
          <Field label="Capacidad">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.capacity}
              onChange={e => set('capacity', e.target.value)}
              placeholder="1–2 personas"
            />
          </Field>
          <Field label="Precio mínimo">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="$80.000"
            />
          </Field>
          <Field label="Precio máximo">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.priceMax}
              onChange={e => set('priceMax', e.target.value)}
              placeholder="$120.000"
            />
          </Field>
          <Field label="Teléfono">
            <input
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="(02477) 43-0000"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Descripción (opcional)">
            <textarea
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={inputStyle}
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Detalles adicionales, ambiente, reglas de la casa..."
            />
          </Field>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(15,23,42,0.35)' }}>
          Servicios incluidos
        </p>
        <AmenitiesPicker
          selected={form.amenities}
          onChange={v => set('amenities', v)}
        />
        {form.amenities.length > 0 && (
          <p className="text-[10px] mt-2" style={{ color: 'rgba(15,23,42,0.4)' }}>
            {form.amenities.length} servicio{form.amenities.length !== 1 ? 's' : ''} seleccionado{form.amenities.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Images */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(15,23,42,0.35)' }}>
          Fotos del hospedaje
        </p>
        <ImageUploader
          images={form.images}
          onChange={v => set('images', v)}
        />
      </div>

      {/* Verified */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isVerified}
          onChange={e => set('isVerified', e.target.checked)}
          className="w-4 h-4 accent-[#0F172A]"
        />
        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>
          Marcar como verificado
        </span>
      </label>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={submitting || !form.name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: '#0F172A', color: '#F59E0B' }}
        >
          <Check size={14} />
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
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

// ─── Record row ───────────────────────────────────────────────

function RecordRow({
  r,
  onEdit,
  onDelete,
}: {
  r: HospedajeRecord
  onEdit: () => void
  onDelete: () => void
}) {
  const amenitiesPreview = (r.amenities ?? [])
    .slice(0, 4)
    .map(id => AMENITIES_LIST.find(a => a.id === id)?.emoji)
    .filter(Boolean)
    .join(' ')

  const firstImage = r.images?.[0]

  return (
    <div className="rounded-2xl overflow-hidden flex" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
      {/* Thumbnail */}
      {firstImage ? (
        <img
          src={firstImage}
          alt=""
          className="w-24 h-full object-cover shrink-0"
          style={{ minHeight: 72 }}
        />
      ) : (
        <div
          className="w-16 shrink-0 flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.04)', minHeight: 72 }}
        >
          <ImageIcon size={16} style={{ color: 'rgba(15,23,42,0.2)' }} />
        </div>
      )}

      <div className="flex-1 min-w-0 px-4 py-3.5 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="font-extrabold text-sm" style={{ color: '#0F172A' }}>
              {r.name}
            </p>
            {r.isVerified && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: '#E2E8F0', color: '#0F172A' }}>
                Verificado
              </span>
            )}
          </div>
          <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.45)' }}>
            {r.type} — {r.address}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-[11px] font-semibold" style={{ color: '#0F172A' }}>
              {r.price}{r.priceMax ? ` – ${r.priceMax}` : ''}
            </p>
            {amenitiesPreview && (
              <p className="text-[11px]">{amenitiesPreview}
                {(r.amenities?.length ?? 0) > 4 && (
                  <span style={{ color: 'rgba(15,23,42,0.35)' }}> +{r.amenities.length - 4}</span>
                )}
              </p>
            )}
            {(r.images?.length ?? 0) > 0 && (
              <p className="text-[10px]" style={{ color: 'rgba(15,23,42,0.35)' }}>
                {r.images.length} foto{r.images.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
            style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function AdminHospedajesPage() {
  const [records, setRecords] = useState<HospedajeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    db.from('hospedajes').latest().limit(50).find()
      .then((records: any) => setRecords(records as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (form: HospedajeForm) => {
    setSubmitting(true)
    setSaveError(null)
    try {
      const res = await createHospedaje(form as unknown as Record<string, unknown>)
      if (res?.data) {
        setRecords(prev => [res.data, ...prev])
        setShowAdd(false)
      } else {
        // insert succeeded but returned no record — reload list
        const refreshed: any = await db.from('hospedajes').latest().limit(50).find()
        setRecords(refreshed)
        setShowAdd(false)
      }
    } catch (e: any) {
      setSaveError(e?.message ?? 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (id: string, form: HospedajeForm) => {
    setSubmitting(true)
    setSaveError(null)
    try {
      const res = await updateHospedaje(id, form as unknown as Record<string, unknown>)
      if (res?.data) {
        setRecords(prev => prev.map(r => r.id === id ? res.data : r))
      } else {
        const refreshed: any = await db.from('hospedajes').latest().limit(50).find()
        setRecords(refreshed)
      }
      setEditId(null)
    } catch (e: any) {
      setSaveError(e?.message ?? 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este hospedaje?')) return
    try {
      await deleteHospedaje(id)
      setRecords(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('Error al eliminar')
    }
  }

  const toForm = (data: HospedajeRecord): HospedajeForm => ({
    name: data.name ?? '',
    type: data.type ?? 'Pension',
    address: data.address ?? '',
    price: data.price ?? '',
    priceMax: data.priceMax ?? '',
    capacity: data.capacity ?? '',
    phone: data.phone ?? '',
    description: data.description ?? '',
    isVerified: data.isVerified ?? false,
    amenities: data.amenities ?? [],
    images: data.images ?? [],
  })

  return (
    <div className="px-4 lg:px-8 py-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
            Hospedajes
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
        <HospedajeForm
          initial={EMPTY_FORM}
          onSubmit={handleCreate}
          onCancel={() => { setShowAdd(false); setSaveError(null) }}
          submitting={submitting}
          error={saveError}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
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
            No hay hospedajes cargados todavía.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id}>
              {editId === r.id ? (
                <HospedajeForm
                  initial={toForm(r)}
                  onSubmit={form => handleUpdate(r.id, form)}
                  onCancel={() => { setEditId(null); setSaveError(null) }}
                  submitting={submitting}
                  error={saveError}
                />
              ) : (
                <RecordRow
                  r={r}
                  onEdit={() => { setEditId(r.id); setShowAdd(false) }}
                  onDelete={() => handleDelete(r.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
