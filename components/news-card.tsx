"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { Article } from "@/lib/types"
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
      // Mock summarization for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSummary(
        `This is a mock summary of the article about ${article.title}. It provides key points in a concise format.`,
      )
      setSentiment(Math.random() > 0.6 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative")
    } catch (error) {
      console.error("Failed to summarize article:", error)
    } finally {
      setLoading(false)
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
        <Button variant="outline" size="sm" asChild>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            Read Full <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
