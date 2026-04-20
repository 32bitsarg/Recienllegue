import type { Metadata, Viewport } from 'next'
import AppNav from '@/components/AppNav'
import GlobalParticles from '@/components/GlobalParticles'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Recienllegue',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#F1F5F9', minHeight: '100dvh', position: 'relative' }}>
      {/* Partículas flotantes — fondo global, detrás de todo el contenido */}
      <GlobalParticles />

      {/* Contenido por encima del canvas (z-index: 0) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppNav />
        <main className="pb-16 lg:pb-0 relative">
          {/* Frosted glass column — el bg de partículas se ve a través */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none"
            style={{
              background: 'rgba(241,245,249,0.78)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 0 0 1px rgba(15,23,42,0.05), 0 8px 60px rgba(15,23,42,0.06)',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
