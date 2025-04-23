"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, ExternalLink, ImageIcon } from "lucide-react"
import type { Article } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { summarizeArticle } from "@/lib/summarize-service"
import { bookmarkArticle, isArticleBookmarked } from "@/lib/bookmark-service"

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [summary, setSummary] = useState<string | null>(article.summary || null)
  const [loading, setLoading] = useState(false)
  const [sentiment, setSentiment] = useState<"positive" | "negative" | "neutral" | null>(article.sentiment || null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Check if article is bookmarked on component mount
    const checkBookmarkStatus = async () => {
      const status = await isArticleBookmarked(article.url)
      setIsBookmarked(status)
    }

    checkBookmarkStatus()
  }, [article.url])

  const handleSummarize = async () => {
    if (summary) return

    setLoading(true)
    try {
      const result = await summarizeArticle(article)
      setSummary(result.summary)
      setSentiment(result.sentiment)
    } catch (error) {
      console.error("Failed to summarize article:", error)
      // Fallback to a basic summary if the API fails
      setSummary(`Failed to generate summary for "${article.title}". Please try again later.`)
      setSentiment("neutral")
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async () => {
    setBookmarkLoading(true)
    try {
      await bookmarkArticle(article)
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to bookmark article:", error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  // Generate a category-based background color for placeholder
  const getCategoryColor = () => {
    const categories = {
      technology: "bg-blue-100 dark:bg-blue-900",
      business: "bg-green-100 dark:bg-green-900",
      entertainment: "bg-purple-100 dark:bg-purple-900",
      health: "bg-red-100 dark:bg-red-900",
      science: "bg-teal-100 dark:bg-teal-900",
      sports: "bg-orange-100 dark:bg-orange-900",
      general: "bg-gray-100 dark:bg-gray-800",
    }

    // Try to guess category from article title or source
    const text = (article.title + " " + article.source.name).toLowerCase()

    for (const [category, color] of Object.entries(categories)) {
      if (text.includes(category)) {
        return color
      }
    }

    return categories.general
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2 pr-8">{article.title}</CardTitle>
          <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handleBookmark} disabled={bookmarkLoading}>
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            />
          </Button>
        </div>
        <CardDescription className="mt-2">
          {article.source.name} • {formatDate(article.publishedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {article.image && !imageError ? (
          <div className="mb-4 overflow-hidden rounded-md">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className={`mb-4 rounded-md w-full h-48 flex items-center justify-center ${getCategoryColor()}`}>
            <div className="text-center">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-70">{article.source.name}</p>
            </div>
          </div>
        )}

        {summary ? (
          <div className="space-y-3">
            <p className="text-sm">{summary}</p>
            {sentiment && (
              <Badge variant={sentiment === "positive" ? "default" : "outline"} className="w-fit">
                {sentiment}
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm line-clamp-3">{article.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleSummarize} disabled={loading || !!summary}>
          {loading ? "Summarizing..." : summary ? "Summarized" : "Summarize"}
        </Button>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-1"
        >
          Read Full <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  )
}
