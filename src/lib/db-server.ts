import { createClient } from 'matecitodb'

const DB_URL      = process.env.MATECITODB_URL ?? ''
const ANON_KEY    = process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY ?? ''
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY ?? ''

// Solo instanciar si las variables existen — evita crash en build time
const _publicServerDb = DB_URL && ANON_KEY
  ? createClient(DB_URL, { apiKey: ANON_KEY, apiVersion: 'v2' })
  : null

const _serverDb = DB_URL && (SERVICE_KEY || ANON_KEY)
  ? createClient(DB_URL, { apiKey: SERVICE_KEY || ANON_KEY, apiVersion: 'v2' })
  : null

/**
 * Cliente público para servidor — usa anon key.
 * IDEAL para Login y Register desde Server Actions.
 */
export const publicServerDb = _publicServerDb!

/**
 * Cliente admin — service key, bypassa permisos.
 * SOLO USAR EN SERVER ACTIONS / SERVER COMPONENTS PARA ADMINISTRACIÓN.
 */
export const serverDb = _serverDb!

/**
 * Cliente con permisos de usuario — usa cookies para obtener la sesión.
 * Solo para servidor.
 */
export async function getAuthenticatedDb() {
  if (!DB_URL || !ANON_KEY) throw new Error('[matecitodb] Variables de entorno no configuradas')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('mb_token_pub')?.value ?? ''

  const db = createClient(DB_URL, { apiKey: ANON_KEY, apiVersion: 'v2' })

  if (token) {
    db.auth.setSession({
      access_token:  token,
      refresh_token: '',
      user:          {} as any,
    })
  }

  return db
}
