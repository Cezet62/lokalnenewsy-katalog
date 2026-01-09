import Image from 'next/image'
import Link from 'next/link'
import type { Classified } from '@/types/database'

interface ClassifiedCardProps {
  classified: Classified
}

const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
  sprzedam: { label: 'Sprzedam', color: 'text-green-700', bg: 'bg-green-100' },
  kupie: { label: 'Kupię', color: 'text-blue-700', bg: 'bg-blue-100' },
  uslugi: { label: 'Usługi', color: 'text-purple-700', bg: 'bg-purple-100' },
  praca: { label: 'Praca', color: 'text-orange-700', bg: 'bg-orange-100' },
  oddam: { label: 'Oddam', color: 'text-teal-700', bg: 'bg-teal-100' },
  inne: { label: 'Inne', color: 'text-gray-700', bg: 'bg-gray-100' },
}

function formatPrice(price: number | null, priceType: string): string {
  if (priceType === 'free') return 'Za darmo'
  if (!price) return 'Do negocjacji'

  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
  }).format(price)

  if (priceType === 'per_hour') return `${formatted}/godz.`
  if (priceType === 'negotiable') return `${formatted} (do negocjacji)`
  return formatted
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'dzisiaj'
  if (diffDays === 1) return 'wczoraj'
  if (diffDays < 7) return `${diffDays} dni temu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`
  return date.toLocaleDateString('pl-PL')
}

export default function ClassifiedCard({ classified }: ClassifiedCardProps) {
  const category = categoryLabels[classified.category] || categoryLabels.inne

  return (
    <Link
      href={`/ogloszenia/${classified.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col sm:flex-row"
    >
      {/* Image */}
      {classified.image_url ? (
        <div className="relative sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-gray-100">
          <Image
            src={classified.image_url}
            alt={classified.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>
      ) : (
        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${category.bg} ${category.color}`}>
            {category.label}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(classified.created_at)}</span>
        </div>

        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {classified.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
          {classified.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {classified.location}
          </div>
          <span className="font-bold text-gray-900">
            {formatPrice(classified.price, classified.price_type)}
          </span>
        </div>
      </div>
    </Link>
  )
}
