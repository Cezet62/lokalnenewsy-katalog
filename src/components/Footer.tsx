import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">lokalne</span>
            <span className="text-lg font-bold text-gray-900">newsy</span>
            <span className="text-xs text-gray-500">.pl</span>
            <span className="text-gray-400 ml-2">|</span>
            <span className="text-sm text-gray-500">
              © {currentYear}
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/o-katalogu" className="text-gray-600 hover:text-gray-900">
              O katalogu
            </Link>
            <Link href="/kontakt" className="text-gray-600 hover:text-gray-900">
              Kontakt
            </Link>
            <Link href="/regulamin" className="text-gray-600 hover:text-gray-900">
              Regulamin
            </Link>
          </nav>
        </div>

        {/* Subtext */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Katalog firm gminy Osielsko. Wspieramy lokalne biznesy.
          </p>
        </div>
      </div>
    </footer>
  )
}
