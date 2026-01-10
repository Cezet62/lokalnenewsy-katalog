import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WeatherWidget from '@/components/WeatherWidget'
import ArticleCard from '@/components/ArticleCard'
import CompanyCard from '@/components/CompanyCard'
import NewsletterForm from '@/components/NewsletterForm'
import { siteConfig } from '@/lib/config'
import type { Article, CompanyWithRelations } from '@/types/database'

async function getFeaturedArticle(): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching featured article:', error)
    return null
  }

  return data as Article
}

async function getLatestArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', false)
    .order('published_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return (data as Article[]) || []
}

async function getFeaturedCompanies(): Promise<CompanyWithRelations[]> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      categories (*),
      locations (*)
    `)
    .eq('is_featured', true)
    .limit(3)

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return (data as CompanyWithRelations[]) || []
}

export default async function HomePage() {
  const [featuredArticle, latestArticles, featuredCompanies] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(),
    getFeaturedCompanies(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              {featuredArticle ? (
                <ArticleCard article={featuredArticle} featured />
              ) : (
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <p className="text-gray-500">Brak wyróżnionego artykułu</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather */}
              <WeatherWidget />

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Szybkie linki</h3>
                <div className="space-y-2">
                  <a
                    href="https://www.bip.osielsko.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <span>🏛️</span> Urząd Gminy Osielsko
                  </a>
                  <a
                    href="tel:112"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <span>🚨</span> Telefon alarmowy: 112
                  </a>
                  <Link
                    href="/firmy"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <span>🏢</span> Katalog firm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Najnowsze aktualności</h2>
            <Link
              href="/aktualnosci"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Zobacz wszystkie →
            </Link>
          </div>

          {latestArticles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Brak artykułów do wyświetlenia</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Polecane firmy</h2>
            <Link
              href="/firmy"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Zobacz katalog →
            </Link>
          </div>

          {featuredCompanies.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Brak wyróżnionych firm</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12">
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
      <section className="py-12 bg-white border-t border-gray-200">
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
