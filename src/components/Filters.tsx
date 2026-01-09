'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category, Location } from '@/types/database'

interface FiltersProps {
  categories: Category[]
  locations: Location[]
}

export default function Filters({ categories, locations }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('kategoria') || ''
  const currentLocation = searchParams.get('miejscowosc') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Kategorie */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Kategoria
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('kategoria', '')}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  !currentCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Wszystkie
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilter('kategoria', category.slug)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    currentCategory === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Miejscowości */}
          <div className="sm:w-48">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Miejscowość
            </label>
            <select
              value={currentLocation}
              onChange={(e) => updateFilter('miejscowosc', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Wszystkie</option>
              {locations.map((location) => (
                <option key={location.id} value={location.slug}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
