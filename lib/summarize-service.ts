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
    // For a real implementation, you would use an AI service like OpenAI
    // This is a simplified example using fetch to an AI service
    const AI_API_KEY = process.env.OPENAI_API_KEY || process.env.AI_API_KEY

    if (!AI_API_KEY) {
      // Fallback to mock summarization if no API key
      return mockSummarization(article)
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes news articles and determines their sentiment.",
          },
          {
            role: "user",
            content: `Summarize this article in 2-3 sentences and determine if the sentiment is positive, negative, or neutral. Title: ${article.title}. Content: ${article.description} ${article.content}`,
          },
        ],
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Extract summary and sentiment from AI response
    // This is a simple approach - you might need more sophisticated parsing
    let sentiment: "positive" | "negative" | "neutral" = "neutral"

    if (aiResponse.toLowerCase().includes("positive")) {
      sentiment = "positive"
    } else if (aiResponse.toLowerCase().includes("negative")) {
      sentiment = "negative"
    }

    const summary = aiResponse.replace(/sentiment:.*$/i, "").trim()

    const result = { summary, sentiment }

    // Cache the result for 24 hours
    await kv.set(cacheKey, result, { ex: 86400 })

    return result
  } catch (error) {
    console.error("Error summarizing article:", error)
    return mockSummarization(article)
  }
}

// Fallback mock summarization
function mockSummarization(article: Article) {
  // Determine sentiment based on some keywords
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  const positiveWords = ["success", "breakthrough", "win", "positive", "good", "great", "excellent"]
  const negativeWords = ["failure", "crisis", "loss", "negative", "bad", "terrible", "disaster"]

  const text = (article.title + " " + article.description).toLowerCase()

  if (positiveWords.some((word) => text.includes(word))) {
    sentiment = "positive"
  } else if (negativeWords.some((word) => text.includes(word))) {
    sentiment = "negative"
  }

  // Generate a summary
  const summary = `${article.title}. ${article.description.split(".")[0]}. This article provides information about ${article.source.name}'s coverage of this topic.`

  return {
    summary: summary.substring(0, 200), // Limit to 200 characters
    sentiment,
  }
}
