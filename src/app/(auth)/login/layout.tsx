import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión | Recién Llegué',
  description: 'Ingresá a tu cuenta de Recién Llegué.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
