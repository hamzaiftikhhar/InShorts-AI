import { Suspense } from "react"
import NewsStats from "@/components/news-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatsPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">News Analytics</h1>
        <Suspense fallback={<StatsSkeleton />}>
          <NewsStats />
        </Suspense>
      </div>
    </main>
  )
}

function StatsSkeleton() {
  return (
    <div className="space-y-6">
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
    </div>
  )
}
