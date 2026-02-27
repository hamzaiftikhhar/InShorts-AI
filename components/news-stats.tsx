"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pie,
  PieChart,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart"

// Added a simple stats summary section
import React from 'react';

export default function NewsStats() {
  const [keywords, setKeywords] = useState<{ name: string; value: number }[]>([])
  const [sources, setSources] = useState<{ name: string; value: number }[]>([])
  const [summary, setSummary] = useState<{
    totalArticles?: number
    avgSummaryLength?: number
    avgReadTimeMinutes?: number
    bookmarkedArticles?: number
  }>({})
  const [sentiment, setSentiment] = useState<{ name: string; value: number }[]>([])
  const [articlesPerDay, setArticlesPerDay] = useState<{ date: string; count: number }[]>([])
  const [authors, setAuthors] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`/api/stats`)
        const data = await res.json()
        setKeywords(data.keywords || [])
        setSources(data.sources || [])
        setSummary(data.summary || {})
        setSentiment(data.sentiment || [])
        setArticlesPerDay(data.articlesPerDay || [])
        setAuthors(data.topAuthors || [])
      } catch (err) {
        console.error("Failed to load stats", err)
      }
    }

    loadStats()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const renderPie = (data: { name: string; value: number }[], colors: string[]) => {
    return (
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.totalArticles ?? "—"}</div>
            <div className="text-muted-foreground text-sm">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Summary Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.avgSummaryLength ? `${summary.avgSummaryLength} words` : "—"}</div>
            <div className="text-muted-foreground text-sm">Per article</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Read Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.avgReadTimeMinutes ? `${summary.avgReadTimeMinutes} min` : "—"}</div>
            <div className="text-muted-foreground text-sm">Estimated</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bookmarked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.bookmarkedArticles ?? 0}</div>
            <div className="text-muted-foreground text-sm">By you</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Articles — Last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesPerDay.length > 0 ? (
              <ChartContainer
                config={{
                  count: { label: "Articles" },
                }}
                className="h-[240px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={articlesPerDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              {sentiment.length > 0 ? (
                <ChartContainer
                  config={{
                    sentiment: { label: "Sentiment" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {renderPie(sentiment, COLORS)}
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Authors</CardTitle>
            </CardHeader>
            <CardContent>
              {authors.length > 0 ? (
                <ChartContainer
                  config={{
                    authors: { label: "Articles by Author" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={authors} layout="vertical" margin={{ left: 0, right: 10 }}>
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill={COLORS[1]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Keyword & Source charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            {keywords.length > 0 ? (
              <ChartContainer
                config={{
                  keywords: {
                    label: "Keywords",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {renderPie(keywords, COLORS)}
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <ChartContainer
                config={{
                  sources: {
                    label: "Sources",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {renderPie(sources, COLORS)}
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
