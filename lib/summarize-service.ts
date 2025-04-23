import type { Article } from "./types";
import { kv } from "@/lib/redis";

// Mock implementation of summarizeArticle
export async function summarizeArticle(article: Article) {
  const cacheKey = `summary:${article.url}`;

  // Try to get from cache first
  const cached = await kv.get<{ summary: string; sentiment: "positive" | "negative" | "neutral" }>(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate a mock summary based on the article title and description
  const title = article.title || "";
  const description = article.description || "";
  
  // Determine sentiment based on keywords in the title and description
  let sentiment: "positive" | "negative" | "neutral" = "neutral";
  const text = (title + " " + description).toLowerCase();
  
  const positiveWords = ["good", "great", "excellent", "amazing", "positive", "success", "win", "breakthrough"];
  const negativeWords = ["bad", "terrible", "awful", "negative", "fail", "crisis", "problem", "disaster"];
  
  const hasPositive = positiveWords.some(word => text.includes(word));
  const hasNegative = negativeWords.some(word => text.includes(word));
  
  if (hasPositive && !hasNegative) sentiment = "positive";
  else if (hasNegative && !hasPositive) sentiment = "negative";
  
  // Create a simple summary by combining parts of the title and description
  const titleWords = title.split(" ").slice(0, 5).join(" ");
  const descWords = description.split(" ").slice(0, 15).join(" ");
  
  const result = {
    summary: `${titleWords}... ${descWords}...`,
    sentiment
  };
  
  // Cache the result
  await kv.set(cacheKey, result, { ex: 86400 });
  
  return result;
}
