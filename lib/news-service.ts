import type { NewsResponse, Article } from "./types"
import { kv } from "@/lib/redis"

// You'll need to get an API key from a service like NewsAPI, GNews, etc.
const NEWS_API_KEY = process.env.NEWS_API_KEY || "your_api_key_here"
const NEWS_API_URL = "https://gnews.io/api/v4"

export async function fetchNews(category = "general", query = ""): Promise<NewsResponse> {
  const cacheKey = `news:${category}:${query}`

  // Try to get from cache first
  const cached = await kv.get<NewsResponse>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Build the API URL
    let apiUrl = `${NEWS_API_URL}/top-headlines?category=${category}&lang=en&apikey=${NEWS_API_KEY}`

    if (query) {
      apiUrl = `${NEWS_API_URL}/search?q=${encodeURIComponent(query)}&lang=en&apikey=${NEWS_API_KEY}`
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the API response to match our Article type
    const articles: Article[] = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description || "No description available",
      content: article.content || "No content available",
      url: article.url,
      image: article.image || "/placeholder.svg?height=400&width=600&text=No+Image",
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
        url: article.source.url || "#",
      },
    }))

    const result = {
      totalArticles: data.totalArticles || articles.length,
      articles,
    }

    // Cache the results for 15 minutes
    await kv.set(cacheKey, result, { ex: 900 })

    return result
  } catch (error) {
    console.error("Error fetching news:", error)

    // Fallback to mock data if API fails
    return fallbackMockData(category, query)
  }
}

// Fallback mock data in case the API fails
function fallbackMockData(category = "general", query = ""): NewsResponse {
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
