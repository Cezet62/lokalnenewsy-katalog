import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { PromotionWithCompany } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Promocje lokalnych firm',
  description: 'Aktualne promocje i oferty specjalne firm z gminy Osielsko. Sprawdź najlepsze okazje!',
}

async function getActivePromotions(): Promise<PromotionWithCompany[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('promotions')
    .select(`
      *,
      companies (
        id,
        name,
        slug,
        image_url
      )
    `)
    .eq('status', 'approved')
    .gte('valid_until', today)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching promotions:', error)
    return []
  }

  return (data as PromotionWithCompany[]) || []
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDaysLeft(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const validUntil = new Date(dateString)
  const diffTime = validUntil.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default async function PromotionsPage() {
  const promotions = await getActivePromotions()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promocje lokalnych firm</h1>
            <p className="text-gray-600 mt-1">Aktualne oferty specjalne z Twojej okolicy</p>
          </div>
          <Link
            href="/promocje/dodaj"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj promocję
          </Link>
        </div>

        {/* Promotions grid */}
        {promotions.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => {
              const daysLeft = getDaysLeft(promotion.valid_until)
              const isEndingSoon = daysLeft <= 3

              return (
                <Link
                  key={promotion.id}
                  href={`/firma/${promotion.companies?.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-100">
                    {promotion.image_url ? (
                      <Image
                        src={promotion.image_url}
                        alt={promotion.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : promotion.companies?.image_url ? (
                      <Image
                        src={promotion.companies.image_url}
                        alt={promotion.companies.name}
                        fill
                        className="object-cover opacity-50"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        PROMOCJA
                      </span>
                    </div>

                    {/* Days left badge */}
                    {isEndingSoon && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                          {daysLeft === 0 ? 'Ostatni dzień!' : daysLeft === 1 ? 'Jeszcze 1 dzień' : `Jeszcze ${daysLeft} dni`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Company name */}
                    <p className="text-sm text-gray-500 mb-1">
                      {promotion.companies?.name}
                    </p>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                      {promotion.title}
                    </h2>

                    {/* Description */}
                    {promotion.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {promotion.description}
                      </p>
                    )}

                    {/* Valid until */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ważne do {formatDate(promotion.valid_until)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak aktywnych promocji</h2>
            <p className="text-gray-600 mb-6">
              Obecnie nie ma żadnych promocji. Bądź pierwszy i dodaj promocję swojej firmy!
            </p>
            <Link
              href="/promocje/dodaj"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj pierwszą promocję
            </Link>
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Masz firmę w okolicy?</h2>
            <p className="text-green-100 mb-6">
              Dodaj promocję za darmo i dotrzej do tysięcy mieszkańców gminy.
              Wystarczy 2 minuty!
            </p>
            <Link
              href="/promocje/dodaj"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Dodaj promocję swojej firmy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
