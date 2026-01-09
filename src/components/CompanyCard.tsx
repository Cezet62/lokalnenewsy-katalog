import Image from 'next/image'
import Link from 'next/link'
import type { CompanyWithRelations } from '@/types/database'

interface CompanyCardProps {
  company: CompanyWithRelations
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/firma/${company.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={company.image_url}
          alt={company.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {company.is_featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
            Wyróżniona
          </div>
        )}
        {company.is_claimed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Zweryfikowana
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Location */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {company.categories && (
            <span className="flex items-center gap-1">
              {company.categories.icon} {company.categories.name}
            </span>
          )}
          {company.categories && company.locations && (
            <span className="text-gray-300">•</span>
          )}
          {company.locations && <span>{company.locations.name}</span>}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {company.name}
        </h3>

        {/* Address */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          {company.address}
        </p>

        {/* Phone */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {company.phone}
        </div>
      </div>
    </Link>
  )
}
