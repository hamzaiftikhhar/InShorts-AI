import { NextResponse } from "next/server"
import { bookmarkArticle, isArticleBookmarked, getBookmarkedArticles } from "@/lib/bookmark-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const articleUrl = url.searchParams.get("url")
    if (articleUrl) {
      const status = await isArticleBookmarked(articleUrl)
      return NextResponse.json({ isBookmarked: status })
    }

    const list = await getBookmarkedArticles()
    return NextResponse.json({ articles: list })
  } catch (err) {
    console.error("/api/bookmarks GET error", err)
    return NextResponse.json({ error: "Failed to read bookmarks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const article = body.article
    if (!article || !article.url) return NextResponse.json({ error: "Missing article" }, { status: 400 })

    await bookmarkArticle(article)
    const status = await isArticleBookmarked(article.url)
    return NextResponse.json({ ok: true, isBookmarked: status })
  } catch (err) {
    console.error("/api/bookmarks POST error", err)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
