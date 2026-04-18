import { createClient } from 'matecitodb'

const DB_URL   = process.env.NEXT_PUBLIC_MATECITODB_URL ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY ?? ''

/**
 * Cliente público — anon key, para datos públicos.
 * Seguro para usar en Client Components ('use client').
 */
if (!DB_URL || !ANON_KEY) {
  console.error('[matecitodb] NEXT_PUBLIC_MATECITODB_URL o NEXT_PUBLIC_MATECITODB_ANON_KEY no están configuradas.')
}

export const publicDb = createClient(DB_URL || 'http://localhost', { apiKey: ANON_KEY || 'missing', apiVersion: 'v2' })

/**
 * Cliente admin — service key, solo para server-side (actions, route handlers).
 * NUNCA importar en 'use client'.
 */
export function getAdminDb() {
  const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY ?? ''
  if (!DB_URL || !SERVICE_KEY) throw new Error('[matecitodb] SERVICE_KEY no configurada')
  return createClient(DB_URL, { apiKey: SERVICE_KEY, apiVersion: 'v2' })
}

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
