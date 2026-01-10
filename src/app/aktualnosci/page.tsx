import { supabase } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktualności',
  description: 'Najnowsze wiadomości z gminy Osielsko i okolic.',
}

async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return (data as Article[]) || []
}

export default async function AktualnosciPage() {
  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aktualności</h1>
          <p className="text-gray-600 mt-2">
            Najnowsze wiadomości z gminy Osielsko i okolic
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Brak artykułów
            </h3>
            <p className="text-gray-500">
              Wkrótce pojawią się tutaj najnowsze wiadomości
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
