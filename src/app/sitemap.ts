import { MetadataRoute } from 'next'
import { generateBaseSitemap } from '@/data/seo-data'

const BASE_URL = 'https://recienllegue.com'
const SEO_LAST_MODIFIED = new Date('2026-04-21T00:00:00-03:00')

export default function sitemap(): MetadataRoute.Sitemap {
  const landingUrls = generateBaseSitemap()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: SEO_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pergamino`, lastModified: SEO_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const generatedPages: MetadataRoute.Sitemap = landingUrls.map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: SEO_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...generatedPages]
}
