import { createClient } from 'matecitodb'

const DB_URL   = process.env.NEXT_PUBLIC_MATECITODB_URL ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY ?? ''

/**
 * Cliente público — anon key, para datos públicos.
 * Seguro para usar en Client Components ('use client').
 */
export const publicDb = DB_URL && ANON_KEY
  ? createClient(DB_URL, { apiKey: ANON_KEY, apiVersion: 'v2' })
  : null as any

/**
 * Versión ligera para el cliente que recibe el token manualmente.
 * No usa next/headers para evitar errores de compilación en el browser.
 */
export function getUserDb(token: string) {
  if (!DB_URL || !ANON_KEY) throw new Error('[matecitodb] Variables de entorno no configuradas')
  const db = createClient(DB_URL, { apiKey: ANON_KEY, apiVersion: 'v2' })
  if (token) {
    db.auth.setSession({
      access_token: token,
      refresh_token: '',
      user: {} as any
    })
  }
  return db
}
