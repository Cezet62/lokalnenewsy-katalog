import { Suspense } from 'react'
import Hero from '@/components/Hero'
import Filters from '@/components/Filters'
import CompanyGrid from '@/components/CompanyGrid'
import { supabase } from '@/lib/supabase'
import type { CompanyWithRelations, Category, Location } from '@/types/database'

interface PageProps {
  searchParams: Promise<{
    kategoria?: string
    miejscowosc?: string
    szukaj?: string
  }>
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }

  return data || []
}

async function getCompanies(
  categorySlug?: string,
  locationSlug?: string,
  searchQuery?: string
): Promise<CompanyWithRelations[]> {
  // Get category ID if filtered
  let categoryId: string | null = null
  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    categoryId = category?.id ?? null
  }

  // Get location ID if filtered
  let locationId: string | null = null
  if (locationSlug) {
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', locationSlug)
      .single()
    locationId = location?.id ?? null
  }

  // Build query with all filters
  let query = supabase
    .from('companies')
    .select(`
      *,
      categories (*),
      locations (*)
    `)
    .order('is_featured', { ascending: false })
    .order('name')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (locationId) {
    query = query.eq('location_id', locationId)
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return (data as CompanyWithRelations[]) || []
}

function FiltersWrapper({
  categories,
  locations,
}: {
  categories: Category[]
  locations: Location[]
}) {
  return (
    <Suspense fallback={<div className="h-20 bg-white border-b border-gray-200" />}>
      <Filters categories={categories} locations={locations} />
    </Suspense>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const [categories, locations, companies] = await Promise.all([
    getCategories(),
    getLocations(),
    getCompanies(params.kategoria, params.miejscowosc, params.szukaj),
  ])

  return (
    <>
      <Hero />
      <FiltersWrapper categories={categories} locations={locations} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {companies.length === 0
              ? 'Brak wyników'
              : companies.length === 1
              ? '1 firma'
              : `${companies.length} firm`}
            {params.szukaj && (
              <span>
                {' '}
                dla &quot;{params.szukaj}&quot;
              </span>
            )}
          </p>
        </div>

        <CompanyGrid companies={companies} />
      </section>
    </>
  )
}
