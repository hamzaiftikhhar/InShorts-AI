import Link from "next/link"
import { Bookmark, BarChart, Newspaper } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6" />
          <span className="font-bold text-xl">NewsMate</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/bookmarks" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks</span>
          </Link>
          <Link href="/stats" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <BarChart className="h-4 w-4" />
            <span>Stats</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
