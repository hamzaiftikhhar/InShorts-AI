import type { NewsResponse, Article } from "./types"
import { kv } from "@/lib/redis"

export async function fetchNews(category = "general", query = ""): Promise<NewsResponse> {
  const cacheKey = `news:${category}:${query}`

  // Try to get from cache first
  const cached = await kv.get<NewsResponse>(cacheKey)
  if (cached) {
    return cached
  }

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

  const result = {
    totalArticles: filteredArticles.length,
    articles: filteredArticles,
  }

  // Cache the results for 15 minutes
  await kv.set(cacheKey, result, { ex: 900 })

  return result
}
