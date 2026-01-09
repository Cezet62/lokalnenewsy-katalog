import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">lokalne</span>
            <span className="text-2xl font-bold text-gray-900">newsy</span>
            <span className="text-sm text-gray-500 hidden sm:inline">.pl</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/dodaj-firme"
              className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline"
            >
              Dodaj firmę
            </Link>
            <Link
              href="/newsletter"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Newsletter
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
