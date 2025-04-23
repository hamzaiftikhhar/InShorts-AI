import type { Article } from "./types"
import { kv } from "@/lib/redis"

export async function summarizeArticle(article: Article) {
  const cacheKey = `summary:${article.url}`

  // Try to get from cache first
  const cached = await kv.get<{ summary: string; sentiment: "positive" | "negative" | "neutral" }>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Try to use the OpenAI API for summarization
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content || article.description,
      }),
    })

    if (!response.ok) {
      throw new Error(`Summarization API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache the result for 24 hours
    await kv.set(cacheKey, data, { ex: 86400 })

    return data
  } catch (error) {
    console.error("Error summarizing article:", error)
    return generateMockSummary(article)
  }
}

function generateMockSummary(article: Article) {
  // Determine sentiment based on some keywords
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  const positiveWords = ["success", "breakthrough", "win", "positive", "good", "great", "excellent", "improve"]
  const negativeWords = ["failure", "crisis", "loss", "negative", "bad", "terrible", "disaster", "decline"]

  const text = (article.title + " " + article.description).toLowerCase()

  if (positiveWords.some((word) => text.includes(word))) {
    sentiment = "positive"
  } else if (negativeWords.some((word) => text.includes(word))) {
    sentiment = "negative"
  }

  // Extract key sentences for the summary
  const sentences = article.description.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const title = article.title.replace(/[.!?]+$/, "")

  // Create a more sophisticated mock summary
  let summary = title

  if (sentences.length > 0) {
    // Add the first sentence if it's not too similar to the title
    if (
      !title.toLowerCase().includes(sentences[0].trim().toLowerCase()) &&
      !sentences[0].trim().toLowerCase().includes(title.toLowerCase())
    ) {
      summary += ". " + sentences[0].trim()
    }

    // Add another sentence if available
    if (sentences.length > 1) {
      summary += ". " + sentences[1].trim()
    }
  }

  // Add a generic conclusion
  summary += `. This article from ${article.source.name} provides insights on this topic.`

  return {
    summary: summary.substring(0, 280), // Limit to 280 characters (like a tweet)
    sentiment,
  }
}
