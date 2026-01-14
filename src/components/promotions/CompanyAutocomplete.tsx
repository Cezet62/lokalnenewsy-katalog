'use client'

import { useState, useEffect, useRef } from 'react'

interface Company {
  id: string
  name: string
  slug: string
}

interface CompanyAutocompleteProps {
  value: Company | null
  onChange: (company: Company | null) => void
  initialCompanyId?: string
}

export default function CompanyAutocomplete({ value, onChange, initialCompanyId }: CompanyAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Company[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Load initial company if initialCompanyId is provided
  useEffect(() => {
    if (initialCompanyId && !value) {
      const fetchCompany = async () => {
        try {
          const res = await fetch(`/api/promotions?search=${initialCompanyId}`)
          const data = await res.json()
          if (data.companies && data.companies.length > 0) {
            const company = data.companies.find((c: Company) => c.id === initialCompanyId)
            if (company) {
              onChange(company)
              setQuery(company.name)
            }
          }
        } catch (error) {
          console.error('Error fetching initial company:', error)
        }
      }
      fetchCompany()
    }
  }, [initialCompanyId, value, onChange])

  // Search companies when query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchCompanies = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/promotions?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.companies || [])
      } catch (error) {
        console.error('Error searching companies:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchCompanies, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (company: Company) => {
    onChange(company)
    setQuery(company.name)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
    if (value && e.target.value !== value.name) {
      onChange(null)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Wpisz nazwę firmy..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Selected indicator */}
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-sm">Szukam...</div>
          ) : results.length > 0 ? (
            results.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelect(company)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium text-gray-900">{company.name}</span>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="px-4 py-3 text-gray-500 text-sm">
              Nie znaleziono firmy o nazwie &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
