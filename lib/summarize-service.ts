import type { Article } from "./types"
import { kv } from "@/lib/redis"

type SummaryResult = { summary: string; sentiment: "positive" | "negative" | "neutral" }

export async function summarizeArticle(article: Article): Promise<SummaryResult> {
  const cacheKey = `summary:${article.url}`

  // Try to get from cache first
  const cached = await kv.get<SummaryResult>(cacheKey)
  if (cached) return cached

  const openaiKey = process.env.OPENAI_API_KEY

  // If no OpenAI key, fall back to a light local summary (mock)
  if (!openaiKey) {
    // simple fallback summarization + naive sentiment
    const title = article.title || ""
    const description = article.description || article.content || ""
    const text = (title + " " + description).toLowerCase()

    let sentiment: SummaryResult["sentiment"] = "neutral"
    const positiveWords = ["success", "breakthrough", "win", "positive", "good", "great", "excellent"]
    const negativeWords = ["failure", "crisis", "loss", "negative", "bad", "terrible", "disaster"]
    if (positiveWords.some((w) => text.includes(w))) sentiment = "positive"
    else if (negativeWords.some((w) => text.includes(w))) sentiment = "negative"

    const summary = (title ? title + ". " : "") + (description.split(".")[0] || "")

    const result = { summary: summary.substring(0, 300), sentiment }
    await kv.set(cacheKey, result, { ex: 86400 })
    return result
  }

  // Use OpenAI Chat Completions to generate a short summary and sentiment
  try {
    const prompt = `Summarize the following news article in 2-3 short sentences (max 280 characters) and then output a sentiment label (positive, negative, neutral) as JSON with keys: summary and sentiment.\n\nArticle:\nTitle: ${article.title}\nDescription: ${article.description}\nContent: ${article.content}`

    const body = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes news concisely and outputs JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.2,
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error(`OpenAI error ${res.status}`)

    const data = await res.json()
    const text = (data?.choices?.[0]?.message?.content || "").trim()

    // Try to parse JSON from the model response. If it isn't pure JSON, attempt to extract JSON substring.
    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      const start = text.indexOf("{")
      const end = text.lastIndexOf("}")
      if (start !== -1 && end !== -1) {
        try {
          parsed = JSON.parse(text.substring(start, end + 1))
        } catch (err) {
          parsed = null
        }
      }
    }

    let summary = ""
    let sentiment: SummaryResult["sentiment"] = "neutral"

    if (parsed && parsed.summary) summary = String(parsed.summary)
    else summary = text.split("\n")[0] || text

    if (parsed && parsed.sentiment) {
      const s = String(parsed.sentiment).toLowerCase()
      if (s.includes("positive")) sentiment = "positive"
      else if (s.includes("negative")) sentiment = "negative"
      else sentiment = "neutral"
    } else {
      // fallback naive sentiment
      const lc = summary.toLowerCase()
      if (/[\b]good\b|\bpositive\b|\bwin\b|\bsuccess\b/.test(lc)) sentiment = "positive"
      else if (/[\b]bad\b|\bnegative\b|\bcrisis\b|\bloss\b|\bdisaster\b/.test(lc)) sentiment = "negative"
      else sentiment = "neutral"
    }

    const result = { summary: summary.substring(0, 500), sentiment }
    await kv.set(cacheKey, result, { ex: 86400 })
    return result
  } catch (err) {
    console.error("summarizeArticle error", err)
    // fallback simple local summary
    const title = article.title || ""
    const description = article.description || article.content || ""
    const text = (title + " " + description).toLowerCase()
    let sentiment: SummaryResult["sentiment"] = "neutral"
    const positiveWords = ["success", "breakthrough", "win", "positive", "good", "great", "excellent"]
    const negativeWords = ["failure", "crisis", "loss", "negative", "bad", "terrible", "disaster"]
    if (positiveWords.some((w) => text.includes(w))) sentiment = "positive"
    else if (negativeWords.some((w) => text.includes(w))) sentiment = "negative"

    const summary = (title ? title + ". " : "") + (description.split(".")[0] || "")
    const result = { summary: summary.substring(0, 300), sentiment }
    await kv.set(cacheKey, result, { ex: 86400 })
    return result
  }
}
