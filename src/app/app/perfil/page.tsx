'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, ChevronRight, Mail, Phone, Save, UserRound } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { getUserDb, publicDb as db } from '@/lib/db'

interface Profile {
  id: string
  userId: string
  role?: string
  avatarSeed?: string
  avatarUrl?: string
  career?: string
  bio?: string
  age?: number | string
  contact?: string
  city_origin?: string
  year_of_study?: number | null
}

function ProfileAvatar({
  profile,
  userName,
  uploading,
}: {
  profile: Profile | null
  userName: string
  uploading: boolean
}) {
  const initials = userName.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
  const hue = [...userName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360

  if (uploading) {
    return (
      <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 96, height: 96, background: 'var(--surface-soft)' }}>
        <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (profile?.avatarUrl) {
    return <img src={profile.avatarUrl} alt={userName} width={96} height={96} className="rounded-full object-cover" style={{ width: 96, height: 96 }} />
  }

  if (profile?.avatarSeed) {
    const style = profile.role === 'comercio' ? 'shapes' : 'adventurer'
    const src = `https://api.dicebear.com/9.x/${style}/svg?seed=${profile.avatarSeed}`
    return <img src={src} alt={userName} width={96} height={96} className="rounded-full bg-white" style={{ width: 96, height: 96 }} />
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-black"
      style={{ width: 96, height: 96, fontSize: 30, background: `hsl(${hue},45%,60%)`, color: '#fff' }}
    >
      {initials || '?'}
    </div>
  )
}

function RoleBadge({ role }: { role?: string }) {
  if (!role) return null
  const isComercio = role === 'comercio'

  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{
        background: isComercio ? 'var(--accent)' : 'var(--surface-soft)',
        color: isComercio ? 'var(--accent-contrast)' : 'var(--accent)',
      }}
    >
      {isComercio ? 'Comercio' : 'Estudiante'}
    </span>
  )
}

export default function PerfilPage() {
  const { user, loading: authLoading } = useUser()
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [career, setCareer] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [contact, setContact] = useState('')
  const [cityOrigin, setCityOrigin] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
    setToken(entry ? entry.split('=').slice(1).join('=') : null)
  }, [])

  useEffect(() => {
    if (!user) return
    setLoading(true)

    db.from('profiles').eq('userId', user.id).find()
      .then((res: any) => {
        const current = res[0] as Profile | undefined
        if (current) {
          setProfile(current)
          setCareer(current.career ?? '')
          setBio(current.bio ?? '')
          setAge(current.age != null ? String(current.age) : '')
          setContact(current.contact ?? '')
          setCityOrigin(current.city_origin ?? '')
          setYearOfStudy(current.year_of_study != null ? String(current.year_of_study) : '')
        }
        setName(user.name ?? '')
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token || !profile) return

    setUploading(true)

    try {
      const compressed = await compressImage(file, 600, 0.82)
      const userDb = getUserDb(token)
      const uploadRes = await userDb.storage.upload(compressed)
      const avatarUrl = uploadRes.data?.url
      if (!avatarUrl) throw new Error('No URL returned')

      await userDb.from('profiles').eq('id', profile.id).merge({ avatarUrl })
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev))
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!token || !profile) return
    setSaving(true)
    setSaveMsg('')

    try {
      const userDb = getUserDb(token)
      await userDb.from('profiles').eq('id', profile.id).merge({
        career: career.trim(),
        bio: bio.trim(),
        age: age !== '' ? Number(age) : null,
        contact: contact.trim(),
        city_origin: cityOrigin.trim(),
        year_of_study: yearOfStudy !== '' ? Number(yearOfStudy) : null,
      })

      setProfile((prev) => (
        prev
          ? { ...prev, career: career.trim(), bio: bio.trim(), age: age !== '' ? Number(age) : undefined, contact: contact.trim() }
          : prev
      ))
      setSaveMsg('Guardado')
      setTimeout(() => setSaveMsg(''), 2500)
    } catch {
      setSaveMsg('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    document.cookie = 'mb_token=; Max-Age=0; path=/'
    document.cookie = 'mb_token_pub=; Max-Age=0; path=/'
    document.cookie = 'mb_refresh=; Max-Age=0; path=/'
    document.cookie = 'mb_user=; Max-Age=0; path=/'
    router.push('/login')
  }

  if (authLoading || (!user && !authLoading)) {
    if (!authLoading && !user) {
      router.push('/login')
      return null
    }
    return null
  }

  return (
    <div className="min-h-screen py-6 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
  
        <section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
          <div
            className="rounded-[28px] p-5 sm:p-7 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}
          >
            <div className="absolute inset-y-0 right-0 w-44 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 220 200" aria-hidden>
                <circle cx="108" cy="72" r="58" fill="none" stroke="#F59E0B" strokeWidth="1" />
                <circle cx="164" cy="128" r="28" fill="none" stroke="#F59E0B" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#F59E0B' }}>
                Tu cuenta
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#ffffff' }}>
                Perfil y datos personales
              </h1>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Completá tu perfil para que el resto de la app tenga mejor contexto, contacto y presencia dentro de la comunidad.
              </p>
            </div>
          </div>

          <aside className="app-card p-4 sm:p-5 flex flex-col gap-4">
            <div>
              <p className="app-section-kicker mb-1">Resumen</p>
              <h2 className="app-section-title text-lg">Estado del perfil</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3" style={{ background: 'var(--surface-soft)' }}>
                <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{bio.length}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>caracteres en bio</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: 'var(--surface-soft)' }}>
                <p className="text-xl font-black leading-none" style={{ color: 'var(--accent)' }}>{contact.trim() ? 1 : 0}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>contacto cargado</p>
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface-soft)' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                Accesos rápidos
              </p>
              <a href="/app/inicio" className="flex items-center justify-between rounded-2xl px-4 py-3 hover:bg-[var(--surface)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                <span className="text-sm font-bold">Volver al inicio</span>
                <ChevronRight size={16} style={{ color: 'var(--text-muted-soft)' }} />
              </a>
            </div>
          </aside>
        </section>

        <section className="grid xl:grid-cols-[340px_minmax(0,1fr)] gap-4">
          <div className="space-y-4">
            <div className="app-card p-6">
              {loading ? (
                <div className="flex flex-col items-center gap-3 animate-pulse">
                  <div className="w-24 h-24 rounded-full" style={{ background: 'var(--surface-soft)' }} />
                  <div className="h-4 w-32 rounded-full" style={{ background: 'var(--surface-soft)' }} />
                  <div className="h-3 w-20 rounded-full" style={{ background: 'rgba(15,23,42,0.06)' }} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <ProfileAvatar profile={profile} userName={user?.name ?? 'U'} uploading={uploading} />

                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-85 disabled:opacity-40"
                      style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
                    >
                      <Camera size={13} />
                      {uploading ? 'Subiendo...' : 'Cambiar foto'}
                    </button>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      {user?.name ?? 'Mi perfil'}
                    </h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {user?.email}
                    </p>
                  </div>

                  <RoleBadge role={profile?.role} />
                </div>
              )}
            </div>

            <div className="app-card p-5">
              <p className="app-section-kicker mb-1">Contacto</p>
              <h3 className="app-section-title text-lg mb-4">Datos visibles</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted-soft)' }}>Email</p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted-soft)' }}>Contacto</p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{contact || 'Todavía no cargado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {!loading && (
              <div className="app-card p-5 sm:p-6 space-y-5">
                <div>
                  <p className="app-section-kicker mb-1">Editar</p>
                  <h2 className="app-section-title text-xl">Actualizá tu perfil</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Nombre
                    </label>
                    <div className="relative">
                      <UserRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted-soft)' }} />
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Tu nombre"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
                        style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Carrera
                    </label>
                    <input
                      type="text"
                      value={career}
                      onChange={(event) => setCareer(event.target.value)}
                      placeholder="Ej: Ingeniería en Sistemas"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Ciudad de origen
                    </label>
                    <input
                      type="text"
                      value={cityOrigin}
                      onChange={(event) => setCityOrigin(event.target.value)}
                      placeholder="Ej: Buenos Aires"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Año de cursada
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(event) => setYearOfStudy(event.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: yearOfStudy ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      <option value="">Seleccioná un año</option>
                      {[1,2,3,4,5,6].map(y => (
                        <option key={y} value={y}>{y}° año</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Biografía <span className="normal-case font-normal">({bio.length}/200)</span>
                    </label>
                    <textarea
                      value={bio}
                      maxLength={200}
                      onChange={(event) => setBio(event.target.value)}
                      placeholder="Contá un poco sobre vos, tu carrera o lo que buscás en la ciudad."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Edad
                    </label>
                    <input
                      type="number"
                      value={age}
                      min={16}
                      max={99}
                      onChange={(event) => setAge(event.target.value)}
                      placeholder="Ej: 21"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
                      Contacto
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="WhatsApp, Instagram o similar"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving || !profile}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                  >
                    <Save size={15} />
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  {saveMsg && <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{saveMsg}</span>}
                </div>
              </div>
            )}

            <div className="app-card p-5">
              <p className="app-section-kicker mb-1">Sesión</p>
              <h3 className="app-section-title text-lg mb-4">Control de cuenta</h3>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl text-sm font-bold transition-colors hover:opacity-85"
                style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function compressImage(file: File, maxSize: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'))
          return
        }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }

    img.onerror = reject
    img.src = url
  })
}
