import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WeatherWidget from '@/components/WeatherWidget'
import NewsletterForm from '@/components/NewsletterForm'
import { siteConfig } from '@/lib/config'
import {
  PromotionBox,
  NewsBox,
  EventBox,
  ClassifiedBox,
  PlaceholderBox,
  QuickLinks,
} from '@/components/home'
import { generateBentoContent, type BentoContent } from '@/lib/utils/shuffleContent'
import type { Article, Event, Classified, PromotionWithCompany } from '@/types/database'

// Force dynamic rendering - content changes frequently
export const dynamic = 'force-dynamic'

async function getPromotions(): Promise<PromotionWithCompany[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('promotions')
    .select(`
      *,
      companies (
        id,
        name,
        slug,
        image_url
      )
    `)
    .eq('status', 'approved')
    .gte('valid_until', today)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching promotions:', error)
    return []
  }

  return (data as PromotionWithCompany[]) || []
}

async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return (data as Article[]) || []
}

async function getEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return (data as Event[]) || []
}

async function getClassifieds(): Promise<Classified[]> {
  const { data, error } = await supabase
    .from('classifieds')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching classifieds:', error)
    return []
  }

  return (data as Classified[]) || []
}

// Render a single slot based on content type
function renderSlot(item: BentoContent | undefined, size: '1x1' | '2x2' = '1x1') {
  if (!item) {
    return <PlaceholderBox type="promotion" size={size} />
  }

  switch (item.type) {
    case 'promotion':
      return <PromotionBox promotion={item.data as PromotionWithCompany} size={size} />
    case 'news':
      return <NewsBox article={item.data as Article} size={size} />
    case 'event':
      return <EventBox event={item.data as Event} size={size} />
    case 'classified':
      return <ClassifiedBox classified={item.data as Classified} size={size} />
    case 'placeholder':
      const placeholderData = item.data as { placeholderType: 'promotion' | 'classified' | 'event' }
      return <PlaceholderBox type={placeholderData.placeholderType} size={size} />
    default:
      return <PlaceholderBox type="promotion" size={size} />
  }
}

export default async function HomePage() {
  const [promotions, articles, events, classifieds] = await Promise.all([
    getPromotions(),
    getArticles(),
    getEvents(),
    getClassifieds(),
  ])

  const bentoContent = generateBentoContent({
    promotions,
    articles,
    events,
    classifieds,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bento Grid Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Co słychać w gminie?
              </h1>
              <p className="text-gray-600 mt-1">
                Promocje, aktualności, wydarzenia i ogłoszenia z Twojej okolicy
              </p>
            </div>
          </div>

          {/* Main Bento Grid - Fixed Template 4 cols x 3 rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
            {/* Row 1-2: Featured (2x2) + 2 slots + Weather */}
            {/* Slot 0: Featured - spans 2 cols, 2 rows */}
            <div className="col-span-2 row-span-2">
              {bentoContent[0] ? (
                bentoContent[0].type === 'news' ? (
                  <NewsBox article={bentoContent[0].data as Article} size="2x2" />
                ) : bentoContent[0].type === 'promotion' ? (
                  <PromotionBox promotion={bentoContent[0].data as PromotionWithCompany} size="2x2" />
                ) : (
                  <PlaceholderBox type="promotion" size="2x2" />
                )
              ) : (
                <PlaceholderBox type="promotion" size="2x2" />
              )}
            </div>

            {/* Slot 1: Content */}
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[1])}
            </div>

            {/* Weather Widget - top right */}
            <div className="col-span-1 row-span-1">
              <WeatherWidget />
            </div>

            {/* Slot 2: Content */}
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[2])}
            </div>

            {/* Quick Links */}
            <div className="col-span-1 row-span-1">
              <QuickLinks />
            </div>

            {/* Row 3: 4 regular slots */}
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[3])}
            </div>
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[4])}
            </div>
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[5])}
            </div>
            <div className="col-span-1 row-span-1">
              {renderSlot(bentoContent[6])}
            </div>
          </div>

          {/* View all links */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              href="/promocje"
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
            >
              Wszystkie promocje
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/aktualnosci"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              Wszystkie aktualności
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/wydarzenia"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              Wszystkie wydarzenia
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/ogloszenia"
              className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
            >
              Wszystkie ogłoszenia
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bądź na bieżąco z tym, co dzieje się w gminie
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Zapisz się na nasz tygodniowy newsletter i otrzymuj najważniejsze informacje
              prosto na swoją skrzynkę email.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">O portalu</h3>
              <p className="text-sm text-gray-600">
                {siteConfig.brand} to portal informacyjny gminy {siteConfig.region}. Dostarczamy najświeższe
                wiadomości, informacje o wydarzeniach i katalog lokalnych firm.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Kontakt</h3>
              <p className="text-sm text-gray-600">
                Masz newsa lub chcesz dodać swoją firmę?<br />
                Napisz do nas: <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:underline">{siteConfig.email}</a>
              </p>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Obserwuj nas</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
