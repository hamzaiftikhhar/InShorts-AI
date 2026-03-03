import Link from "next/link"
import { Bookmark, BarChart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="glass border-b border-border animate-fade-up">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-current flex items-center justify-center rounded-md glass/hover p-0.5">
            <div className="w-3 h-3 border-t-2 border-l-2 border-current"></div>
          </div>
          <span className="font-bold text-xl">NewsMate</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/bookmarks"
            className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 active:bg-white/10 px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-700"
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks</span>
          </Link>

          <Link
            href="/stats"
            className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 active:bg-white/10 px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-700"
          >
            <BarChart className="h-4 w-4" />
            <span>Stats</span>
          </Link>

          <ThemeToggle />
          <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center text-gray-500 ml-2">U</span>
        </div>
      </div>
    </header>
  )
}
