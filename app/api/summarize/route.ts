import { NextResponse } from "next/server"
import { summarizeArticle } from "@/lib/summarize-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const article = body.article
    if (!article || !article.url) {
      return NextResponse.json({ error: "Missing article data" }, { status: 400 })
    }

    const result = await summarizeArticle(article)
    return NextResponse.json(result)
  } catch (err) {
    console.error("/api/summarize error", err)
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 })
  }
}
