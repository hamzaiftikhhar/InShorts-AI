import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category") || "general"
  const query = searchParams.get("query") || ""

  const NEWS_API_KEY = process.env.NEWS_API_KEY

  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: "News API key is not configured" }, { status: 500 })
  }

  try {
    // Build the API URL based on the parameters
    let apiUrl: string

    if (query) {
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&apiKey=${NEWS_API_KEY}`
    } else {
      apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${NEWS_API_KEY}`
    }

    console.log(`Fetching news from: ${apiUrl.replace(NEWS_API_KEY, "API_KEY_HIDDEN")}`)

    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`News API error (${response.status}): ${errorText}`)
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}
