import Link from 'next/link'
import Image from 'next/image'
import type { PromotionWithCompany } from '@/types/database'
import { BentoSize } from './BentoGrid'

interface PromotionBoxProps {
  promotion: PromotionWithCompany
  size?: BentoSize
}

function getDaysLeft(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const validUntil = new Date(dateString)
  const diffTime = validUntil.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function PromotionBox({ promotion, size = '1x1' }: PromotionBoxProps) {
  const daysLeft = getDaysLeft(promotion.valid_until)
  const isEndingSoon = daysLeft <= 3
  const isLarge = size === '2x2' || size === '2x1'

  const imageUrl = promotion.image_url || promotion.companies?.image_url

  return (
    <Link
      href={`/firmy/${promotion.companies?.slug}`}
      className="group relative h-full rounded-xl overflow-hidden block"
    >
      {/* Background image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={promotion.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={isLarge ? '50vw' : '25vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Badge - top left */}
      <div className="absolute top-3 left-3">
        <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          PROMOCJA
        </span>
      </div>

      {/* Days left badge - top right */}
      {isEndingSoon && (
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            {daysLeft === 0 ? 'Ostatni dzień!' : `${daysLeft} dni`}
          </span>
        </div>
      )}

      {/* Content - bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white/80 text-xs truncate mb-1">
          {promotion.companies?.name}
        </p>
        <h3 className={`font-bold text-white ${isLarge ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline`}>
          {promotion.title}
        </h3>
        {isLarge && promotion.description && (
          <p className="text-white/80 text-sm mt-2 line-clamp-2">
            {promotion.description}
          </p>
        )}
      </div>
    </Link>
  )
}
