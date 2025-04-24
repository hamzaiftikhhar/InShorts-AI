import type { Article } from "./types"
import { kv } from "@/lib/redis"

export async function summarizeArticle(article: Article) {
  const cacheKey = `summary:${article.url}`

  // Try to get from cache first
  const cached = await kv.get<{ summary: string; sentiment: "positive" | "negative" | "neutral" }>(cacheKey)
  if (cached) {
    return cached
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a mock summary based on the article title and description
  const title = article.title
  const description = article.description

  // Determine sentiment based on some keywords
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  const positiveWords = ["success", "breakthrough", "win", "positive", "good", "great", "excellent"]
  const negativeWords = ["failure", "crisis", "loss", "negative", "bad", "terrible", "disaster"]

  const text = (title + " " + description).toLowerCase()

  if (positiveWords.some((word) => text.includes(word))) {
    sentiment = "positive"
  } else if (negativeWords.some((word) => text.includes(word))) {
    sentiment = "negative"
  }

  // Generate a summary
  const summary = `${title}. ${description.split(".")[0]}. This article provides information about ${article.source.name}'s coverage of this topic.`

  const result = {
    summary: summary.substring(0, 200), // Limit to 200 characters
    sentiment,
  }

  // Cache the result for 24 hours
  await kv.set(cacheKey, result, { ex: 86400 })

  return result
}
