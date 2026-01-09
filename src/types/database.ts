export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string | null
          location_id: string | null
          address: string
          phone: string
          hours: string | null
          website: string | null
          facebook: string | null
          instagram: string | null
          description: string | null
          image_url: string
          is_featured: boolean
          is_claimed: boolean
          owner_email: string | null
          google_maps_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category_id?: string | null
          location_id?: string | null
          address: string
          phone: string
          hours?: string | null
          website?: string | null
          facebook?: string | null
          instagram?: string | null
          description?: string | null
          image_url: string
          is_featured?: boolean
          is_claimed?: boolean
          owner_email?: string | null
          google_maps_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category_id?: string | null
          location_id?: string | null
          address?: string
          phone?: string
          hours?: string | null
          website?: string | null
          facebook?: string | null
          instagram?: string | null
          description?: string | null
          image_url?: string
          is_featured?: boolean
          is_claimed?: boolean
          owner_email?: string | null
          google_maps_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          company_id: string | null
          name: string
          email: string
          phone: string | null
          message: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          name: string
          email: string
          phone?: string | null
          message?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}

// Typy pomocnicze
export type Category = Database['public']['Tables']['categories']['Row']
export type Location = Database['public']['Tables']['locations']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Claim = Database['public']['Tables']['claims']['Row']

// Typ firmy z relacjami
export type CompanyWithRelations = Company & {
  categories: Category | null
  locations: Location | null
}

// Typ artykułu/newsa
export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string | null
  category: string
  is_featured: boolean
  is_published: boolean
  author: string
  views: number
  published_at: string
  created_at: string
  updated_at: string
}
