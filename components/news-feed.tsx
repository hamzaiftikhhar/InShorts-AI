"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import NewsCard from "@/components/news-card"
import { fetchNews } from "@/lib/news-service"
import type { Article } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function NewsFeed() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const category = searchParams.get("category") || "general"
  const query = searchParams.get("query") || ""

  useEffect(() => {
    setLoading(true)
    setArticles([])
    setError(null)

    const loadNews = async () => {
      try {
        const data = await fetchNews(category, query)
        setArticles(data.articles)
      } catch (error) {
        console.error("Failed to fetch news:", error)
        setError("Failed to load news. Using sample data instead.")

        // Try to load mock data as fallback
        try {
          const mockData = await fetchNews(category, query)
          setArticles(mockData.articles)
        } catch (fallbackError) {
          console.error("Failed to load fallback data:", fallbackError)
        }
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
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    </div>
  )
}
