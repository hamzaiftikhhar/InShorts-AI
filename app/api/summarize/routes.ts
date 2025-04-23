import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured")
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes news articles and determines their sentiment.",
          },
          {
            role: "user",
            content: `Summarize this article in 2-3 sentences and determine if the sentiment is positive, negative, or neutral. Title: ${title}. Content: ${content}`,
          },
        ],
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error(`OpenAI API error: ${response.status}`, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Extract sentiment from AI response
    let sentiment: "positive" | "negative" | "neutral" = "neutral"

    if (aiResponse.toLowerCase().includes("positive")) {
      sentiment = "positive"
    } else if (aiResponse.toLowerCase().includes("negative")) {
      sentiment = "negative"
    }

    // Clean up the summary
    const summary = aiResponse.replace(/sentiment:.*$/i, "").trim()

    return NextResponse.json({ summary, sentiment })
  } catch (error) {
    console.error("Error in summarize API:", error)

    // Return a generic summary as fallback
    const { title } = await request.json()
    return NextResponse.json({
      summary: `This article discusses ${title}. It provides information on this topic.`,
      sentiment: "neutral",
    })
  }
}
