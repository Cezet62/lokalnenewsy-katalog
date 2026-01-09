import CompanyCard from './CompanyCard'
import type { CompanyWithRelations } from '@/types/database'

interface CompanyGridProps {
  companies: CompanyWithRelations[]
}

export default function CompanyGrid({ companies }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nie znaleziono firm
        </h3>
        <p className="text-gray-500">
          Spróbuj zmienić filtry lub wyszukaj inną frazę
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
}
