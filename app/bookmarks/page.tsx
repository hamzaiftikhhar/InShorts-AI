import { Suspense } from "react"
import BookmarkedArticles from "@/components/bookmarked-articles"
import { Skeleton } from "@/components/ui/skeleton"

export default function BookmarksPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Bookmarked Articles</h1>
        <Suspense fallback={<BookmarksSkeleton />}>
          <BookmarkedArticles />
        </Suspense>
      </div>
    </main>
  )
}

function BookmarksSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
    </div>
  )
}
