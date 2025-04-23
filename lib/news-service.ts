import type { NewsResponse, Article } from "./types"
import { kv } from "@/lib/redis"

// GNews API key from environment variable
const GNEWS_API_KEY = process.env.GNEWS_API_KEY

export async function fetchNews(category = "general", query = ""): Promise<NewsResponse> {
  const cacheKey = `news:${category}:${query}`

  // Try to get from cache first
  const cached = await kv.get<NewsResponse>(cacheKey)
  if (cached) {
    return cached
  }

  // If not in cache, fetch from API
  try {
    let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`

    if (query) {
      url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`
    }

    // For demo purposes, use mock data if no API key is available
    if (!GNEWS_API_KEY) {
      const mockData = await getMockNews(category, query)
      // Cache the results for 15 minutes
      await kv.set(cacheKey, mockData, { ex: 900 })
      return mockData
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    const formattedData: NewsResponse = {
      totalArticles: data.totalArticles || 0,
      articles: data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: article.source.url,
        },
      })),
    }

    // Cache the results for 15 minutes
    await kv.set(cacheKey, formattedData, { ex: 900 })

    return formattedData
  } catch (error) {
    console.error("Error fetching news:", error)
    // Fallback to mock data if API fails
    const mockData = await getMockNews(category, query)
    return mockData
  }
}

// Mock data for demo purposes
async function getMockNews(category: string, query: string): Promise<NewsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

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

  // If query is provided, filter articles that match the query
  const filteredArticles = query
    ? baseArticles.filter((_, i) => i < 5) // Simulate fewer results for search
    : baseArticles

  return {
    totalArticles: filteredArticles.length,
    articles: filteredArticles,
  }
}
