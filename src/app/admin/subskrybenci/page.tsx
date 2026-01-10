'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Subscriber {
  id: string
  email: string
  is_active: boolean
  source: string
  created_at: string
  unsubscribed_at: string | null
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    const { data, error } = await supabaseBrowser
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscribers:', error)
    } else {
      setSubscribers((data as Subscriber[]) || [])
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabaseBrowser
      .from('subscribers')
      .update({
        is_active: !currentStatus,
        unsubscribed_at: !currentStatus ? null : new Date().toISOString()
      } as never)
      .eq('id', id)

    if (error) {
      console.error('Error updating subscriber:', error)
      alert('Błąd podczas aktualizacji')
    } else {
      fetchSubscribers()
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego subskrybenta?')) return

    const { error } = await supabaseBrowser
      .from('subscribers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting subscriber:', error)
      alert('Błąd podczas usuwania')
    } else {
      fetchSubscribers()
    }
  }

  const exportToCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active)
    const csv = [
      'email,data_zapisu,zrodlo',
      ...activeSubscribers.map(s =>
        `${s.email},${new Date(s.created_at).toLocaleDateString('pl-PL')},${s.source}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `subskrybenci_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredSubscribers = subscribers.filter(s => {
    if (filter === 'active') return s.is_active
    if (filter === 'inactive') return !s.is_active
    return true
  })

  const activeCount = subscribers.filter(s => s.is_active).length
  const inactiveCount = subscribers.filter(s => !s.is_active).length

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subskrybenci newslettera</h1>
          <p className="text-gray-600 mt-1">
            {activeCount} aktywnych, {inactiveCount} nieaktywnych
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Eksportuj CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Wszystkie ({subscribers.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aktywne ({activeCount})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Nieaktywne ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Subscribers list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Ładowanie...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === 'all'
              ? 'Brak subskrybentów. Pojawią się tutaj po zapisaniu się pierwszej osoby.'
              : 'Brak subskrybentów w tej kategorii.'
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Źródło
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data zapisu
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{subscriber.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {subscriber.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(subscriber.created_at).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(subscriber.id, subscriber.is_active)}
                          className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                            subscriber.is_active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {subscriber.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-sm px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Wysyłanie newsletterów</p>
            <p className="mt-1">
              Aby wysyłać newslettery, potrzebujesz integracji z serwisem email (np. Resend).
              Na razie możesz eksportować listę do CSV i użyć zewnętrznego narzędzia.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
