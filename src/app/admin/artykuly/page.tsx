'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Article } from '@/types/database'

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

const emptyArticle: Partial<Article> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image_url: '',
  category: 'aktualnosci',
  is_featured: false,
  is_published: true,
  author: 'Redakcja',
}

export default function AdminArticles() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
  const [editingArticle, setEditingArticle] = useState<Partial<Article>>(emptyArticle)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchArticles = async () => {
    const { data, error } = await supabaseBrowser
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setArticles(data as Article[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleTitleChange = (title: string) => {
    setEditingArticle({
      ...editingArticle,
      title,
      slug: editingArticle.id ? editingArticle.slug : generateSlug(title),
    })
  }

  const handleSave = async () => {
    if (!editingArticle.title || !editingArticle.excerpt || !editingArticle.content) {
      setMessage({ type: 'error', text: 'Wypełnij wszystkie wymagane pola' })
      return
    }

    setSaving(true)
    setMessage(null)

    const articleData = {
      title: editingArticle.title,
      slug: editingArticle.slug || generateSlug(editingArticle.title),
      excerpt: editingArticle.excerpt,
      content: editingArticle.content,
      image_url: editingArticle.image_url || null,
      category: editingArticle.category || 'aktualnosci',
      is_featured: editingArticle.is_featured || false,
      is_published: editingArticle.is_published ?? true,
      author: editingArticle.author || 'Redakcja',
    }

    let error
    if (editingArticle.id) {
      const result = await supabaseBrowser
        .from('articles')
        .update(articleData as never)
        .eq('id', editingArticle.id)
      error = result.error
    } else {
      const result = await supabaseBrowser
        .from('articles')
        .insert(articleData as never)
      error = result.error
    }

    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd zapisu: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: editingArticle.id ? 'Artykuł zaktualizowany' : 'Artykuł dodany' })
    setShowForm(false)
    setEditingArticle(emptyArticle)
    fetchArticles()
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setShowForm(true)
    setMessage(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten artykuł?')) return

    const { error } = await supabaseBrowser.from('articles').delete().eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: 'Błąd usuwania: ' + error.message })
      return
    }

    setMessage({ type: 'success', text: 'Artykuł usunięty' })
    fetchArticles()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingArticle(emptyArticle)
    setMessage(null)
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artykuły</h1>
          <p className="text-gray-600 mt-1">Zarządzaj aktualnościami i wpisami</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingArticle(emptyArticle); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nowy artykuł
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
            {editingArticle.id ? 'Edytuj artykuł' : 'Nowy artykuł'}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł *
                </label>
                <input
                  type="text"
                  value={editingArticle.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={editingArticle.slug || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zajawka *
              </label>
              <textarea
                value={editingArticle.excerpt || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treść *
              </label>
              <textarea
                value={editingArticle.content || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Użyj **tekst** dla nagłówków, - dla list"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL obrazka
                </label>
                <input
                  type="text"
                  value={editingArticle.image_url || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria
                </label>
                <select
                  value={editingArticle.category || 'aktualnosci'}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aktualnosci">Aktualności</option>
                  <option value="wydarzenia">Wydarzenia</option>
                  <option value="komunikaty">Komunikaty</option>
                  <option value="informacje">Informacje</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  value={editingArticle.author || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.is_published ?? true}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Opublikowany</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.is_featured || false}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Wyróżniony</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
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
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Brak artykułów</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tytuł</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {article.is_featured && (
                            <span className="text-yellow-500" title="Wyróżniony">★</span>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                            <div className="text-sm text-gray-500">/{article.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{article.category}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${article.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {article.is_published ? 'Opublikowany' : 'Szkic'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/aktualnosci/${article.slug}`}
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
                            onClick={() => handleEdit(article)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Edytuj"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
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
