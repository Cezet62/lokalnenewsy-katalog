import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: 'Katalog firm gminy Osielsko | lokalnenewsy.pl',
  description:
    'Znajdź sprawdzone lokalne usługi i firmy w gminie Osielsko. Gastronomia, sport, edukacja, motoryzacja i więcej.',
  keywords: [
    'Osielsko',
    'firmy',
    'katalog',
    'usługi lokalne',
    'Niemcz',
    'Żołędowo',
    'Bydgoszcz',
  ],
  openGraph: {
    title: 'Katalog firm gminy Osielsko',
    description: 'Znajdź sprawdzone lokalne usługi i firmy w Twojej okolicy',
    type: 'website',
    locale: 'pl_PL',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
