"use client"

import { useEffect, useState } from "react"
import NewsCard from "@/components/news-card"
import type { Article } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function BookmarkedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const res = await fetch(`/api/bookmarks`)
        const data = await res.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookmarks()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold">No bookmarked articles</h3>
        <p className="text-muted-foreground mt-2">Bookmark articles to save them for later reading</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.url} article={article} />
        ))}
      </div>
    </div>
  )
}
