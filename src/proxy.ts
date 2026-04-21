import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * CONFIGURACIÓN DE RUTAS
 * Edita estas listas según la estructura de tu aplicación.
 */
const PROTECTED_ROUTES = ['/app/muro', '/app/perfil', '/app/adm', '/dashboard', '/crear']
const AUTH_ROUTES = ['/login', '/registro']

const API_URL = process.env.NEXT_PUBLIC_MATECITODB_URL || 'http://localhost:3001'

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https: http:",
  `connect-src 'self' ${API_URL} https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://region1.analytics.google.com https://www.googletagmanager.com https://tagmanager.google.com`,
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net",
  "worker-src 'self' blob:",
].join("; ")

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('mb_token')?.value
  const user = request.cookies.get('mb_user')?.value
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && token && user) {
    return NextResponse.redirect(new URL('/app/inicio', request.url))
  }

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', CSP)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export const config = {
  // Ajusta este matcher según las rutas que definas arriba
  matcher: ['/app/muro/:path*', '/app/muro', '/app/perfil/:path*', '/app/perfil', '/app/adm/:path*', '/app/adm', '/dashboard/:path*', '/crear/:path*', '/login', '/registro']
}
