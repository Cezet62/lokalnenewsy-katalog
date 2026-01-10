// Site configuration - uses environment variables for multi-tenant support
//
// Required env variables:
// - NEXT_PUBLIC_SITE_URL: Full URL (e.g., https://osielsko.lokalnenewsy.pl)
// - NEXT_PUBLIC_SITE_REGION: Region/gmina name (e.g., Osielsko)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osielsko.lokalnenewsy.pl'
const siteRegion = process.env.NEXT_PUBLIC_SITE_REGION || 'Osielsko'

export const siteConfig = {
  // Base URL (with protocol, no trailing slash)
  url: siteUrl,

  // Main brand name (constant across all deployments)
  brand: 'lokalnenewsy.pl',

  // Current region/gmina name (changes per deployment)
  region: siteRegion,

  // Title for SEO
  title: `${siteRegion} - lokalnenewsy.pl`,

  // Description template
  description: `Portal lokalny gminy ${siteRegion}. Aktualności, wydarzenia, katalog firm, ogłoszenia mieszkańców.`,

  // Contact email
  email: 'kontakt@lokalnenewsy.pl',

  // Default OG image
  ogImage: '/og-image.png',

  // Get full URL for a path
  getUrl(path: string = '') {
    return `${siteUrl}${path}`
  },

  // Get full OG image URL
  getOgImageUrl() {
    return `${siteUrl}${this.ogImage}`
  },
}

export default siteConfig
