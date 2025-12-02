import type { NewsResponse, Article } from "./types"
import { kv } from "@/lib/redis"

const NEWSAPI_BASE = "https://newsapi.org/v2"

function mapNewsApiArticle(a: any): Article {
  return {
    title: a.title || "",
    description: a.description || "",
    content: a.content || a.description || "",
    url: a.url || "",
    image: a.urlToImage || "/placeholder.svg?height=400&width=600&text=NO+IMAGE",
    publishedAt: a.publishedAt || new Date().toISOString(),
    source: {
      name: (a.source && a.source.name) || "Unknown",
      url: (a.source && a.source.url) || "",
    },
  }
}

export async function fetchNews(category = "general", query = ""): Promise<NewsResponse> {
  const cacheKey = `news:${category}:${query}`

  // Try to get from cache first
  const cached = await kv.get<NewsResponse>(cacheKey)
  if (cached) return cached

  const apiKey = process.env.NEWSAPI_KEY || process.env.NEWS_API_KEY

  // If no API key configured, fall back to the existing mock generator
  if (!apiKey) {
    // keep the previous mock behaviour (briefly simulated)
    const mockCategories = {
      general: "General news about various topics",
      technology: "Technology news about AI, software, and hardware",
      business: "Business news about companies and markets",
      entertainment: "Entertainment news about movies, music, and celebrities",
      health: "Health news about medical research and wellness",
      science: "Science news about discoveries and research",
      sports: "Sports news about games, players, and teams",
    }

    const baseArticles: Article[] = Array(10)
      .fill(0)
      .map((_, i) => {
        const index = i + 1
        const categoryDesc = mockCategories[category as keyof typeof mockCategories] || mockCategories.general
        const queryText = query ? ` related to "${query}"` : ""

        return {
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article ${index}${queryText}`,
          description: `This is a sample description for a ${category} news article${queryText}. ${categoryDesc}.`,
          content: `This is the full content of the article about ${category}${queryText}. It contains more detailed information than the description.`,
          url: `https://example.com/article-${category}-${index}`,
          image: `/placeholder.svg?height=400&width=600&text=${category.toUpperCase()}+${index}`,
          publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
          source: {
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} News Source`,
            url: `https://example.com/${category}-source`,
          },
        }
      })

    const filteredArticles = query ? baseArticles.filter((_, i) => i < 5) : baseArticles

    const result = {
      totalArticles: filteredArticles.length,
      articles: filteredArticles,
    }

    await kv.set(cacheKey, result, { ex: 900 })
    return result
  }

  // Call NewsAPI.org top-headlines as default provider
  try {
    const params = new URLSearchParams({
      apiKey,
      category,
      pageSize: "12",
    })

    if (query) params.set("q", query)
    // default to 'us' to increase results — configurable if needed
    params.set("country", "us")

    const res = await fetch(`${NEWSAPI_BASE}/top-headlines?${params.toString()}`)
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)

    const data = await res.json()
    const articles = Array.isArray(data.articles) ? data.articles.map(mapNewsApiArticle) : []

    const result = {
      totalArticles: articles.length,
      articles,
    }

    // Cache the results for 15 minutes
    await kv.set(cacheKey, result, { ex: 900 })

    return result
  } catch (err) {
    // On any error, fall back to mock generator (so dev doesn't break)
    console.error("fetchNews error", err)
    return fetchNewsMockFallback(category, query, cacheKey)
  }
}

async function fetchNewsMockFallback(category: string, query: string, cacheKey: string) {
  const mockCategories = {
    general: "General news about various topics",
    technology: "Technology news about AI, software, and hardware",
    business: "Business news about companies and markets",
    entertainment: "Entertainment news about movies, music, and celebrities",
    health: "Health news about medical research and wellness",
    science: "Science news about discoveries and research",
    sports: "Sports news about games, players, and teams",
  }

  const baseArticles: Article[] = Array(10)
    .fill(0)
    .map((_, i) => {
      const index = i + 1
      const categoryDesc = mockCategories[category as keyof typeof mockCategories] || mockCategories.general
      const queryText = query ? ` related to "${query}"` : ""

      return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article ${index}${queryText}`,
        description: `This is a sample description for a ${category} news article${queryText}. ${categoryDesc}.`,
        content: `This is the full content of the article about ${category}${queryText}. It contains more detailed information than the description.`,
        url: `https://example.com/article-${category}-${index}`,
        image: `/placeholder.svg?height=400&width=600&text=${category.toUpperCase()}+${index}`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        source: {
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} News Source`,
          url: `https://example.com/${category}-source`,
        },
      }
    })

  const filteredArticles = query ? baseArticles.filter((_, i) => i < 5) : baseArticles

  const result = {
    totalArticles: filteredArticles.length,
    articles: filteredArticles,
  }

  await kv.set(cacheKey, result, { ex: 900 })
  return result
}
