import type { NewsResponse, Article } from "./types"
import { kv } from "@/lib/redis"

export async function fetchNews(category = "general", query = ""): Promise<NewsResponse> {
  const cacheKey = `news:${category}:${query}`

  // Try to get from cache first
  const cached = await kv.get<NewsResponse>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    console.log(`Fetching news for category: ${category}, query: ${query}`)

    // Use our server-side API route
    const apiUrl = `/api/news?category=${encodeURIComponent(category)}&query=${encodeURIComponent(query)}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the API response to match our Article type
    const articles: Article[] = (data.articles || []).map((article: any) => ({
      title: article.title || "No title available",
      description: article.description || "No description available",
      content: article.content || article.description || "No content available",
      url: article.url || "#",
      image: article.urlToImage || article.image || null,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || "Unknown Source",
        url: article.source?.url || "#",
      },
    }))

    const result = {
      totalArticles: data.totalResults || articles.length,
      articles,
    }

    // Cache the results for 15 minutes
    await kv.set(cacheKey, result, { ex: 900 })

    return result
  } catch (error) {
    console.error("Error fetching news:", error)

    // Fall back to mock data if the API request fails
    return getMockNewsData(category, query)
  }
}

// Mock news data generator
function getMockNewsData(category = "general", query = ""): NewsResponse {
  console.log("Falling back to mock data")

  const mockCategories = {
    general: "General news about various topics",
    technology: "Technology news about AI, software, and hardware",
    business: "Business news about companies and markets",
    entertainment: "Entertainment news about movies, music, and celebrities",
    health: "Health news about medical research and wellness",
    science: "Science news about discoveries and research",
    sports: "Sports news about games, players, and teams",
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
  const queryText = query ? ` related to "${query}"` : ""
  const categoryDesc = mockCategories[category as keyof typeof mockCategories] || mockCategories.general

  // Generate mock articles
  const baseArticles: Article[] = Array(10)
    .fill(0)
    .map((_, i) => {
      const index = i + 1
      const date = new Date(Date.now() - i * 3600000)

      return {
        title: `${categoryTitle} News Article ${index}${queryText}`,
        description: `This is a sample description for a ${category} news article${queryText}. ${categoryDesc}.`,
        content: `This is the full content of the article about ${category}${queryText}. It contains more detailed information than the description.`,
        url: `https://example.com/article-${category}-${index}`,
        image: null,
        publishedAt: date.toISOString(),
        source: {
          name: `${categoryTitle} News Source`,
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
