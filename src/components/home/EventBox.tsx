import Link from 'next/link'
import Image from 'next/image'
import type { Event } from '@/types/database'
import { BentoSize } from './BentoGrid'

interface EventBoxProps {
  event: Event
  size?: BentoSize
}

export default function EventBox({ event, size = '1x1' }: EventBoxProps) {
  const isLarge = size === '2x2' || size === '2x1'

  const eventDate = new Date(event.event_date)
  const dayNumber = eventDate.getDate()
  const monthShort = eventDate.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', '')

  return (
    <Link
      href={`/wydarzenia/${event.slug}`}
      className="group relative h-full rounded-xl overflow-hidden block"
    >
      {/* Background image */}
      {event.image_url ? (
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={isLarge ? '50vw' : '25vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Date badge - top left */}
      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-purple-600 text-white text-xs font-bold px-3 py-0.5 text-center uppercase">
          {monthShort}
        </div>
        <div className="text-xl font-bold text-gray-900 px-3 py-1 text-center">
          {dayNumber}
        </div>
      </div>

      {/* Event type badge - top right */}
      <div className="absolute top-3 right-3">
        <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
          WYDARZENIE
        </span>
      </div>

      {/* Content - bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-bold text-white ${isLarge ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline`}>
          {event.title}
        </h3>

        {/* Location & time */}
        <div className="mt-2 space-y-1">
          {event.location && (
            <p className="text-white/80 text-xs flex items-center gap-1 truncate">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {event.location}
            </p>
          )}
          {event.event_time_start && (
            <p className="text-white/80 text-xs flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.event_time_start}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
