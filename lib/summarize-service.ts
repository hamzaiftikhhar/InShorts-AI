import type { Article } from "./types"
import { kv } from "@/lib/redis"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function summarizeArticle(article: Article) {
  const cacheKey = `summary:${article.url}`

  // Try to get from cache first
  const cached = await kv.get<{ summary: string; sentiment: "positive" | "negative" | "neutral" }>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Combine title, description and content for better summarization
    const content = `Title: ${article.title}\nDescription: ${article.description}\nContent: ${article.content}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Summarize the following news article in 30-70 words. 
        Also analyze the sentiment of the article (positive, negative, or neutral).
        Format your response as JSON with two fields: "summary" and "sentiment".
        
        Article:
        ${content}
      `,
    })

    // Parse the response
    let result
    try {
      result = JSON.parse(text)
    } catch (e) {
      // If parsing fails, extract summary and sentiment manually
      const summaryMatch = text.match(/summary["\s:]+([^"]+)/i)
      const sentimentMatch = text.match(/sentiment["\s:]+([^"]+)/i)

      result = {
        summary: summaryMatch ? summaryMatch[1].trim() : "Failed to generate summary.",
        sentiment: sentimentMatch ? sentimentMatch[1].trim().toLowerCase() : "neutral",
      }
    }

    // Validate sentiment
    if (!["positive", "negative", "neutral"].includes(result.sentiment)) {
      result.sentiment = "neutral"
    }

    // Cache the result for 24 hours
    await kv.set(cacheKey, result, { ex: 86400 })

    return result
  } catch (error) {
    console.error("Error summarizing article:", error)
    return {
      summary: "Failed to generate summary due to an error.",
      sentiment: "neutral" as const,
    }
  }
}
