'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CompanyAutocomplete from '@/components/promotions/CompanyAutocomplete'

interface Company {
  id: string
  name: string
  slug: string
}

function PromotionFormContent() {
  const searchParams = useSearchParams()
  const initialCompanyId = searchParams.get('firma') || undefined

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!selectedCompany) {
      setError('Wybierz firmę z listy')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: selectedCompany.id,
          title,
          description: description || null,
          valid_until: validUntil,
          contact_email: contactEmail,
          contact_phone: contactPhone || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Wystąpił błąd')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError('Wystąpił błąd podczas wysyłania')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dziękujemy!</h1>
            <p className="text-gray-600 mb-6">
              Twoja promocja została wysłana do moderacji. Sprawdzimy ją i opublikujemy w ciągu 24 godzin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/promocje"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Zobacz promocje
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Strona główna
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/promocje"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć do promocji
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Dodaj promocję</h1>
            <p className="text-green-100">
              Poinformuj mieszkańców o aktualnej ofercie Twojej firmy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firma <span className="text-red-500">*</span>
              </label>
              <CompanyAutocomplete
                value={selectedCompany}
                onChange={setSelectedCompany}
                initialCompanyId={initialCompanyId}
              />
              <p className="mt-1 text-sm text-gray-500">
                Wpisz nazwę firmy i wybierz z listy
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tytuł promocji <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
                placeholder="np. Pizza dnia -20%"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                {title.length}/100 znaków
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Opis promocji
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Dodatkowe informacje o promocji (opcjonalnie)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Valid until */}
            <div>
              <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
                Ważne do <span className="text-red-500">*</span>
              </label>
              <input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                min={today}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Contact email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email kontaktowy <span className="text-red-500">*</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                placeholder="twoj@email.pl"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Na ten adres wyślemy potwierdzenie publikacji
              </p>
            </div>

            {/* Contact phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="np. 500 600 700"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-1">Jak to działa?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Wypełnij formularz i wyślij</li>
                <li>2. Zweryfikujemy promocję (do 24h)</li>
                <li>3. Po zatwierdzeniu promocja pojawi się na stronie</li>
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wysyłanie...' : 'Dodaj promocję'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AddPromotionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-500">Ładowanie...</div>
      </div>
    }>
      <PromotionFormContent />
    </Suspense>
  )
}
