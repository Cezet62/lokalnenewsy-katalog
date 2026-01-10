import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://lokalnenewsy.pl'

type SitemapItem = { slug: string; updated_at: string }
type SitemapItemWithId = { id: string; updated_at: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/aktualnosci`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/wydarzenia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/firmy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ogloszenia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ogloszenia/dodaj`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/info`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic pages - Articles
  const { data: articlesData } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('is_published', true)

  const articles = (articlesData || []) as SitemapItem[]
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/aktualnosci/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic pages - Events
  const { data: eventsData } = await supabase
    .from('events')
    .select('slug, updated_at')
    .eq('is_published', true)

  const events = (eventsData || []) as SitemapItem[]
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/wydarzenia/${event.slug}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic pages - Companies
  const { data: companiesData } = await supabase
    .from('companies')
    .select('slug, updated_at')

  const companies = (companiesData || []) as SitemapItem[]
  const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${BASE_URL}/firmy/${company.slug}`,
    lastModified: new Date(company.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic pages - Classifieds (only active)
  const { data: classifiedsData } = await supabase
    .from('classifieds')
    .select('id, updated_at')
    .eq('status', 'active')

  const classifieds = (classifiedsData || []) as SitemapItemWithId[]
  const classifiedPages: MetadataRoute.Sitemap = classifieds.map((ad) => ({
    url: `${BASE_URL}/ogloszenia/${ad.id}`,
    lastModified: new Date(ad.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...articlePages,
    ...eventPages,
    ...companyPages,
    ...classifiedPages,
  ]
}
