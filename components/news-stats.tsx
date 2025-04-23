import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopKeywords, getTopSources } from "@/lib/stats-service"
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function NewsStats() {
  const [keywords, setKeywords] = useState<{ name: string; value: number }[]>([])
  const [sources, setSources] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    const loadStats = async () => {
      const keywordData = await getTopKeywords()
      const sourceData = await getTopSources()

      setKeywords(keywordData)
      setSources(sourceData)
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
                  colors: COLORS,
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
                  colors: COLORS,
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
  )
}
