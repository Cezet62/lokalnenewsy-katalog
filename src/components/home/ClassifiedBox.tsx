import Link from 'next/link'
import Image from 'next/image'
import type { Classified } from '@/types/database'
import { BentoSize } from './BentoGrid'

interface ClassifiedBoxProps {
  classified: Classified
  size?: BentoSize
}

const categoryLabels: Record<string, string> = {
  sprzedam: 'Sprzedam',
  kupie: 'Kupię',
  uslugi: 'Usługi',
  praca: 'Praca',
  oddam: 'Oddam',
  inne: 'Inne',
}

const categoryColors: Record<string, string> = {
  sprzedam: 'bg-amber-500',
  kupie: 'bg-teal-500',
  uslugi: 'bg-indigo-500',
  praca: 'bg-rose-500',
  oddam: 'bg-emerald-500',
  inne: 'bg-gray-500',
}

export default function ClassifiedBox({ classified, size = '1x1' }: ClassifiedBoxProps) {
  const isLarge = size === '2x2' || size === '2x1'
  const categoryLabel = categoryLabels[classified.category] || classified.category
  const categoryColor = categoryColors[classified.category] || 'bg-gray-500'

  return (
    <Link
      href={`/ogloszenia/${classified.id}`}
      className="group relative h-full rounded-xl overflow-hidden block"
    >
      {/* Background image */}
      {classified.image_url ? (
        <Image
          src={classified.image_url}
          alt={classified.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={isLarge ? '50vw' : '25vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

      {/* Price - top right */}
      {classified.price && (
        <div className="absolute top-3 right-3">
          <span className="bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded shadow-lg">
            {classified.price} zł
          </span>
        </div>
      )}

      {/* Content - bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-bold text-white ${isLarge ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline`}>
          {classified.title}
        </h3>

        {/* Location */}
        {classified.location && (
          <p className="text-white/80 text-xs mt-2 flex items-center gap-1 truncate">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {classified.location}
          </p>
        )}
      </div>
    </Link>
  )
}
