'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'

const categories = [
  { value: 'sprzedam', label: 'Sprzedam', icon: '🏷️' },
  { value: 'kupie', label: 'Kupię', icon: '🛒' },
  { value: 'uslugi', label: 'Usługi', icon: '🔧' },
  { value: 'praca', label: 'Praca', icon: '💼' },
  { value: 'oddam', label: 'Oddam za darmo', icon: '🎁' },
  { value: 'inne', label: 'Inne', icon: '📦' },
]

const priceTypes = [
  { value: 'fixed', label: 'Cena stała' },
  { value: 'negotiable', label: 'Do negocjacji' },
  { value: 'per_hour', label: 'Za godzinę' },
  { value: 'free', label: 'Za darmo' },
]

export default function DodajOgloszenie() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'sprzedam',
    price: '',
    price_type: 'fixed',
    location: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    image_url: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Validation
    if (!formData.title.trim()) {
      setError('Tytuł jest wymagany')
      setSubmitting(false)
      return
    }
    if (!formData.description.trim()) {
      setError('Opis jest wymagany')
      setSubmitting(false)
      return
    }
    if (!formData.location.trim()) {
      setError('Lokalizacja jest wymagana')
      setSubmitting(false)
      return
    }
    if (!formData.contact_name.trim()) {
      setError('Imię jest wymagane')
      setSubmitting(false)
      return
    }
    if (!formData.contact_phone.trim() && !formData.contact_email.trim()) {
      setError('Podaj telefon lub email')
      setSubmitting(false)
      return
    }

    const classifiedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: formData.price_type === 'free' ? 0 : (formData.price ? parseFloat(formData.price) : null),
      price_type: formData.price_type,
      location: formData.location.trim(),
      contact_name: formData.contact_name.trim(),
      contact_phone: formData.contact_phone.trim() || null,
      contact_email: formData.contact_email.trim() || null,
      image_url: formData.image_url.trim() || null,
      status: 'pending',
    }

    const { error: insertError } = await supabaseBrowser
      .from('classifieds')
      .insert(classifiedData as never)

    setSubmitting(false)

    if (insertError) {
      setError('Błąd dodawania ogłoszenia. Spróbuj ponownie.')
      console.error(insertError)
      return
    }

    setSuccess(true)
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ogłoszenie wysłane!</h1>
            <p className="text-gray-600 mb-6">
              Twoje ogłoszenie zostało przesłane do moderacji.
              Po akceptacji pojawi się na stronie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ogloszenia"
                className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Zobacz ogłoszenia
              </Link>
              <button
                onClick={() => {
                  setSuccess(false)
                  setFormData({
                    title: '',
                    description: '',
                    category: 'sprzedam',
                    price: '',
                    price_type: 'fixed',
                    location: '',
                    contact_name: '',
                    contact_phone: '',
                    contact_email: '',
                    image_url: '',
                  })
                }}
                className="inline-flex items-center justify-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Dodaj kolejne
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dodaj ogłoszenie</h1>
          <p className="text-gray-600 mb-6">
            Wypełnij formularz. Ogłoszenie pojawi się po akceptacji przez moderatora.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kategoria *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.category === cat.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="block text-sm font-medium mt-1">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tytuł ogłoszenia *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Rower górski 26 cali - stan bardzo dobry"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Opis *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Opisz szczegółowo co oferujesz lub czego szukasz..."
              />
            </div>

            {/* Price */}
            {formData.category !== 'oddam' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Cena (zł)
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    disabled={formData.price_type === 'free'}
                  />
                </div>
                <div>
                  <label htmlFor="price_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Typ ceny
                  </label>
                  <select
                    id="price_type"
                    value={formData.price_type}
                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Lokalizacja *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Osielsko, Niemcz, Żołędowo"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Link do zdjęcia (opcjonalnie)
              </label>
              <input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Możesz wkleić link do zdjęcia z Imgur, Google Photos lub innego serwisu
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dane kontaktowe</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Imię *
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Twoje imię"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 456 789"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Podaj przynajmniej jeden sposób kontaktu (telefon lub email)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Wysyłanie...' : 'Dodaj ogłoszenie'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Dodając ogłoszenie akceptujesz regulamin serwisu
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
