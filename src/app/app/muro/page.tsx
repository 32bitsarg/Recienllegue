'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { publicDb as db, getUserDb } from '@/lib/db'
import AppSectionNav from '@/components/AppSectionNav'
import HeroParticles from '@/components/HeroParticles'
import {
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
  Users,
  X,
} from 'lucide-react'

interface Post {
  id: string
  userId: string
  userName: string
  title: string
  body: string
  category: string
  likesCount: number
  commentsCount: number
  userRole?: string
  created_at: string
}

interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  body: string
  created_at: string
}

const CATEGORIES = [
  { value: 'vendo', label: 'Vendo', color: '#10b981' },
  { value: 'busco', label: 'Busco', color: '#3b82f6' },
  { value: 'ofrezco', label: 'Ofrezco', color: '#8b5cf6' },
  { value: 'perdido', label: 'Se perdió', color: '#f59e0b' },
  { value: 'otro', label: 'Otro', color: '#6b7280' },
]

function catColor(cat: string) {
  return CATEGORIES.find((item) => item.value === cat)?.color ?? '#6b7280'
}

function catLabel(cat: string) {
  return CATEGORIES.find((item) => item.value === cat)?.label ?? cat
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ahora'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
  const hue = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold"
      style={{ width: size, height: size, fontSize: size * 0.35, background: `hsl(${hue},45%,60%)`, color: '#fff' }}
    >
      {initials || '?'}
    </div>
  )
}

function InlinePostForm({ token, userName, userId, userRole, onCreated }: {
  token: string | null
  userName: string
  userId: string
  userRole: string
  onCreated: (post: Post) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  const collapse = () => {
    setExpanded(false)
    setCategory('')
    setTitle('')
    setBody('')
    setError('')
  }

  const handleOpen = () => {
    setExpanded(true)
    // Foco en el título luego de que termine la transición
    setTimeout(() => titleRef.current?.focus(), 320)
  }

  const submit = async () => {
    if (!token) return
    if (!category) { setError('Elegí una categoría'); return }
    if (!title.trim()) { setError('El título es obligatorio'); return }
    if (!body.trim()) { setError('Escribí algo en el aviso'); return }

    setSending(true)
    setError('')

    const payload = { userId, userName, userRole, category, title: title.trim(), body: body.trim(), likesCount: 0, commentsCount: 0 }
    const res = await getUserDb(token).from('muro_posts').insert(payload)

    if (res.data) {
      onCreated(res.data as Post)
      collapse()
    } else {
      setError('Error al publicar. Intentá de nuevo.')
    }
    setSending(false)
  }

  if (!token) return null

  return (
    <div
      className="app-card overflow-hidden"
      style={{ transition: 'box-shadow 0.2s ease' }}
    >
      {/* Barra superior — siempre visible */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Avatar name={userName} size={34} />
        <button
          onClick={handleOpen}
          className="flex-1 text-left text-sm px-4 py-2.5 rounded-2xl transition-all"
          style={{
            background: expanded ? '#fff' : 'var(--surface-soft)',
            border: `1px solid ${expanded ? 'rgba(22,56,50,0.15)' : 'var(--border-subtle)'}`,
            color: expanded ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: expanded ? 600 : 400,
          }}
        >
          {expanded ? (title || '¿Qué querés publicar hoy?') : '¿Qué querés publicar hoy?'}
        </button>
        {expanded && (
          <button
            onClick={collapse}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-xl hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)', background: 'var(--surface-soft)' }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Formulario expandible — transición CSS, sin swap de contenido */}
      <div
        style={{
          maxHeight: expanded ? 600 : 0,
          opacity: expanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
        }}
      >
        <div
          className="px-4 pb-4 space-y-3.5"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          {/* Categorías */}
          <div className="pt-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted-soft)' }}>
              Categoría
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                  style={{
                    background: category === item.value ? item.color : `${item.color}12`,
                    color: category === item.value ? '#fff' : item.color,
                    transform: category === item.value ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
              Título <span className="normal-case font-normal">({title.length}/60)</span>
            </p>
            <input
              ref={titleRef}
              type="text"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Vendo bicicleta rodado 26"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Descripción */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
              Descripción <span className="normal-case font-normal">({body.length}/400)</span>
            </p>
            <textarea
              value={body}
              maxLength={400}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Contá detalles, precio, contacto o ubicación."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#dc2626' }}>{error}</p>
          )}

          <button
            onClick={submit}
            disabled={sending}
            className="w-full py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          >
            {sending ? 'Publicando...' : 'Publicar aviso'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CommentsSection({ post, token, currentUserId, userName, onComment }: {
  post: Post
  token: string | null
  currentUserId: string | null
  userName: string
  onComment: () => void
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    db.from('muro_comments').eq('postId', post.id).latest().limit(50).find()
      .then((data) => setComments(data as Comment[]))
      .finally(() => setLoading(false))
  }, [post.id])

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  const submit = async () => {
    if (!body.trim() || !token || !currentUserId) return
    setSending(true)
    const userDb = getUserDb(token)
    const res = await userDb.from('muro_comments').insert({ postId: post.id, userId: currentUserId, userName, body: body.trim() })
    if (res.data) {
      setComments((prev) => [res.data as Comment, ...prev])
      await userDb.from('muro_posts').eq('id', post.id).merge({ commentsCount: (post.commentsCount ?? 0) + 1 })
      onComment()
      setBody('')
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="px-4 pb-4 pt-2">
        <div className="h-3 w-24 rounded-full animate-pulse" style={{ background: 'rgba(22,56,50,0.06)' }} />
      </div>
    )
  }

  return (
    <div className="px-4 pb-4 pt-1 space-y-3">
      {comments.length === 0 && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Sin comentarios todavía. Sé el primero.</p>}

      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2.5">
          <Avatar name={comment.userName} size={24} />
          <div className="flex-1">
            <div className="rounded-xl rounded-tl-none px-3 py-2" style={{ background: '#eef6f0' }}>
              <p className="text-[11px] font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{comment.userName}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{comment.body}</p>
            </div>
            <p className="text-[10px] mt-1 ml-1" style={{ color: 'var(--text-muted-soft)' }}>{relTime(comment.created_at)}</p>
          </div>
        </div>
      ))}

      {token && (
        <div className="flex gap-2 pt-1">
          <textarea
            ref={inputRef}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
            placeholder="Escribí un comentario..."
            rows={1}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-xs outline-none"
            style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
          />
          <button
            onClick={submit}
            disabled={!body.trim() || sending}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 mt-auto"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          >
            <Send size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

function PostCard({ post, token, currentUserId, userName, onDelete, onLike }: {
  post: Post
  token: string | null
  currentUserId: string | null
  userName: string
  onDelete: (id: string) => void
  onLike: (id: string, delta: number) => void
}) {
  const isOwn = currentUserId === post.userId
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount ?? 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reported, setReported] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const color = catColor(post.category)
  const isLong = post.body.length > 180

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!token || !currentUserId) return
    db.from('muro_likes').eq('postId', post.id).eq('userId', currentUserId).find()
      .then((res) => setLiked(res.length > 0))
  }, [post.id, token, currentUserId])

  const handleLike = async () => {
    if (!token || !currentUserId) return
    const newLiked = !liked
    setLiked(newLiked)
    onLike(post.id, newLiked ? 1 : -1)

    const userDb = getUserDb(token)
    if (newLiked) {
      await userDb.from('muro_likes').insert({ postId: post.id, userId: currentUserId })
    } else {
      const matches = await db.from('muro_likes').eq('postId', post.id).eq('userId', currentUserId).find()
      const match = matches[0]
      if (match) await userDb.from('muro_likes').delete(match.id)
    }
  }

  const handleDelete = async () => {
    if (!token || !isOwn) return
    if (!confirm('Eliminar este aviso?')) return
    const userDb = getUserDb(token)
    await userDb.from('muro_posts').delete(post.id)
    onDelete(post.id)
  }

  const handleReport = async () => {
    if (!token || !currentUserId || reported) return
    const userDb = getUserDb(token)
    await userDb.from('muro_reports').insert({ postId: post.id, userId: currentUserId, reason: 'Reportado por usuario' })
    setReported(true)
    setMenuOpen(false)
  }

  return (
    <article className="app-card overflow-hidden transition-all">
      <div className="h-1 w-full" style={{ background: color }} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={post.userName} />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{post.userName}</p>
                {post.userRole === 'comercio' && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
                    Comercio
                  </span>
                )}
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted-soft)' }}>{relTime(post.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>
              {catLabel(post.category)}
            </span>

            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((open) => !open)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-10 min-w-[150px]" style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid var(--border-subtle)' }}>
                  {isOwn ? (
                    <button onClick={handleDelete} className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-left transition-colors hover:bg-red-50" style={{ color: '#dc2626' }}>
                      <Trash2 size={13} /> Eliminar aviso
                    </button>
                  ) : (
                    <button onClick={handleReport} disabled={reported} className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-left transition-colors hover:bg-gray-50 disabled:opacity-40" style={{ color: '#374151' }}>
                      <Flag size={13} />
                      {reported ? 'Reportado' : 'Reportar aviso'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="font-extrabold text-sm leading-snug mb-1.5" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {isLong && !expanded ? `${post.body.slice(0, 180)}...` : post.body}
        </p>
        {isLong && (
          <button onClick={() => setExpanded((value) => !value)} className="flex items-center gap-1 text-[10px] font-bold mt-2 transition-opacity hover:opacity-60" style={{ color: 'var(--accent)' }}>
            {expanded ? <><ChevronUp size={11} /> Ver menos</> : <><ChevronDown size={11} /> Ver más</>}
          </button>
        )}

        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLike}
            disabled={!token}
            className="flex items-center gap-1.5 text-[11px] font-semibold transition-all disabled:opacity-50"
            style={{ color: liked ? '#e11d48' : 'var(--text-muted)' }}
          >
            <Heart size={14} fill={liked ? '#e11d48' : 'none'} strokeWidth={liked ? 0 : 1.8} />
            {post.likesCount > 0 ? post.likesCount : ''}
          </button>

          <button onClick={() => setShowComments((show) => !show)} className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors" style={{ color: showComments ? 'var(--accent)' : 'var(--text-muted)' }}>
            <MessageCircle size={14} strokeWidth={1.8} />
            {localCommentsCount > 0 ? localCommentsCount : 'Comentar'}
          </button>
        </div>
      </div>

      {showComments && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <CommentsSection post={post} token={token} currentUserId={currentUserId} userName={userName} onComment={() => setLocalCommentsCount((count) => count + 1)} />
        </div>
      )}
    </article>
  )
}

export default function MuroPage() {
  const { user, loading: authLoading } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filterCat, setFilterCat] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('estudiante')

  useEffect(() => {
    const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
    setToken(entry ? entry.split('=').slice(1).join('=') : null)
  }, [])

  useEffect(() => {
    if (!user) return
    db.from('profiles').eq('userId', user.id).find().then((profiles) => {
      if (profiles?.[0]?.role) setUserRole(profiles[0].role)
    })
  }, [user])

  const fetchPosts = useCallback(async (pageNum: number, cat: string, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)

    let query = db.from('muro_posts').latest().page(pageNum).limit(10)
    if (cat) query = query.eq('category', cat)

    const res = await query.get()
    const records = res.data as Post[]

    setPosts((prev) => (append ? [...prev, ...records] : records))
    setHasMore(res.page !== null && res.page < (res.pages || 1))
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    setPage(1)
    fetchPosts(1, filterCat)
  }, [filterCat, fetchPosts])

  const handleLike = (id: string, delta: number) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, likesCount: Math.max(0, (post.likesCount || 0) + delta) } : post)))
  }

  if (authLoading) return null

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          Necesitás iniciar sesión para ver el muro.
        </p>
        <a href="/login" className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
          Iniciar sesión
        </a>
      </div>
    )
  }

  const currentUserName = user?.name ?? 'Anónimo'

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <AppSectionNav />

      <section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
        <div
          className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
          style={{ background: '#163832' }}
        >
          <HeroParticles />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#a8ddb5' }}>
              Comunidad
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#daf1de' }}>
              Muro para publicar, buscar y conectar
            </h1>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b8e4bf' }}>
              Un espacio simple para mover avisos entre estudiantes, compartir oportunidades y resolver necesidades cotidianas.
            </p>
          </div>
        </div>

        <aside className="app-card p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <p className="app-section-kicker mb-1">Resumen</p>
            <h2 className="app-section-title text-lg">Actividad del muro</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{posts.length}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>avisos visibles</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: '#eef6f0' }}>
              <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{filterCat ? 1 : CATEGORIES.length}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{filterCat ? 'filtro activo' : 'categorías'}</p>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#eef6f0' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface)', color: 'var(--accent)' }}>
                <Users size={16} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Publicación rápida</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Podés crear avisos sin salir de la pantalla.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid xl:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
        <div className="space-y-4">
          <InlinePostForm token={token} userName={currentUserName} userId={user?.id ?? ''} userRole={userRole} onCreated={(post) => setPosts((prev) => [post, ...prev])} />

          <div className="app-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="app-section-kicker mb-1">Filtrar</p>
                <h2 className="app-section-title text-xl">Explorá por tipo de aviso</h2>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {filterCat ? `Mostrando: ${catLabel(filterCat)}` : 'Mostrando todas las categorías'}
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 mt-4 no-scrollbar">
              <button
                onClick={() => setFilterCat('')}
                className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: filterCat === '' ? 'var(--accent)' : 'var(--surface)',
                  color: filterCat === '' ? 'var(--accent-contrast)' : 'var(--accent)',
                  border: `1px solid ${filterCat === '' ? 'transparent' : 'var(--border-subtle)'}`,
                }}
              >
                Todo
              </button>
              {CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterCat(item.value)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: filterCat === item.value ? item.color : `${item.color}12`,
                    color: filterCat === item.value ? '#fff' : item.color,
                    border: `1px solid ${filterCat === item.value ? 'transparent' : `${item.color}30`}`,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="app-card overflow-hidden animate-pulse">
                  <div className="h-1 w-full" style={{ background: 'rgba(22,56,50,0.08)' }} />
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full" style={{ background: 'rgba(22,56,50,0.08)' }} />
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-24 rounded-full" style={{ background: 'rgba(22,56,50,0.08)' }} />
                        <div className="h-2 w-14 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
                      </div>
                    </div>
                    <div className="h-4 w-3/4 rounded-full" style={{ background: 'rgba(22,56,50,0.06)' }} />
                    <div className="h-3 w-full rounded-full" style={{ background: 'rgba(22,56,50,0.05)' }} />
                    <div className="h-3 w-2/3 rounded-full" style={{ background: 'rgba(22,56,50,0.05)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="app-card px-5 py-12 text-center">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {filterCat ? 'No hay avisos en esta categoría' : 'Todavía no hay avisos'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Sé el primero en publicar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  token={token}
                  currentUserId={user?.id ?? null}
                  userName={currentUserName}
                  onDelete={(id) => setPosts((prev) => prev.filter((item) => item.id !== id))}
                  onLike={handleLike}
                />
              ))}

              {hasMore && (
                <button
                  onClick={() => {
                    const next = page + 1
                    setPage(next)
                    fetchPosts(next, filterCat, true)
                  }}
                  disabled={loadingMore}
                  className="w-full py-3 rounded-2xl text-xs font-bold transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', color: 'var(--accent)' }}
                >
                  {loadingMore ? 'Cargando...' : 'Ver más avisos'}
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="hidden xl:block app-card p-5 sticky top-6">
          <p className="app-section-kicker mb-1">Consejos</p>
          <h3 className="app-section-title text-lg mb-4">Para publicar mejor</h3>
          <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>Usá títulos concretos para que el aviso se entienda rápido desde mobile.</p>
            <p>Agregá precio, zona y forma de contacto dentro del cuerpo del mensaje.</p>
            <p>Si ya resolviste el pedido, borrá el aviso para mantener el muro limpio.</p>
          </div>
        </aside>
      </section>
    </div>
  )
}
