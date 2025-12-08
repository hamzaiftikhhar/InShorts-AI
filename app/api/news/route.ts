import { NextResponse } from "next/server"
import { fetchNews } from "@/lib/news-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category") || "general"
    const query = url.searchParams.get("query") || ""

    const data = await fetchNews(category, query)
    return NextResponse.json(data)
  } catch (err) {
    console.error("/api/news error", err)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
