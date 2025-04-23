import NewsFeed from "@/news-feed"
import SearchFilters from "@/components/search-filters"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        <SearchFilters />
        <NewsFeed />
      </div>
    </main>
  )
}
