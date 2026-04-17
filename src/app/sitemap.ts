import { MetadataRoute } from 'next'
import { generateSitemap } from '@/data/seo-data'

const BASE_URL = 'https://recienlleguee.com.ar'

export default function sitemap(): MetadataRoute.Sitemap {
  const landingUrls = generateSitemap()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pergamino`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  const generatedPages: MetadataRoute.Sitemap = landingUrls.map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: url.split('/').length === 3 ? 0.7 : 0.5, // base vs barrio/modifier
  }))

  return [...staticPages, ...generatedPages]
}
