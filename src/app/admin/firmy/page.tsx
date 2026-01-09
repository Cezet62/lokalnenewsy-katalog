'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Company, Category, Location } from '@/types/database'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ąá]/g, 'a')
    .replace(/[ćč]/g, 'c')
    .replace(/[ęé]/g, 'e')
    .replace(/[ł]/g, 'l')
    .replace(/[ńñ]/g, 'n')
    .replace(/[óö]/g, 'o')
    .replace(/[śš]/g, 's')
    .replace(/[żź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const emptyCompany: Partial<Company> = {
  name: '',
  slug: '',
  address: '',
  phone: '',
  hours: '',
  website: '',
  facebook: '',
  instagram: '',
  description: '',
  image_url: 'https://picsum.photos/seed/firma/800/600',
  is_featured: false,
  is_claimed: false,
  google_maps_url: '',
  category_id: '',
  location_id: '',
}

export default function AdminCompanies() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
  const [editingCompany, setEditingCompany] = useState<Partial<Company>>(emptyCompany)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = async () => {
    const [companiesRes, categoriesRes, locationsRes] = await Promise.all([
      supabaseBrowser.from('companies').select('*').order('name'),
      supabaseBrowser.from('categories').select('*').order('sort_order'),
      supabaseBrowser.from('locations').select('*').order('sort_order'),
    ])

    if (companiesRes.data) setCompanies(companiesRes.data as Company[])
    if (categoriesRes.data) setCategories(categoriesRes.data as Category[])
    if (locationsRes.data) setLocations(locationsRes.data as Location[])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNameChange = (name: string) => {
    setEditingCompany({
      ...editingCompany,
      name,
      slug: editingCompany.id ? editingCompany.slug : generateSlug(name),
    })
  }

  const handleSave = async () => {
    if (!editingCompany.name || !editingCompany.address || !editingCompany.phone) {
      setMessage({ type: 'error', text: 'Wypełnij wszystkie wymagane pola (nazwa, adres, telefon)' })
      return
    }

    setSaving(true)
    setMessage(null)

    const companyData = {
      name: editingCompany.name,
      slug: editingCompany.slug || generateSlug(editingCompany.name),
      address: editingCompany.address,
      phone: editingCompany.phone,
      hours: editingCompany.hours || null,
      website: editingCompany.website || null,
      facebook: editingCompany.facebook || null,
      instagram: editingCompany.instagram || null,
      description: editingCompany.description || null,
      image_url: editingCompany.image_url || 'https://picsum.photos/seed/firma/800/600',
      is_featured: editingCompany.is_featured || false,
      is_claimed: editingCompany.is_claimed || false,
      google_maps_url: editingCompany.google_maps_url || null,
      category_id: editingCompany.category_id || null,
      location_id: editingCompany.location_id || null,
    }

    let error
    if (editingCompany.id) {
      const result = await supabaseBrowser
        .from('companies')
        .update(companyData as never)
        .eq('id', editingCompany.id)
      error = result.error
    } else {
      const result = await supabaseBrowser
        .from('companies')
        .insert(companyData as never)
      error = result.error
    }

    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd zapisu: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: editingCompany.id ? 'Firma zaktualizowana' : 'Firma dodana' })
    setShowForm(false)
    setEditingCompany(emptyCompany)
    fetchData()
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setShowForm(true)
    setMessage(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę firmę?')) return

    const { error } = await supabaseBrowser.from('companies').delete().eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd usuwania: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: 'Firma usunięta' })
    fetchData()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCompany(emptyCompany)
    setMessage(null)
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-'
    const category = categories.find(c => c.id === categoryId)
    return category ? `${category.icon} ${category.name}` : '-'
  }

  const getLocationName = (locationId: string | null) => {
    if (!locationId) return '-'
    const location = locations.find(l => l.id === locationId)
    return location?.name || '-'
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Firmy</h1>
          <p className="text-gray-600 mt-1">Zarządzaj katalogiem firm</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingCompany(emptyCompany); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nowa firma
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingCompany.id ? 'Edytuj firmę' : 'Nowa firma'}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa firmy *</label>
                <input
                  type="text"
                  value={editingCompany.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingCompany.slug || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                <select
                  value={editingCompany.category_id || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, category_id: e.target.value || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Wybierz --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miejscowość</label>
                <select
                  value={editingCompany.location_id || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, location_id: e.target.value || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Wybierz --</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                <input
                  type="text"
                  value={editingCompany.address || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ul. Przykładowa 1, 86-031 Osielsko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="text"
                  value={editingCompany.phone || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="123 456 789"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Godziny otwarcia</label>
                <input
                  type="text"
                  value={editingCompany.hours || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, hours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Pn-Pt 8:00-17:00, Sb 9:00-13:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strona www</label>
                <input
                  type="url"
                  value={editingCompany.website || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={editingCompany.facebook || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, facebook: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={editingCompany.instagram || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
                <input
                  type="url"
                  value={editingCompany.google_maps_url || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, google_maps_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL obrazka</label>
              <input
                type="url"
                value={editingCompany.image_url || ''}
                onChange={(e) => setEditingCompany({ ...editingCompany, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
              <textarea
                value={editingCompany.description || ''}
                onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCompany.is_featured || false}
                  onChange={(e) => setEditingCompany({ ...editingCompany, is_featured: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Wyróżniona</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCompany.is_claimed || false}
                  onChange={(e) => setEditingCompany({ ...editingCompany, is_claimed: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Zweryfikowana (claimed)</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Zapisywanie...' : 'Zapisz'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Ładowanie...</div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Brak firm</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miejscowość</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {company.is_featured && (
                            <span className="text-yellow-500" title="Wyróżniona">★</span>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{company.name}</div>
                            <div className="text-sm text-gray-500">{company.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getCategoryName(company.category_id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getLocationName(company.location_id)}
                      </td>
                      <td className="px-6 py-4">
                        {company.is_claimed ? (
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            Zweryfikowana
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Niezweryfikowana
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/firmy/${company.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Podgląd"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 text-gray-400 hover:text-green-600"
                            title="Edytuj"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Usuń"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
