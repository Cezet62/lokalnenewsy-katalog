import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Classified } from '@/types/database'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
  sprzedam: { label: 'Sprzedam', color: 'text-green-700', bg: 'bg-green-100' },
  kupie: { label: 'Kupię', color: 'text-blue-700', bg: 'bg-blue-100' },
  uslugi: { label: 'Usługi', color: 'text-purple-700', bg: 'bg-purple-100' },
  praca: { label: 'Praca', color: 'text-orange-700', bg: 'bg-orange-100' },
  oddam: { label: 'Oddam', color: 'text-teal-700', bg: 'bg-teal-100' },
  inne: { label: 'Inne', color: 'text-gray-700', bg: 'bg-gray-100' },
}

async function getClassified(id: string): Promise<Classified | null> {
  const { data, error } = await supabase
    .from('classifieds')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return null
  }

  return data as Classified
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const classified = await getClassified(id)

  if (!classified) {
    return { title: 'Ogłoszenie nie znalezione' }
  }

  return {
    title: `${classified.title} | lokalnenewsy.pl`,
    description: classified.description.slice(0, 160),
  }
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ClassifiedPage({ params }: PageProps) {
  const { id } = await params
  const classified = await getClassified(id)

  if (!classified) {
    notFound()
  }

  const category = categoryLabels[classified.category] || categoryLabels.inne
  const expiresAt = new Date(classified.expires_at)
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/ogloszenia"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć do ogłoszeń
        </Link>

        {/* Main content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Image */}
          {classified.image_url && (
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={classified.image_url}
                alt={classified.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${category.bg} ${category.color}`}>
                {category.label}
              </span>
              {classified.is_featured && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                  Wyróżnione
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{classified.title}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              {formatPrice(classified.price, classified.price_type)}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {classified.location}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Dodano: {formatDate(classified.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {classified.views} wyświetleń
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Opis</h2>
              <div className="text-gray-700 whitespace-pre-line">{classified.description}</div>
            </div>

            {/* Expiry warning */}
            {isExpiringSoon && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  To ogłoszenie wygasa {formatDate(classified.expires_at)}
                </p>
              </div>
            )}

            {/* Contact */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-medium">{classified.contact_name}</span>
                </div>

                {classified.contact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <a href={`tel:${classified.contact_phone}`} className="text-blue-600 hover:underline font-medium">
                      {classified.contact_phone}
                    </a>
                  </div>
                )}

                {classified.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <a href={`mailto:${classified.contact_email}`} className="text-blue-600 hover:underline">
                      {classified.contact_email}
                    </a>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {classified.contact_phone && (
                  <a
                    href={`tel:${classified.contact_phone}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Zadzwoń
                  </a>
                )}
                {classified.contact_email && (
                  <a
                    href={`mailto:${classified.contact_email}?subject=Ogłoszenie: ${classified.title}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Napisz email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Coś nie tak z tym ogłoszeniem?{' '}
          <a href="mailto:kontakt@lokalnenewsy.pl" className="text-blue-600 hover:underline">
            Zgłoś problem
          </a>
        </p>
      </div>
    </div>
  )
}
