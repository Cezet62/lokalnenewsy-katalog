import { supabase } from '@/lib/supabase'
import EventCard from '@/components/EventCard'
import type { Event } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wydarzenia',
  description: 'Kalendarz wydarzeń w gminie Osielsko. Festyny, koncerty, warsztaty i spotkania.',
}

async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return (data as Event[]) || []
}

async function getPastEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .lt('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching past events:', error)
    return []
  }

  return (data as Event[]) || []
}

export default async function WydarzeniaPage() {
  const [events, pastEvents] = await Promise.all([
    getEvents(),
    getPastEvents(),
  ])

  const featuredEvent = events.find((e) => e.is_featured) || events[0]
  const otherEvents = events.filter((e) => e.id !== featuredEvent?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Wydarzenia</h1>
          <p className="text-gray-600 mt-2">
            Kalendarz wydarzeń w gminie Osielsko i okolicach
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Brak nadchodzących wydarzeń
            </h3>
            <p className="mt-2 text-gray-500">
              Sprawdź ponownie wkrótce - na pewno coś się pojawi!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featuredEvent && (
              <section className="mb-10">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Najbliższe wydarzenie
                </h2>
                <EventCard event={featuredEvent} variant="featured" />
              </section>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Nadchodzące wydarzenia ({otherEvents.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="border-t border-gray-200 pt-10">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Minione wydarzenia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
