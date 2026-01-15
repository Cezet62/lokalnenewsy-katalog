import Link from 'next/link'
import type { ReactNode } from 'react'
import { BentoSize } from './BentoGrid'

type PlaceholderType = 'promotion' | 'classified' | 'event'

interface PlaceholderBoxProps {
  type: PlaceholderType
  size?: BentoSize
}

const placeholderConfig: Record<PlaceholderType, {
  title: string
  description: string
  buttonText: string
  href: string
  bgColor: string
  textColor: string
  buttonColor: string
  icon: ReactNode
}> = {
  promotion: {
    title: 'Masz firmę w Osielsku?',
    description: 'Dodaj promocję za darmo i dotrzej do mieszkańców gminy!',
    buttonText: 'Dodaj promocję',
    href: '/promocje/dodaj',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    textColor: 'text-green-900',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  classified: {
    title: 'Chcesz coś sprzedać?',
    description: 'Dodaj ogłoszenie i dotrzej do lokalnych mieszkańców!',
    buttonText: 'Dodaj ogłoszenie',
    href: '/ogloszenia/dodaj',
    bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
    textColor: 'text-amber-900',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    icon: (
      <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  event: {
    title: 'Organizujesz wydarzenie?',
    description: 'Daj znać mieszkańcom gminy o nadchodzącym evencie!',
    buttonText: 'Zgłoś wydarzenie',
    href: '/kontakt',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    textColor: 'text-purple-900',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
}

export default function PlaceholderBox({ type, size = '1x1' }: PlaceholderBoxProps) {
  const config = placeholderConfig[type]
  const isLarge = size === '2x2' || size === '2x1'

  return (
    <div className={`h-full ${config.bgColor} rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center text-center`}>
      <div className="mb-3">
        {config.icon}
      </div>
      <h3 className={`font-semibold ${config.textColor} ${isLarge ? 'text-lg' : 'text-sm'} mb-1`}>
        {config.title}
      </h3>
      {isLarge && (
        <p className={`text-sm ${config.textColor} opacity-80 mb-3`}>
          {config.description}
        </p>
      )}
      <Link
        href={config.href}
        className={`${config.buttonColor} text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors`}
      >
        {config.buttonText}
      </Link>
    </div>
  )
}
