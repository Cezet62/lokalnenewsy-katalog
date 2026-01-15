import type { Article, Event, Classified, PromotionWithCompany } from '@/types/database'
import type { BentoSize } from '@/components/home/BentoGrid'

export type ContentType = 'promotion' | 'news' | 'event' | 'classified' | 'placeholder'

export interface BentoContent {
  id: string
  type: ContentType
  data: PromotionWithCompany | Article | Event | Classified | { placeholderType: 'promotion' | 'classified' | 'event' }
  size: BentoSize
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface ContentInput {
  promotions: PromotionWithCompany[]
  articles: Article[]
  events: Event[]
  classifieds: Classified[]
}

// Fixed grid template: 1 featured (2x2) + 6 regular slots (1x1)
// Weather and QuickLinks are separate, not part of content
const TOTAL_SLOTS = 7

export function generateBentoContent(input: ContentInput): BentoContent[] {
  const { promotions, articles, events, classifieds } = input

  const content: BentoContent[] = []

  // Shuffle all arrays for variety on each page load
  const shuffledPromotions = shuffle(promotions)
  const shuffledArticles = shuffle(articles)
  const shuffledEvents = shuffle(events)
  const shuffledClassifieds = shuffle(classifieds)

  // Slot 0: Featured (2x2) - prefer article, fallback to promotion
  if (shuffledArticles.length > 0) {
    const featured = shuffledArticles.shift()!
    content.push({
      id: `news-${featured.id}`,
      type: 'news',
      data: featured,
      size: '2x2',
    })
  } else if (shuffledPromotions.length > 0) {
    const featured = shuffledPromotions.shift()!
    content.push({
      id: `promo-${featured.id}`,
      type: 'promotion',
      data: featured,
      size: '2x2',
    })
  } else {
    content.push({
      id: 'placeholder-featured',
      type: 'placeholder',
      data: { placeholderType: 'promotion' as const },
      size: '2x2',
    })
  }

  // Build pool of remaining content items
  const pool: BentoContent[] = []

  // Add promotions to pool (priority)
  for (const promo of shuffledPromotions) {
    pool.push({
      id: `promo-${promo.id}`,
      type: 'promotion',
      data: promo,
      size: '1x1',
    })
  }

  // Add events to pool
  for (const event of shuffledEvents) {
    pool.push({
      id: `event-${event.id}`,
      type: 'event',
      data: event,
      size: '1x1',
    })
  }

  // Add articles to pool
  for (const article of shuffledArticles) {
    pool.push({
      id: `news-${article.id}`,
      type: 'news',
      data: article,
      size: '1x1',
    })
  }

  // Add classifieds to pool
  for (const classified of shuffledClassifieds) {
    pool.push({
      id: `classified-${classified.id}`,
      type: 'classified',
      data: classified,
      size: '1x1',
    })
  }

  // Shuffle the pool
  const shuffledPool = shuffle(pool)

  // Fill slots 1-6 from pool
  for (let i = 1; i < TOTAL_SLOTS; i++) {
    if (shuffledPool.length > 0) {
      content.push(shuffledPool.shift()!)
    } else {
      // Fill with placeholder if not enough content
      const placeholderTypes: ('promotion' | 'classified' | 'event')[] = ['promotion', 'classified', 'event']
      content.push({
        id: `placeholder-${i}`,
        type: 'placeholder',
        data: { placeholderType: placeholderTypes[i % 3] },
        size: '1x1',
      })
    }
  }

  return content
}
