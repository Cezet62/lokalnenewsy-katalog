import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types/database'
import { BentoSize } from './BentoGrid'

interface NewsBoxProps {
  article: Article
  size?: BentoSize
}

const categoryLabels: Record<string, string> = {
  aktualnosci: 'Aktualności',
  wydarzenia: 'Wydarzenia',
  komunikaty: 'Komunikaty',
  informacje: 'Informacje',
}

const categoryColors: Record<string, string> = {
  aktualnosci: 'bg-blue-500',
  wydarzenia: 'bg-purple-500',
  komunikaty: 'bg-orange-500',
  informacje: 'bg-gray-500',
}

export default function NewsBox({ article, size = '1x1' }: NewsBoxProps) {
  const isLarge = size === '2x2' || size === '2x1'
  const categoryLabel = categoryLabels[article.category] || article.category
  const categoryColor = categoryColors[article.category] || 'bg-gray-500'

  const formattedDate = new Date(article.published_at).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <Link
      href={`/aktualnosci/${article.slug}`}
      className="group relative h-full rounded-xl overflow-hidden block"
    >
      {/* Background image */}
      {article.image_url ? (
        <Image
          src={article.image_url}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={isLarge ? '50vw' : '25vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Category badge - top left */}
      <div className="absolute top-3 left-3">
        <span className={`${categoryColor} text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg`}>
          {categoryLabel}
        </span>
      </div>

      {/* Date - top right */}
      <div className="absolute top-3 right-3">
        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded shadow">
          {formattedDate}
        </span>
      </div>

      {/* Content - bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-bold text-white ${isLarge ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline`}>
          {article.title}
        </h3>
        {isLarge && article.excerpt && (
          <p className="text-white/80 text-sm mt-2 line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
