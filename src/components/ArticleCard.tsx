import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/types/database'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

const categoryLabels: Record<string, string> = {
  aktualnosci: 'Aktualności',
  wydarzenia: 'Wydarzenia',
  komunikaty: 'Komunikaty',
  informacje: 'Informacje',
}

const categoryColors: Record<string, string> = {
  aktualnosci: 'bg-blue-100 text-blue-700',
  wydarzenia: 'bg-purple-100 text-purple-700',
  komunikaty: 'bg-orange-100 text-orange-700',
  informacje: 'bg-green-100 text-green-700',
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (featured) {
    return (
      <Link
        href={`/aktualnosci/${article.slug}`}
        className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-video md:aspect-auto md:h-full bg-gray-100">
            {article.image_url ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-4xl">📰</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="text-xs text-gray-500">{publishedDate}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
              {article.title}
            </h2>
            <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
            <div className="mt-4 text-blue-600 font-medium text-sm group-hover:underline">
              Czytaj dalej →
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/aktualnosci/${article.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-3xl">📰</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
            {categoryLabels[article.category] || article.category}
          </span>
          <span className="text-xs text-gray-500">{publishedDate}</span>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  )
}
