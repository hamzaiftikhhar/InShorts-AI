"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import type { Article } from "@/lib/types"
import { cn } from "@/lib/utils"
import { summarizeArticle } from "@/lib/summarize-service"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [summary, setSummary] = useState<string | null>(article.summary || null)
  const [loading, setLoading] = useState(false)
  const [sentiment, setSentiment] = useState<"positive" | "negative" | "neutral" | null>(article.sentiment || null)

  const handleSummarize = async () => {
    if (summary) return

    setLoading(true)
    try {
      const result = await summarizeArticle(article)
      setSummary(result.summary)
      setSentiment(result.sentiment)
    } catch (error) {
      console.error("Failed to summarize article:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = () => {
    if (!sentiment) return null

    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = () => {
    if (!sentiment) return ""

    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="mt-2">
          {article.source.name} • {formatDate(article.publishedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {article.image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
          </div>
        )}

        {summary ? (
          <div className="space-y-3">
            <p className="text-sm">{summary}</p>
            {sentiment && (
              <Badge variant="outline" className={cn("flex items-center gap-1 w-fit", getSentimentColor())}>
                {getSentimentIcon()}
                <span className="capitalize">{sentiment}</span>
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
        <Button variant="outline" size="sm" asChild>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            Read Full <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
