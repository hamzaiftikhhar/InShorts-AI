import type { Article } from "./types"
import { kv } from "@/lib/redis"

// Get a unique key for the current user
// In a real app, you would use the user's ID
function getUserKey() {
  // For demo purposes, we'll use a fixed key
  return "user:demo"
}

export async function bookmarkArticle(article: Article): Promise<void> {
  const userKey = getUserKey()
  const bookmarksKey = `${userKey}:bookmarks`

  // Check if article is already bookmarked
  const isBookmarked = await isArticleBookmarked(article.url)

  if (isBookmarked) {
    // Remove bookmark
    await kv.hdel(bookmarksKey, article.url)
  } else {
    // Add bookmark
    await kv.hset(bookmarksKey, {
      [article.url]: JSON.stringify({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source,
        bookmarkedAt: new Date().toISOString(),
      }),
    })
  }
}

export async function isArticleBookmarked(articleUrl: string): Promise<boolean> {
  const userKey = getUserKey()
  const bookmarksKey = `${userKey}:bookmarks`

  const bookmark = await kv.hget(bookmarksKey, articleUrl)
  return !!bookmark
}

export async function getBookmarkedArticles(): Promise<Article[]> {
  const userKey = getUserKey()
  const bookmarksKey = `${userKey}:bookmarks`

  const bookmarks = await kv.hgetall(bookmarksKey)

  if (!bookmarks) return []

  return Object.values(bookmarks)
    .map((bookmark) => JSON.parse(bookmark as string))
    .sort((a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime())
}
