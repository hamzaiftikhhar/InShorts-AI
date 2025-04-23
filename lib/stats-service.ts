export async function getTopKeywords(): Promise<{ name: string; value: number }[]> {
  // In a real app, you would analyze articles to extract keywords
  // For demo purposes, we'll return mock data

  return [
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Politics", value: 20 },
    { name: "Health", value: 15 },
    { name: "Sports", value: 5 },
  ]
}

export async function getTopSources(): Promise<{ name: string; value: number }[]> {
  // In a real app, you would count articles by source
  // For demo purposes, we'll return mock data

  return [
    { name: "Tech News", value: 30 },
    { name: "Business Daily", value: 25 },
    { name: "World Report", value: 20 },
    { name: "Health Journal", value: 15 },
    { name: "Sports Center", value: 10 },
  ]
}
