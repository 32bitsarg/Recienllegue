import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cities } from '@/data/seo-data'
import CityClient from './CityClient'

const SITE_URL = 'https://recienllegue.com'

export async function generateStaticParams() {
  return Object.keys(cities).map(city => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = cities[citySlug]
  if (!city) return { title: 'No encontrado' }

  const canonical = `${SITE_URL}/${citySlug}`
  const title = `Vivir en ${city.name} como Estudiante | Guía UNNOBA 2026 | Recién Llegué`
  const description = `Guía para estudiantes de la ${city.institution} en ${city.name}. Alojamiento, transporte, gastronomía y servicios útiles con referencias actualizadas para comparar antes de llegar.`

  return {
    title,
    description,
    keywords: `estudiantes ${city.name}, vivir ${city.name}, alojamiento ${city.name}, ${city.institution} ${city.name}, guia estudiante ${city.name} 2026`,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Recién Llegué',
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = cities[citySlug]
  if (!city) notFound()

  return <CityClient citySlug={citySlug} city={city} />
}
