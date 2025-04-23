import Link from "next/link"
import { Newspaper } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6" />
          <span className="font-bold text-xl">NewsMate</span>
        </Link>
      </div>
    </header>
  )
}

