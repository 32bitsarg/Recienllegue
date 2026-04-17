import type { Metadata, Viewport } from 'next'
import AppNav from '@/components/AppNav'
import GlobalParticles from '@/components/GlobalParticles'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Recienllegue',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#163832',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f8faf8', minHeight: '100dvh', position: 'relative' }}>
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
              background: 'rgba(248,250,248,0.78)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 0 0 1px rgba(22,56,50,0.05), 0 8px 60px rgba(22,56,50,0.06)',
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
