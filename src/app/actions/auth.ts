'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { publicServerDb as authDb, serverDb as adminDb } from '@/lib/db-server'

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path:     '/',
  maxAge:   60 * 60 * 24 * 30,
}

async function saveSession(data: any) {
  if (!data || !data.user) return

  // Fetch profile to get app-level role (admin, comercio, estudiante, etc.)
  let profileRole: string | undefined
  try {
    const record = await adminDb.from('profiles').findOne({ userId: data.user.id })
    profileRole = record?.role
  } catch (err) {
    console.error('[saveSession] Profile fetch error:', err)
  }

  const userWithRole = { ...data.user, role: profileRole ?? data.user.role }

  const cookieStore = await cookies()
  cookieStore.set('mb_token',   data.access_token,  COOKIE_OPTS)
  cookieStore.set('mb_refresh', data.refresh_token, COOKIE_OPTS)
  cookieStore.set('mb_user', JSON.stringify(userWithRole), {
    ...COOKIE_OPTS,
    httpOnly: false,
  })
  cookieStore.set('mb_token_pub', data.access_token, {
    ...COOKIE_OPTS,
    httpOnly: false,
  })
}

export async function register(formData: FormData) {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string
  const name     = formData.get('name')     as string | undefined
  const rawRole  = (formData.get('role') as string) || 'estudiante'
  const role     = rawRole === 'comercio' ? 'dueno' : rawRole
  const phone    = (formData.get('phone') as string) || ''

  const avatarSeed = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

  const { data, error } = await authDb.auth.signUp(email, password, { name })
  if (error) return { error: error.message }
  if (!data || !data.user) return { error: 'Error al registrar usuario' }

  await adminDb.from('profiles').insert({
    userId: data.user.id,
    role,
    avatarSeed,
    avatarUrl: '',
    career: '',
    bio: '',
    age: null,
    contact: phone,
  }).catch(() => {})

  await saveSession(data)
  redirect(role === 'dueno' ? '/app/perfil' : '/app/inicio')
}

export async function login(formData: FormData) {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  console.log('[login] Starting login for:', email)
  
  const { data, error } = await authDb.auth.signIn(email, password)
  if (error) return { error: error.message }

  await saveSession(data)
  redirect('/app/inicio')
}

export async function logout() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('mb_refresh')?.value

  if (refreshToken) {
    authDb.auth.signOut().catch(() => {})
  }

  cookieStore.delete('mb_token')
  cookieStore.delete('mb_token_pub')
  cookieStore.delete('mb_refresh')
  cookieStore.delete('mb_user')
  redirect('/login')
}
