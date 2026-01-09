'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Event } from '@/types/database'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ąá]/g, 'a')
    .replace(/[ćč]/g, 'c')
    .replace(/[ęé]/g, 'e')
    .replace(/[ł]/g, 'l')
    .replace(/[ńñ]/g, 'n')
    .replace(/[óö]/g, 'o')
    .replace(/[śš]/g, 's')
    .replace(/[żź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const emptyEvent: Partial<Event> = {
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  image_url: '',
  location: '',
  address: '',
  event_date: '',
  event_time_start: '',
  event_time_end: '',
  organizer: '',
  price: 'Wstęp wolny',
  website_url: '',
  facebook_url: '',
  is_featured: false,
  is_published: true,
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Partial<Event>>(emptyEvent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchEvents = async () => {
    const { data, error } = await supabaseBrowser
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })

    if (!error && data) {
      setEvents(data as Event[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleTitleChange = (title: string) => {
    setEditingEvent({
      ...editingEvent,
      title,
      slug: editingEvent.id ? editingEvent.slug : generateSlug(title),
    })
  }

  const handleSave = async () => {
    if (!editingEvent.title || !editingEvent.excerpt || !editingEvent.description || !editingEvent.location || !editingEvent.event_date) {
      setMessage({ type: 'error', text: 'Wypełnij wszystkie wymagane pola' })
      return
    }

    setSaving(true)
    setMessage(null)

    const eventData = {
      title: editingEvent.title,
      slug: editingEvent.slug || generateSlug(editingEvent.title),
      excerpt: editingEvent.excerpt,
      description: editingEvent.description,
      image_url: editingEvent.image_url || null,
      location: editingEvent.location,
      address: editingEvent.address || null,
      event_date: editingEvent.event_date,
      event_time_start: editingEvent.event_time_start || null,
      event_time_end: editingEvent.event_time_end || null,
      organizer: editingEvent.organizer || null,
      price: editingEvent.price || 'Wstęp wolny',
      website_url: editingEvent.website_url || null,
      facebook_url: editingEvent.facebook_url || null,
      is_featured: editingEvent.is_featured || false,
      is_published: editingEvent.is_published ?? true,
    }

    let error
    if (editingEvent.id) {
      const result = await supabaseBrowser
        .from('events')
        .update(eventData as never)
        .eq('id', editingEvent.id)
      error = result.error
    } else {
      const result = await supabaseBrowser
        .from('events')
        .insert(eventData as never)
      error = result.error
    }

    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd zapisu: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: editingEvent.id ? 'Wydarzenie zaktualizowane' : 'Wydarzenie dodane' })
    setShowForm(false)
    setEditingEvent(emptyEvent)
    fetchEvents()
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
    setMessage(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to wydarzenie?')) return

    const { error } = await supabaseBrowser.from('events').delete().eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd usuwania: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: 'Wydarzenie usunięte' })
    fetchEvents()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvent(emptyEvent)
    setMessage(null)
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wydarzenia</h1>
          <p className="text-gray-600 mt-1">Zarządzaj kalendarzem wydarzeń</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingEvent(emptyEvent); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nowe wydarzenie
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingEvent.id ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł *</label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingEvent.slug || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zajawka *</label>
              <textarea
                value={editingEvent.excerpt || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opis *</label>
              <textarea
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="Użyj **tekst** dla nagłówków, - dla list"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data wydarzenia *</label>
                <input
                  type="date"
                  value={editingEvent.event_date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Godzina od</label>
                <input
                  type="time"
                  value={editingEvent.event_time_start || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_time_start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Godzina do</label>
                <input
                  type="time"
                  value={editingEvent.event_time_end || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_time_end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miejsce *</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="np. Park Centralny w Osielsku"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input
                  type="text"
                  value={editingEvent.address || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="np. ul. Centralna 5, Osielsko"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizator</label>
                <input
                  type="text"
                  value={editingEvent.organizer || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cena</label>
                <input
                  type="text"
                  value={editingEvent.price || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Wstęp wolny"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL obrazka</label>
                <input
                  type="text"
                  value={editingEvent.image_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strona wydarzenia</label>
                <input
                  type="url"
                  value={editingEvent.website_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, website_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={editingEvent.facebook_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, facebook_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://facebook.com/events/..."
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingEvent.is_published ?? true}
                  onChange={(e) => setEditingEvent({ ...editingEvent, is_published: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Opublikowane</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingEvent.is_featured || false}
                  onChange={(e) => setEditingEvent({ ...editingEvent, is_featured: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Wyróżnione</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Zapisywanie...' : 'Zapisz'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Ładowanie...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Brak wydarzeń</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tytuł</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miejsce</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => {
                    const isPast = new Date(event.event_date) < new Date()
                    return (
                      <tr key={event.id} className={`hover:bg-gray-50 ${isPast ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {event.is_featured && (
                              <span className="text-yellow-500" title="Wyróżnione">★</span>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-1">{event.title}</div>
                              <div className="text-sm text-gray-500">/{event.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(event.event_date).toLocaleDateString('pl-PL')}
                          </div>
                          {event.event_time_start && (
                            <div className="text-sm text-gray-500">
                              {event.event_time_start.slice(0, 5)}
                              {event.event_time_end && ` - ${event.event_time_end.slice(0, 5)}`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{event.location}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full w-fit ${event.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {event.is_published ? 'Opublikowane' : 'Szkic'}
                            </span>
                            {isPast && (
                              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 w-fit">
                                Minione
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/wydarzenia/${event.slug}`}
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
                              onClick={() => handleEdit(event)}
                              className="p-2 text-gray-400 hover:text-purple-600"
                              title="Edytuj"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
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
      )}
    </AdminLayout>
  )
}
