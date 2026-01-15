import Link from 'next/link'

export default function QuickLinks() {
  const links = [
    {
      icon: '🏢',
      label: 'Katalog firm',
      href: '/firmy',
    },
    {
      icon: '📰',
      label: 'Aktualności',
      href: '/aktualnosci',
    },
    {
      icon: '🎉',
      label: 'Wydarzenia',
      href: '/wydarzenia',
    },
    {
      icon: '📋',
      label: 'Ogłoszenia',
      href: '/ogloszenia',
    },
    {
      icon: '🏷️',
      label: 'Promocje',
      href: '/promocje',
    },
    {
      icon: 'ℹ️',
      label: 'Info praktyczne',
      href: '/info',
    },
  ]

  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">Szybkie linki</h3>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1.5 transition-colors"
          >
            <span>{link.icon}</span>
            <span className="truncate">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
