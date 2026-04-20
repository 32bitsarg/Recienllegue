import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Recién Llegué — Tu guía para instalarte en Pergamino'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
        {/* Amber glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 600, height: 600,
          background: 'radial-gradient(circle at 80% 30%, rgba(245,158,11,0.18), transparent 60%)',
        }} />

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(226,232,240,0.1)',
          border: '1px solid rgba(226,232,240,0.18)',
          borderRadius: 100,
          padding: '6px 16px',
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Recién Llegué · Pergamino 2026
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 64, fontWeight: 900, color: '#E2E8F0', lineHeight: 1.05, marginBottom: 20 }}>
          Tu guía para
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 32 }}>
          instalarte en Pergamino.
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: 'rgba(226,232,240,0.6)', maxWidth: 600, lineHeight: 1.5 }}>
          Alojamiento, transporte, comercios y comunidad para estudiantes de la UNNOBA.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
          {['Hospedajes', 'Transporte', 'Comercios', 'Comunidad'].map(label => (
            <div key={label} style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 100,
              padding: '8px 20px',
              fontSize: 15,
              fontWeight: 700,
              color: '#F59E0B',
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
