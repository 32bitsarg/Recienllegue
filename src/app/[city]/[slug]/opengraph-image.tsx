import { ImageResponse } from 'next/og'
import { cities } from '@/data/seo-data'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug } = await params
  const city = cities[citySlug]
  const service = city?.services[slug]
  return [{ id: slug, alt: service?.metaTitle ?? 'Recién Llegué' }]
}

const CATEGORY_EMOJI: Record<string, string> = {
  alojamiento: '🏠',
  transporte: '🚌',
  gastronomia: '🍽️',
  salud: '🏥',
  servicios: '🔧',
  educacion: '📚',
  comercio: '🛍️',
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug } = await params
  const city = cities[citySlug]
  const service = city?.services[slug]

  const title = service?.h1 ?? 'Recién Llegué'
  const description = service?.metaDescription ?? 'Guía para estudiantes universitarios en Argentina.'
  const emoji = CATEGORY_EMOJI[service?.category ?? ''] ?? '📍'
  const cityName = city?.name ?? 'Pergamino'

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 96px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 500, height: 500,
          background: 'radial-gradient(circle at 85% 25%, rgba(245,158,11,0.14), transparent 55%)',
        }} />

        {/* City badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(226,232,240,0.1)',
          border: '1px solid rgba(226,232,240,0.16)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 28,
        }}>
          <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            {cityName} · Recién Llegué 2026
          </span>
        </div>

        {/* Emoji icon */}
        <div style={{
          fontSize: 52, marginBottom: 20,
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 20, padding: '12px 20px',
          display: 'flex', alignItems: 'center',
        }}>
          {emoji}
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 45 ? 44 : 52,
          fontWeight: 900, color: '#ffffff',
          lineHeight: 1.1, marginBottom: 24, maxWidth: 800,
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 19, color: 'rgba(226,232,240,0.5)',
          maxWidth: 680, lineHeight: 1.5,
        }}>
          {description.length > 120 ? description.slice(0, 120) + '…' : description}
        </div>

        {/* Bottom CTA pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 44,
          background: '#F59E0B', borderRadius: 100, padding: '12px 28px',
        }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
            Registrate gratis en Recién Llegué →
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
