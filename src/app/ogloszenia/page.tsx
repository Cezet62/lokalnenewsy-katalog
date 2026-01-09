import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ClassifiedCard from '@/components/ClassifiedCard'
import type { Classified } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ogłoszenia | lokalnenewsy.pl',
  description: 'Lokalne ogłoszenia mieszkańców gminy Osielsko. Sprzedam, kupię, usługi, praca.',
}

interface PageProps {
  searchParams: Promise<{
    kategoria?: string
  }>
}

const categories = [
  { slug: '', label: 'Wszystkie', icon: '📋' },
  { slug: 'sprzedam', label: 'Sprzedam', icon: '🏷️' },
  { slug: 'kupie', label: 'Kupię', icon: '🛒' },
  { slug: 'uslugi', label: 'Usługi', icon: '🔧' },
  { slug: 'praca', label: 'Praca', icon: '💼' },
  { slug: 'oddam', label: 'Oddam', icon: '🎁' },
  { slug: 'inne', label: 'Inne', icon: '📦' },
]

async function getClassifieds(category?: string): Promise<Classified[]> {
  let query = supabase
    .from('classifieds')
    .select('*')
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching classifieds:', error)
    return []
  }

  return (data as Classified[]) || []
}

export default async function OgloszeniaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentCategory = params.kategoria || ''
  const classifieds = await getClassifieds(currentCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ogłoszenia</h1>
              <p className="text-gray-600 mt-2">
                Lokalne ogłoszenia mieszkańców gminy Osielsko
              </p>
            </div>
            <Link
              href="/ogloszenia/dodaj"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj ogłoszenie
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug ? `/ogloszenia?kategoria=${cat.slug}` : '/ogloszenia'}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentCategory === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {classifieds.length === 0
            ? 'Brak ogłoszeń w tej kategorii'
            : classifieds.length === 1
            ? '1 ogłoszenie'
            : `${classifieds.length} ogłoszeń`}
        </p>

        {classifieds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Brak ogłoszeń</h3>
            <p className="mt-2 text-gray-500">Bądź pierwszy - dodaj swoje ogłoszenie!</p>
            <Link
              href="/ogloszenia/dodaj"
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj ogłoszenie
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {classifieds.map((classified) => (
              <ClassifiedCard key={classified.id} classified={classified} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
