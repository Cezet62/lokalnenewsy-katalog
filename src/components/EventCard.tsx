import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/types/database'

interface EventCardProps {
  event: Event
  variant?: 'default' | 'featured'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(timeString: string | null): string {
  if (!timeString) return ''
  return timeString.slice(0, 5) // "10:00:00" -> "10:00"
}

function getMonthShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase().replace('.', '')
}

function getDay(dateString: string): string {
  const date = new Date(dateString)
  return date.getDate().toString()
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={`/wydarzenia/${event.slug}`}
        className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-2/5 aspect-video md:aspect-auto">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            {event.is_featured && (
              <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
                Wyróżnione
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-4">
              {/* Date badge */}
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-lg p-3 text-center min-w-[60px]">
                <div className="text-xs font-medium opacity-90">{getMonthShort(event.event_date)}</div>
                <div className="text-2xl font-bold">{getDay(event.event_date)}</div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{event.excerpt}</p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  {/* Time */}
                  {event.event_time_start && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(event.event_time_start)}
                      {event.event_time_end && ` - ${formatTime(event.event_time_end)}`}
                    </span>
                  )}

                  {/* Location */}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </span>

                  {/* Price */}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    {event.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/wydarzenia/${event.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
        )}
        {event.is_featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
            Wyróżnione
          </div>
        )}
        {/* Date badge on image */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg p-2 text-center min-w-[50px] shadow-sm">
          <div className="text-xs font-medium text-blue-600">{getMonthShort(event.event_date)}</div>
          <div className="text-xl font-bold">{getDay(event.event_date)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.excerpt}</p>

        <div className="space-y-1.5 text-sm text-gray-500">
          {/* Time */}
          {event.event_time_start && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(event.event_time_start)}
              {event.event_time_end && ` - ${formatTime(event.event_time_end)}`}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {event.price}
          </div>
        </div>
      </div>
    </Link>
  )
}
