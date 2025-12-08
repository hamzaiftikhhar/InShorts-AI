"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import NewsCard from "@/components/news-card"
import type { Article } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function NewsFeed() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get("category") || "general"
  const query = searchParams.get("query") || ""

  useEffect(() => {
    setLoading(true)
    setArticles([])

    const loadNews = async () => {
      try {
        const res = await fetch(`/api/news?category=${encodeURIComponent(category)}&query=${encodeURIComponent(query)}`)
        const data = await res.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [category, query])

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
        <h3 className="text-xl font-semibold">No articles found</h3>
        <p className="text-muted-foreground mt-2">Try changing your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.url} article={article} />
      ))}
    </div>
  )
}
