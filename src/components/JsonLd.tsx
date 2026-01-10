import type { Article, Event, Company } from '@/types/database'
import { siteConfig } from '@/lib/config'

interface JsonLdProps {
  type: 'website' | 'article' | 'event' | 'localbusiness'
  data?: Article | Event | Company | null
}

export default function JsonLd({ type, data }: JsonLdProps) {
  let schema: object

  switch (type) {
    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.brand,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/firmy?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.brand,
          url: siteConfig.url,
        },
      }
      break

    case 'article':
      const article = data as Article
      if (!article) return null
      schema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        image: article.image_url || siteConfig.getOgImageUrl(),
        datePublished: article.published_at,
        dateModified: article.updated_at,
        author: {
          '@type': 'Organization',
          name: siteConfig.brand,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.brand,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': siteConfig.getUrl(`/aktualnosci/${article.slug}`),
        },
      }
      break

    case 'event':
      const event = data as Event
      if (!event) return null
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.excerpt,
        startDate: `${event.event_date}${event.event_time_start ? `T${event.event_time_start}` : ''}`,
        endDate: event.event_time_end
          ? `${event.event_date}T${event.event_time_end}`
          : undefined,
        location: {
          '@type': 'Place',
          name: event.location,
          address: {
            '@type': 'PostalAddress',
            streetAddress: event.address || event.location,
            addressLocality: siteConfig.region,
            addressRegion: 'kujawsko-pomorskie',
            addressCountry: 'PL',
          },
        },
        image: event.image_url || siteConfig.getOgImageUrl(),
        organizer: event.organizer
          ? {
              '@type': 'Organization',
              name: event.organizer,
            }
          : undefined,
        offers: event.price === 'bezpłatne' || event.price === 'Bezpłatne'
          ? {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'PLN',
              availability: 'https://schema.org/InStock',
            }
          : undefined,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      }
      break

    case 'localbusiness':
      const company = data as Company
      if (!company) return null
      schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: company.name,
        description: company.description || `${company.name} - firma z gminy ${siteConfig.region}`,
        image: company.image_url,
        telephone: company.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.address,
          addressLocality: siteConfig.region,
          addressRegion: 'kujawsko-pomorskie',
          addressCountry: 'PL',
        },
        url: company.website || siteConfig.getUrl(`/firmy/${company.slug}`),
        openingHours: company.hours || undefined,
        sameAs: [
          company.facebook,
          company.instagram,
        ].filter(Boolean),
      }
      break

    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
