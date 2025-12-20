import { getBookmarkedArticles } from "./bookmark-service"

export async function getTopKeywords(): Promise<{ name: string; value: number }[]> {
  // In a real app, you would analyze articles to extract keywords
  // For demo purposes, we'll return mock data

  return [
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Politics", value: 20 },
    { name: "Health", value: 15 },
    { name: "Sports", value: 5 },
  ]
}

export async function getTopSources(): Promise<{ name: string; value: number }[]> {
  // In a real app, you would count articles by source
  // For demo purposes, we'll return mock data

  return [
    { name: "Tech News", value: 30 },
    { name: "Business Daily", value: 25 },
    { name: "World Report", value: 20 },
    { name: "Health Journal", value: 15 },
    { name: "Sports Center", value: 10 },
  ]
}

export async function getSummaryStats() {
  // Return some high-level KPIs. Replace with real calculations later.
  const bookmarked = await getBookmarkedArticles()

  return {
    totalArticles: 125,
    avgSummaryLength: 56, // words
    avgReadTimeMinutes: 3.4,
    bookmarkedArticles: bookmarked.length,
  }
}

export async function getSentimentBreakdown(): Promise<{ name: string; value: number }[]> {
  // Mock sentiment distribution
  return [
    { name: "Positive", value: 52 },
    { name: "Neutral", value: 30 },
    { name: "Negative", value: 18 },
  ]
}

export async function getArticlesPerDay(): Promise<{ date: string; count: number }[]> {
  // Return mock counts for the last 7 days
  const days = [6, 5, 4, 3, 2, 1, 0]
  const now = new Date()

  return days.map((d) => {
    const date = new Date(now)
    date.setDate(now.getDate() - d)
    return {
      date: date.toISOString().slice(0, 10),
      count: Math.floor(20 + Math.random() * 60),
    }
  })
}

export async function getTopAuthors(): Promise<{ name: string; value: number }[]> {
  return [
    { name: "Alice", value: 28 },
    { name: "Bob", value: 22 },
    { name: "Charlie", value: 15 },
    { name: "Dana", value: 12 },
    { name: "Eve", value: 8 },
  ]
}
