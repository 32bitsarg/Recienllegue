import { ImageResponse } from 'next/og'
import { cities } from '@/data/seo-data'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = cities[citySlug]
  return [{ id: citySlug, alt: city ? `Vivir en ${city.name} como Estudiante` : 'Recién Llegué' }]
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = cities[citySlug]
  const cityName = city?.name ?? 'Pergamino'
  const institution = city?.institution ?? 'UNNOBA'

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
          padding: '80px 96px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 600, height: 600,
          background: 'radial-gradient(circle at 80% 30%, rgba(245,158,11,0.16), transparent 60%)',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(226,232,240,0.1)',
          border: '1px solid rgba(226,232,240,0.18)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
        }}>
          <span style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Guía Estudiantil · {institution} · 2026
          </span>
        </div>

        <div style={{ fontSize: 56, fontWeight: 900, color: '#E2E8F0', lineHeight: 1.05, marginBottom: 12 }}>
          Vivir y estudiar en
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#ffffff', lineHeight: 1.0, marginBottom: 32 }}>
          {cityName}
        </div>

        <div style={{ fontSize: 22, color: 'rgba(226,232,240,0.55)', maxWidth: 580, lineHeight: 1.5 }}>
          Guía completa para estudiantes de la {institution}. Alojamiento, transporte y servicios verificados.
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
          {['Alojamiento', 'Transporte', 'Gastronomía', 'Servicios'].map(label => (
            <div key={label} style={{
              background: 'rgba(245,158,11,0.13)',
              border: '1px solid rgba(245,158,11,0.28)',
              borderRadius: 100, padding: '8px 20px',
              fontSize: 15, fontWeight: 700, color: '#F59E0B',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
