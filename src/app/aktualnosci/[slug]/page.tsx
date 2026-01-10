import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types/database'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as Article
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Artykuł nie znaleziony' }
  }

  return {
    title: `${article.title} | lokalnenewsy.pl`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  }
}

const categoryLabels: Record<string, string> = {
  aktualnosci: 'Aktualności',
  wydarzenia: 'Wydarzenia',
  komunikaty: 'Komunikaty',
  informacje: 'Informacje',
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const publishedDate = new Date(article.published_at).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <JsonLd type="article" data={article} />
      <div className="min-h-screen bg-gray-50 py-8">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
        <Link
          href="/aktualnosci"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć do aktualności
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {categoryLabels[article.category] || article.category}
            </span>
            <span>{publishedDate}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600">{article.excerpt}</p>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-8">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              )
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n')
              return (
                <ul key={index} className="list-disc list-inside space-y-1 my-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-gray-700">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={index} className="text-gray-700 leading-relaxed my-4">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Udostępnij artykuł</h3>
          <div className="flex gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://lokalnenewsy.pl/aktualnosci/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href,
                  })
                }
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Kopiuj link
            </button>
          </div>
        </div>
        </article>
      </div>
    </>
  )
}
