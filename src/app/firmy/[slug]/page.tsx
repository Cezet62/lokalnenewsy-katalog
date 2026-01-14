import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ClaimForm from '@/components/ClaimForm'
import type { CompanyWithRelations, Promotion } from '@/types/database'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCompany(slug: string): Promise<CompanyWithRelations | null> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      categories (*),
      locations (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as CompanyWithRelations
}

async function getCompanyPromotions(companyId: string): Promise<Promotion[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'approved')
    .gte('valid_until', today)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching company promotions:', error)
    return []
  }

  return (data as Promotion[]) || []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompany(slug)

  if (!company) {
    return { title: 'Firma nie znaleziona' }
  }

  return {
    title: company.name,
    description: company.description || `${company.name} - ${company.address}`,
    openGraph: {
      title: company.name,
      description: company.description || `${company.name} - ${company.address}`,
      images: [{ url: company.image_url }],
    },
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params
  const company = await getCompany(slug)

  if (!company) {
    notFound()
  }

  const promotions = await getCompanyPromotions(company.id)

  const formattedDate = new Date(company.updated_at).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formatPromotionDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/firmy"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć do katalogu
        </Link>

        {/* Main image */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6">
          <Image
            src={company.image_url}
            alt={company.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
          {company.is_featured && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-medium px-3 py-1.5 rounded-full">
              Wyróżniona
            </div>
          )}
          {company.is_claimed && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            {company.categories && (
              <span>
                {company.categories.icon} {company.categories.name}
              </span>
            )}
            {company.categories && company.locations && <span>•</span>}
            {company.locations && <span>{company.locations.name}</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="text-sm text-gray-500">Adres</div>
                <div className="text-gray-900">{company.address}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <div className="text-sm text-gray-500">Telefon</div>
                <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                  {company.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            {company.hours && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Godziny otwarcia</div>
                  <div className="text-gray-900">{company.hours}</div>
                </div>
              </div>
            )}

            {/* Website */}
            {company.website && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Strona www</div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Social & Actions */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Zadzwoń
            </a>

            {company.google_maps_url && (
              <a
                href={company.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Nawiguj
              </a>
            )}

            {company.facebook && (
              <a
                href={company.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Facebook
              </a>
            )}

            {company.instagram && (
              <a
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O firmie</h2>
            <p className="text-gray-600 whitespace-pre-line">{company.description}</p>
          </div>
        )}

        {/* Active promotions */}
        {promotions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Aktualne promocje</h2>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {promotions.length} {promotions.length === 1 ? 'promocja' : promotions.length < 5 ? 'promocje' : 'promocji'}
              </span>
            </div>
            <div className="space-y-3">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="bg-green-500 rounded-full p-1.5 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{promotion.title}</h3>
                    {promotion.description && (
                      <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Ważne do {formatPromotionDate(promotion.valid_until)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add promotion CTA */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Masz promocję do ogłoszenia?
              </h3>
              <p className="text-gray-600 mb-4">
                Dodaj promocję tej firmy i dotrzej do mieszkańców gminy.
              </p>
              <Link
                href={`/promocje/dodaj?firma=${company.id}`}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj promocję
              </Link>
            </div>
          </div>
        </div>

        {/* Claim section */}
        {!company.is_claimed && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  To Twoja firma?
                </h3>
                <p className="text-gray-600 mb-4">
                  Przejmij wizytówkę, aby zarządzać informacjami o swojej firmie
                  i wyróżnić się w katalogu.
                </p>
                <ClaimForm companyId={company.id} companyName={company.name} />
              </div>
            </div>
          </div>
        )}

        {/* Last update */}
        <div className="text-center text-sm text-gray-500">
          Ostatnia aktualizacja: {formattedDate}
        </div>
      </div>
    </div>
  )
}
