import { NextResponse } from "next/server"
import {
  getTopKeywords,
  getTopSources,
  getSummaryStats,
  getSentimentBreakdown,
  getArticlesPerDay,
  getTopAuthors,
} from "@/lib/stats-service"

export async function GET() {
  try {
    const [keywords, sources, summary, sentiment, articlesPerDay, topAuthors] = await Promise.all([
      getTopKeywords(),
      getTopSources(),
      getSummaryStats(),
      getSentimentBreakdown(),
      getArticlesPerDay(),
      getTopAuthors(),
    ])

    return NextResponse.json({ keywords, sources, summary, sentiment, articlesPerDay, topAuthors })
  } catch (err) {
    console.error("/api/stats error", err)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
