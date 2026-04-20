'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { publicDb as db } from '@/lib/db'

// ─── SVG Themes (inline previews) ────────────────────────────────

const THEME_OPTIONS = [
  { id: 'construccion', label: 'Construcción',  emoji: '🏗️', keywords: ['construc','relevan','verific','pronto'] },
  { id: 'propietario',  label: 'Propietario',   emoji: '🏠', keywords: ['propietar','publicá','publicar','dueño','gratis','llave'] },
  { id: 'comunidad',    label: 'Comunidad',     emoji: '👥', keywords: ['estudiant','comunidad','muro','unnoba','hecho por'] },
  { id: 'transporte',   label: 'Transporte',    emoji: '🚌', keywords: ['colectivo','transporte','bus','linea'] },
  { id: 'busqueda',     label: 'Búsqueda',      emoji: '🔍', keywords: ['busca','encontrá','encontra','busqueda'] },
  { id: 'mapa',         label: 'Mapa',          emoji: '📍', keywords: ['mapa','ubicacion','zona','barrio'] },
]

function autoTheme(kicker: string, title: string): string {
  const text = `${kicker} ${title}`.toLowerCase()
  for (const t of THEME_OPTIONS) {
    if (t.keywords.some(k => text.includes(k))) return t.id
  }
  return 'construccion'
}

// ─── Types ───────────────────────────────────────────────────────

interface HeroMessageRecord {
  id: string
  kicker: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  badgeLabel: string
  badgeColor: string
  svgTheme: string
  active: boolean
  sortOrder: number
}

type HeroMessageForm = Omit<HeroMessageRecord, 'id'>

const EMPTY: HeroMessageForm = {
  kicker: '',
  title: '',
  body: '',
  ctaLabel: '',
  ctaHref: '',
  badgeLabel: '',
  badgeColor: '#F59E0B',
  svgTheme: 'construccion',
  active: true,
  sortOrder: 0,
}

// ─── Admin page ───────────────────────────────────────────────────

export default function HeroMessagesAdminPage() {
  const [records, setRecords] = useState<HeroMessageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<HeroMessageRecord | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<HeroMessageForm>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await db.from('heromessages').latest().limit(50).find() as any
      setRecords((data ?? []) as HeroMessageRecord[])
    } catch { setRecords([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY)
    setEditing(null)
    setCreating(true)
    setSaveError('')
  }

  function openEdit(r: HeroMessageRecord) {
    setForm({
      kicker: r.kicker ?? '',
      title: r.title ?? '',
      body: r.body ?? '',
      ctaLabel: r.ctaLabel ?? '',
      ctaHref: r.ctaHref ?? '',
      badgeLabel: r.badgeLabel ?? '',
      badgeColor: r.badgeColor ?? '#F59E0B',
      svgTheme: r.svgTheme ?? 'construccion',
      active: r.active ?? true,
      sortOrder: r.sortOrder ?? 0,
    })
    setEditing(r)
    setCreating(false)
    setSaveError('')
  }

  function handleAuto() {
    const suggested = autoTheme(form.kicker, form.title)
    setForm(f => ({ ...f, svgTheme: suggested }))
  }

  async function handleSave() {
    setSaveError('')
    setSubmitting(true)
    try {
      const payload = {
        kicker:     form.kicker,
        title:      form.title,
        body:       form.body,
        ctaLabel:   form.ctaLabel,
        ctaHref:    form.ctaHref,
        badgeLabel: form.badgeLabel,
        badgeColor: form.badgeColor,
        svgTheme:   form.svgTheme,
        active:     form.active,
        sortOrder:  form.sortOrder,
      }
      if (editing) {
        await db.from('heromessages').eq('id', editing.id).update(payload)
      } else {
        await db.from('heromessages').insert(payload)
      }
      await load()
      setEditing(null)
      setCreating(false)
    } catch (e: any) {
      setSaveError(e?.message ?? 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este mensaje?')) return
    await db.from('heromessages').eq('id', id).delete()
    await load()
  }

  async function handleToggleActive(r: HeroMessageRecord) {
    await db.from('heromessages').eq('id', r.id).update({ active: !r.active })
    await load()
  }

  const showForm = creating || !!editing

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="app-section-kicker mb-1">Admin</p>
          <h1 className="app-section-title text-2xl">Mensajes del carrusel</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Se muestran en /app/inicio junto a los hospedajes. Si hay mensajes activos en DB, reemplazan los mensajes por defecto.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ background: '#0F172A', color: '#F59E0B' }}
          >
            <Plus size={16} /> Nuevo mensaje
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="app-card p-6 space-y-5">
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {editing ? 'Editar mensaje' : 'Nuevo mensaje'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Kicker</span>
              <input
                className="app-input"
                placeholder="En construcción"
                value={form.kicker}
                onChange={e => setForm(f => ({ ...f, kicker: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Título</span>
              <input
                className="app-input"
                placeholder="Estamos relevando hospedajes."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Cuerpo del mensaje</span>
            <textarea
              className="app-input"
              rows={3}
              placeholder="Descripción del mensaje..."
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Label del CTA (botón)</span>
              <input
                className="app-input"
                placeholder="Escribinos por WhatsApp"
                value={form.ctaLabel}
                onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>URL del CTA</span>
              <input
                className="app-input"
                placeholder="https://wa.me/..."
                value={form.ctaHref}
                onChange={e => setForm(f => ({ ...f, ctaHref: e.target.value }))}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Badge (texto)</span>
              <input
                className="app-input"
                placeholder="Próximamente"
                value={form.badgeLabel}
                onChange={e => setForm(f => ({ ...f, badgeLabel: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Color badge</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.badgeColor}
                  onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0.5"
                  style={{ background: 'none' }}
                />
                <input
                  className="app-input flex-1"
                  value={form.badgeColor}
                  onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))}
                />
              </div>
            </label>
          </div>

          {/* SVG Theme picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ilustración SVG</span>
              <button
                type="button"
                onClick={handleAuto}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <Sparkles size={12} /> Auto-generar
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {THEME_OPTIONS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, svgTheme: t.id }))}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all"
                  style={{
                    background: form.svgTheme === t.id ? '#0F172A' : 'var(--surface-soft)',
                    border: `2px solid ${form.svgTheme === t.id ? '#F59E0B' : 'transparent'}`,
                  }}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-[10px] font-bold" style={{ color: form.svgTheme === t.id ? '#F59E0B' : 'var(--text-muted)' }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Orden (menor = primero)</span>
              <input
                type="number"
                className="app-input"
                value={form.sortOrder}
                onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <div
                onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                className="w-11 h-6 rounded-full transition-all relative"
                style={{ background: form.active ? '#0F172A' : '#E2E8F0', cursor: 'pointer' }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full transition-all"
                  style={{ background: form.active ? '#F59E0B' : '#94A3B8', left: form.active ? '24px' : '4px' }}
                />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {form.active ? 'Activo' : 'Inactivo'}
              </span>
            </label>
          </div>

          {saveError && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {saveError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={submitting || !form.title.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: '#0F172A', color: '#F59E0B' }}
            >
              {submitting ? 'Guardando...' : 'Guardar mensaje'}
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false) }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-60"
              style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="app-card h-20 animate-pulse" style={{ background: '#E2E8F0' }} />)}
        </div>
      ) : records.length === 0 ? (
        <div className="app-card px-5 py-10 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted-soft)' }}>
            No hay mensajes personalizados. Se usan los mensajes por defecto del código.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => {
            const theme = THEME_OPTIONS.find(t => t.id === r.svgTheme)
            return (
              <div
                key={r.id}
                className="app-card px-4 py-4 flex items-center gap-4"
                style={{ opacity: r.active ? 1 : 0.5 }}
              >
                {/* Theme emoji */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'var(--surface-soft)' }}
                >
                  {theme?.emoji ?? '💬'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                    {!r.active && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: '#E2E8F0', color: '#64748B' }}>Inactivo</span>
                    )}
                  </div>
                  <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {r.kicker} · {theme?.label ?? r.svgTheme}
                    {r.badgeLabel && ` · Badge: ${r.badgeLabel}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleActive(r)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-60"
                    style={{ background: 'var(--surface-soft)', color: r.active ? '#10B981' : '#94A3B8' }}
                    title={r.active ? 'Desactivar' : 'Activar'}
                  >
                    {r.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(r)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-60"
                    style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-60"
                    style={{ background: 'var(--surface-soft)', color: '#EF4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-center" style={{ color: 'var(--text-muted-soft)' }}>
        Si no hay mensajes activos en la base de datos, /app/inicio muestra los 3 mensajes por defecto del código.
      </p>
    </div>
  )
}
