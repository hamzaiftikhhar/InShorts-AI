import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="glass rounded-[var(--radius-lg)] p-8 md:p-12 animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Your daily news, summarized by AI</h1>
          <p className="text-muted-foreground max-w-xl">Stay informed with concise AI summaries, personalized topics, and an intuitive, beautiful reading experience. Tap into the highlights in seconds.</p>

          <div className="flex items-center space-x-3 mt-4">
            <Link href="/stats">
              <Button size="default">Explore Stats</Button>
            </Link>
            <Link href="/bookmarks">
              <Button variant="outline" size="default">Your Bookmarks</Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">Tip: Use the theme toggle to try the glass look or turn off animations if preferred.</div>
        </div>

        <div className="relative">
          <div className="glass rounded-[calc(var(--radius-lg)+4px)] p-6 md:p-8 shadow-2xl animate-float">
            <div className="text-sm text-muted-foreground">Headlines</div>
            <ul className="mt-3 space-y-2">
              <li className="text-sm">AI startup raises Series B to scale news summarization</li>
              <li className="text-sm">New study shows surprising health trends this year</li>
              <li className="text-sm">Global markets react to latest policy announcements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}