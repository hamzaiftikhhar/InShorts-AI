export interface Article {
    title: string
    description: string
    content: string
    url: string
    image: string
    publishedAt: string
    source: {
      name: string
      url: string
    }
    summary?: string
    sentiment?: "positive" | "negative" | "neutral"
  }
  
  export interface NewsResponse {
    totalArticles: number
    articles: Article[]
  }
  