'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Classified } from '@/types/database'

const categoryLabels: Record<string, string> = {
  sprzedam: 'Sprzedam',
  kupie: 'Kupię',
  uslugi: 'Usługi',
  praca: 'Praca',
  oddam: 'Oddam',
  inne: 'Inne',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Oczekuje', color: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Aktywne', color: 'bg-green-100 text-green-700' },
  sold: { label: 'Sprzedane', color: 'bg-blue-100 text-blue-700' },
  expired: { label: 'Wygasłe', color: 'bg-gray-100 text-gray-600' },
  rejected: { label: 'Odrzucone', color: 'bg-red-100 text-red-700' },
}

export default function AdminClassifieds() {
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchClassifieds = async () => {
    let query = supabaseBrowser
      .from('classifieds')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query

    if (!error && data) {
      setClassifieds(data as Classified[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClassifieds()
  }, [filter])

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabaseBrowser
      .from('classifieds')
      .update({ status: newStatus } as never)
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd aktualizacji: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: 'Status zaktualizowany' })
    fetchClassifieds()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return

    const { error } = await supabaseBrowser
      .from('classifieds')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd usuwania: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: 'Ogłoszenie usunięte' })
    fetchClassifieds()
  }

  const pendingCount = classifieds.filter(c => c.status === 'pending').length

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ogłoszenia</h1>
          <p className="text-gray-600 mt-1">Moderuj ogłoszenia mieszkańców</p>
        </div>
        {filter !== 'pending' && pendingCount > 0 && (
          <button
            onClick={() => setFilter('pending')}
            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
          >
            {pendingCount} oczekujących
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'pending', label: 'Oczekujące' },
          { value: 'active', label: 'Aktywne' },
          { value: 'sold', label: 'Sprzedane' },
          { value: 'expired', label: 'Wygasłe' },
          { value: 'rejected', label: 'Odrzucone' },
          { value: 'all', label: 'Wszystkie' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Ładowanie...</div>
        ) : classifieds.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Brak ogłoszeń</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ogłoszenie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classifieds.map((classified) => {
                  const status = statusLabels[classified.status] || statusLabels.pending
                  return (
                    <tr key={classified.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{classified.title}</div>
                          <div className="text-sm text-gray-500">{classified.location}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(classified.created_at).toLocaleDateString('pl-PL')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {categoryLabels[classified.category] || classified.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{classified.contact_name}</div>
                          {classified.contact_phone && (
                            <div className="text-gray-500">{classified.contact_phone}</div>
                          )}
                          {classified.contact_email && (
                            <div className="text-gray-500 text-xs">{classified.contact_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {classified.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(classified.id, 'active')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Zatwierdź"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => updateStatus(classified.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Odrzuć"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                          {classified.status === 'active' && (
                            <button
                              onClick={() => updateStatus(classified.id, 'sold')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium"
                              title="Oznacz jako sprzedane"
                            >
                              Sprzedane
                            </button>
                          )}
                          <a
                            href={`/ogloszenia/${classified.id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Podgląd"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleDelete(classified.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Usuń"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
