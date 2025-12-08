import { NextResponse } from "next/server"
import { getTopKeywords, getTopSources } from "@/lib/stats-service"

export async function GET() {
  try {
    const keywords = await getTopKeywords()
    const sources = await getTopSources()
    return NextResponse.json({ keywords, sources })
  } catch (err) {
    console.error("/api/stats error", err)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
