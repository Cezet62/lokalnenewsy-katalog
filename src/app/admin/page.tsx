'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Stats {
  articles: number
  events: number
  companies: number
  classifieds: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ articles: 0, events: 0, companies: 0, classifieds: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, eventsRes, companiesRes, classifiedsRes] = await Promise.all([
        supabaseBrowser.from('articles').select('id', { count: 'exact', head: true }),
        supabaseBrowser.from('events').select('id', { count: 'exact', head: true }),
        supabaseBrowser.from('companies').select('id', { count: 'exact', head: true }),
        supabaseBrowser.from('classifieds').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      setStats({
        articles: articlesRes.count || 0,
        events: eventsRes.count || 0,
        companies: companiesRes.count || 0,
        classifieds: classifiedsRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Artykuły', value: stats.articles, href: '/admin/artykuly', color: 'blue', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Wydarzenia', value: stats.events, href: '/admin/wydarzenia', color: 'purple', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Firmy', value: stats.companies, href: '/admin/firmy', color: 'green', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Ogłoszenia (nowe)', value: stats.classifieds, href: '/admin/ogloszenia', color: 'yellow', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ]

  const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Przegląd zawartości portalu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const colors = colorClasses[card.color]
          return (
            <a
              key={card.label}
              href={card.href}
              className={`${colors.bg} rounded-xl p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-4">
                <div className={`${colors.iconBg} rounded-lg p-3`}>
                  <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{card.label}</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {loading ? '...' : card.value}
                  </p>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/artykuly?new=1"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Nowy artykuł</span>
          </a>
          <a
            href="/admin/wydarzenia?new=1"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="bg-purple-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Nowe wydarzenie</span>
          </a>
          <a
            href="/admin/firmy?new=1"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <div className="bg-green-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Nowa firma</span>
          </a>
        </div>
      </div>
    </AdminLayout>
  )
}
