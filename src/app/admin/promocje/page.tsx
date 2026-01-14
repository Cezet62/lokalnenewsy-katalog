'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Promotion {
  id: string
  company_id: string
  title: string
  description: string | null
  image_url: string | null
  valid_until: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  contact_email: string
  contact_phone: string | null
  created_at: string
  companies: {
    id: string
    name: string
    slug: string
    is_claimed: boolean
  } | null
}

type TabType = 'pending' | 'approved' | 'rejected' | 'expired'

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPromotions = async () => {
    setLoading(true)

    let query = supabaseBrowser
      .from('promotions')
      .select(`
        *,
        companies (
          id,
          name,
          slug,
          is_claimed
        )
      `)
      .order('created_at', { ascending: false })

    if (activeTab === 'expired') {
      const today = new Date().toISOString().split('T')[0]
      query = query.lt('valid_until', today)
    } else {
      query = query.eq('status', activeTab)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching promotions:', error)
    } else {
      setPromotions((data as Promotion[]) || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchPromotions()
  }, [activeTab])

  const handleApprove = async (promotion: Promotion) => {
    setActionLoading(promotion.id)

    // 1. Update promotion status to approved
    const { error: promotionError } = await supabaseBrowser
      .from('promotions')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', promotion.id)

    if (promotionError) {
      console.error('Error approving promotion:', promotionError)
      alert('Wystąpił błąd podczas zatwierdzania')
      setActionLoading(null)
      return
    }

    // 2. Auto-claim the company if not already claimed
    if (promotion.companies && !promotion.companies.is_claimed) {
      const { error: companyError } = await supabaseBrowser
        .from('companies')
        .update({
          is_claimed: true,
          owner_email: promotion.contact_email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', promotion.company_id)

      if (companyError) {
        console.error('Error claiming company:', companyError)
        // Don't fail - promotion is already approved
      }
    }

    setActionLoading(null)
    fetchPromotions()
  }

  const handleReject = async (promotion: Promotion) => {
    setActionLoading(promotion.id)

    const { error } = await supabaseBrowser
      .from('promotions')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', promotion.id)

    if (error) {
      console.error('Error rejecting promotion:', error)
      alert('Wystąpił błąd podczas odrzucania')
    }

    setActionLoading(null)
    fetchPromotions()
  }

  const handleDelete = async (promotion: Promotion) => {
    if (!confirm('Czy na pewno chcesz usunąć tę promocję?')) return

    setActionLoading(promotion.id)

    const { error } = await supabaseBrowser
      .from('promotions')
      .delete()
      .eq('id', promotion.id)

    if (error) {
      console.error('Error deleting promotion:', error)
      alert('Wystąpił błąd podczas usuwania')
    }

    setActionLoading(null)
    setSelectedPromotion(null)
    fetchPromotions()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const tabs: { key: TabType; label: string; color: string }[] = [
    { key: 'pending', label: 'Do moderacji', color: 'yellow' },
    { key: 'approved', label: 'Aktywne', color: 'green' },
    { key: 'rejected', label: 'Odrzucone', color: 'red' },
    { key: 'expired', label: 'Wygasłe', color: 'gray' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promocje</h1>
            <p className="text-gray-600">Zarządzaj promocjami firm</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? `border-${tab.color}-500 text-${tab.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Ładowanie...</div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Brak promocji w tej kategorii
          </div>
        ) : (
          <div className="grid gap-4">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Company name */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">
                        {promotion.companies?.name}
                      </span>
                      {promotion.companies?.is_claimed && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Zweryfikowana
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {promotion.title}
                    </h3>

                    {/* Description */}
                    {promotion.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {promotion.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Ważna do: {formatDate(promotion.valid_until)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {promotion.contact_email}
                      </span>
                      {promotion.contact_phone && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {promotion.contact_phone}
                        </span>
                      )}
                      <span className="text-gray-400">
                        Dodano: {formatDate(promotion.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {activeTab === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(promotion)}
                          disabled={actionLoading === promotion.id}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Zatwierdź
                        </button>
                        <button
                          onClick={() => handleReject(promotion)}
                          disabled={actionLoading === promotion.id}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          Odrzuć
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedPromotion(promotion)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                    >
                      Szczegóły
                    </button>
                    <button
                      onClick={() => handleDelete(promotion)}
                      disabled={actionLoading === promotion.id}
                      className="px-3 py-1.5 bg-gray-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details modal */}
        {selectedPromotion && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Szczegóły promocji
                  </h2>
                  <button
                    onClick={() => setSelectedPromotion(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedPromotion.image_url && (
                  <div className="mb-4">
                    <img
                      src={selectedPromotion.image_url}
                      alt={selectedPromotion.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Firma</label>
                    <p className="font-medium text-gray-900">
                      {selectedPromotion.companies?.name}
                      {selectedPromotion.companies?.is_claimed && (
                        <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Zweryfikowana
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Tytuł</label>
                    <p className="font-medium text-gray-900">{selectedPromotion.title}</p>
                  </div>

                  {selectedPromotion.description && (
                    <div>
                      <label className="text-sm text-gray-500">Opis</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedPromotion.description}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-500">Ważna do</label>
                    <p className="font-medium text-gray-900">{formatDate(selectedPromotion.valid_until)}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Kontakt</label>
                    <p className="text-gray-900">{selectedPromotion.contact_email}</p>
                    {selectedPromotion.contact_phone && (
                      <p className="text-gray-900">{selectedPromotion.contact_phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className={`font-medium ${
                      selectedPromotion.status === 'approved' ? 'text-green-600' :
                      selectedPromotion.status === 'rejected' ? 'text-red-600' :
                      selectedPromotion.status === 'pending' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {selectedPromotion.status === 'approved' ? 'Zatwierdzona' :
                       selectedPromotion.status === 'rejected' ? 'Odrzucona' :
                       selectedPromotion.status === 'pending' ? 'Oczekuje' :
                       'Wygasła'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedPromotion.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedPromotion)
                          setSelectedPromotion(null)
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                      >
                        Zatwierdź
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedPromotion)
                          setSelectedPromotion(null)
                        }}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700"
                      >
                        Odrzuć
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedPromotion(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
