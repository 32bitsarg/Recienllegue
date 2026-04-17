import { serverDb } from './db-server'

export type FeaturedBusiness = {
  id: string
  name: string
  tagline: string
  address?: string
  phone?: string
  website?: string
  city_slug: string
  service_slug: string
}

/**
 * Devuelve el comercio destacado para una landing específica, o null si no hay ninguno activo.
 * Se usa server-side en los page.tsx para pasar el dato al Client Component.
 */
export async function getFeaturedBusiness(
  citySlug: string,
  serviceSlug: string
): Promise<FeaturedBusiness | null> {
  if (!serverDb) return null
  try {
    const { data } = await serverDb
      .from('featured_businesses')
      .eq('city_slug', citySlug)
      .eq('service_slug', serviceSlug)
      .eq('status', 'active')
      .limit(1)
      .get()
    return (data?.[0] as FeaturedBusiness) ?? null
  } catch {
    return null
  }
}
