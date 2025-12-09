"use client"

import { useEffect, useState } from "react"
import NewsCard from "@/components/news-card"
import type { Article } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function BookmarkedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const loadBookmarksFromStorage = () => {
    try {
      const raw = localStorage.getItem("newsmate:bookmarks")
      if (!raw) {
        setArticles([])
        return
      }

      const bookmarksObj = JSON.parse(raw)
      const arr = Object.values(bookmarksObj)
        .map((b) => (typeof b === "string" ? JSON.parse(b) : b))
        .sort((a: Article, b: Article) => new Date(b.bookmarkedAt!).getTime() - new Date(a.bookmarkedAt!).getTime())
      setArticles(arr)
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error)
      setArticles([])
    }
  }

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const res = await fetch(`/api/bookmarks`)
        if (res.ok) {
          const data = await res.json()
          setArticles(data.articles || [])
          setLoading(false)
          return
        }
      } catch (error) {
        // fallthrough to localStorage fallback
      }

      // Fallback to localStorage bookmarks when server is not available
      loadBookmarksFromStorage()
      setLoading(false)
    }

    loadBookmarks()

    // Listen for storage changes (cross-tab sync and same-tab updates)
    const handleStorageChange = () => {
      loadBookmarksFromStorage()
    }
    window.addEventListener("storage", handleStorageChange)

    // Listen for custom bookmarksChanged event (fired when bookmarks are toggled on same tab)
    const handleBookmarksChanged = () => {
      loadBookmarksFromStorage()
    }
    window.addEventListener("bookmarksChanged", handleBookmarksChanged)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("bookmarksChanged", handleBookmarksChanged)
    }
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
