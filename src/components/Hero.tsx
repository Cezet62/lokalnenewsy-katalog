'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?szukaj=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Katalog firm gminy{' '}
          <span className="text-blue-600">Osielsko</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Znajdź sprawdzone lokalne usługi i firmy w Twojej okolicy
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj firmy, usługi..."
              className="w-full px-5 py-4 pl-12 text-gray-900 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Szukaj
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 text-sm text-gray-500">
          <div>
            <span className="font-semibold text-gray-900">35+</span> firm
          </div>
          <div>
            <span className="font-semibold text-gray-900">7</span> kategorii
          </div>
          <div>
            <span className="font-semibold text-gray-900">6</span> miejscowości
          </div>
        </div>
      </div>
    </section>
  )
}
