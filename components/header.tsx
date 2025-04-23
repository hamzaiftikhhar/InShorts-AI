import Link from "next/link"
import { Bookmark, BarChart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-current flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-l-2 border-current"></div>
          </div>
          <span className="font-bold text-xl">NewsMate</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/bookmarks" className="flex items-center space-x-1 text-sm font-medium">
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks</span>
          </Link>
          <Link href="/stats" className="flex items-center space-x-1 text-sm font-medium">
            <BarChart className="h-4 w-4" />
            <span>Stats</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
