import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cities } from '@/data/seo-data'
import { getFeaturedBusiness } from '@/lib/featured'
import LandingClient from './LandingClient'

const SITE_URL = 'https://recienlleguee.com.ar'

export async function generateStaticParams() {
  return Object.entries(cities).flatMap(([citySlug, city]) =>
    Object.keys(city.services).map(slug => ({ city: citySlug, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}): Promise<Metadata> {
  const { city: citySlug, slug: serviceSlug } = await params
  const city = cities[citySlug]
  const service = city?.services[serviceSlug]
  if (!city || !service) return { title: 'No encontrado' }

  const canonical = `${SITE_URL}/${citySlug}/${serviceSlug}`
  const description = `${service.metaDescription} → Registrate gratis en Recién Llegué.`

  return {
    title: service.metaTitle,
    description,
    keywords: service.keywords.join(', '),
    alternates: { canonical },
    openGraph: {
      title: service.metaTitle,
      description,
      url: canonical,
      siteName: 'Recién Llegué',
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description,
    },
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug: serviceSlug } = await params
  const city = cities[citySlug]
  const service = city?.services[serviceSlug]
  if (!city || !service) notFound()

  const featuredBusiness = await getFeaturedBusiness(citySlug, serviceSlug)

  return (
    <LandingClient
      citySlug={citySlug}
      serviceSlug={serviceSlug}
      city={city}
      service={service}
      featuredBusiness={featuredBusiness}
    />
  )
}
