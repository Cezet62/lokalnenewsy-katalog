import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lokalnenewsy.pl'),
  title: {
    default: 'lokalnenewsy.pl - Portal gminy Osielsko',
    template: '%s | lokalnenewsy.pl',
  },
  description:
    'Portal lokalny gminy Osielsko. Aktualności, wydarzenia, katalog firm, ogłoszenia mieszkańców. Bądź na bieżąco z tym, co dzieje się w Osielsku, Niemczu i Żołędowie.',
  keywords: [
    'Osielsko',
    'Niemcz',
    'Żołędowo',
    'Jarużyn',
    'gmina Osielsko',
    'aktualności Osielsko',
    'wydarzenia Osielsko',
    'firmy Osielsko',
    'ogłoszenia Osielsko',
    'portal lokalny',
    'Bydgoszcz okolice',
  ],
  authors: [{ name: 'lokalnenewsy.pl' }],
  creator: 'lokalnenewsy.pl',
  publisher: 'lokalnenewsy.pl',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://lokalnenewsy.pl',
    siteName: 'lokalnenewsy.pl',
    title: 'lokalnenewsy.pl - Portal gminy Osielsko',
    description: 'Aktualności, wydarzenia, firmy i ogłoszenia z gminy Osielsko. Twój lokalny portal informacyjny.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'lokalnenewsy.pl - Portal gminy Osielsko',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lokalnenewsy.pl - Portal gminy Osielsko',
    description: 'Aktualności, wydarzenia, firmy i ogłoszenia z gminy Osielsko.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <JsonLd type="website" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
