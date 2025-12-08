# NewsMate AI - Intelligent News Summarization

An AI-powered news aggregation and summarization platform built with Next.js, OpenAI, and NewsAPI.

## Features

- **Real-time News Fetching**: Integrates with NewsAPI.org to fetch latest news across multiple categories
- **AI Summarization**: Uses OpenAI GPT models to create concise, intelligent summaries of news articles
- **Sentiment Analysis**: Automatically detects sentiment (positive, negative, neutral) for each article
- **Smart Caching**: Redis-backed caching to minimize API calls and improve performance
- **Category Filtering**: Browse news by categories (technology, business, health, sports, etc.)
- **Bookmarking**: Save your favorite articles for later reading
- **Search**: Search for news articles by keywords
- **Responsive Design**: Mobile-friendly interface with light/dark theme support

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- NewsAPI key (free at https://newsapi.org)
- OpenAI API key (from https://platform.openai.com)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```env
   NEWSAPI_KEY=your_newsapi_key
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting API Keys

### NewsAPI.org
1. Visit https://newsapi.org
2. Sign up for a free account
3. Copy your API key and add it to `.env.local` as `NEWSAPI_KEY`

### OpenAI
1. Visit https://platform.openai.com/account/api-keys
2. Create a new API key
3. Add it to `.env.local` as `OPENAI_API_KEY`
4. Ensure you have billing enabled to avoid issues

## Architecture

- **`lib/news-service.ts`**: Fetches news from NewsAPI with caching and fallback support
- **`lib/summarize-service.ts`**: Generates AI summaries and sentiment analysis using OpenAI
- **`components/news-feed.tsx`**: Main feed component displaying news articles
- **`components/news-card.tsx`**: Individual article card with summary, sentiment, and actions
- **`components/search-filters.tsx`**: Search and category filtering
- **`app/api/`**: Backend API routes for summarization

## Project Structure

```
app/
  ├── api/           # API routes
  ├── bookmarks/     # Bookmarked articles page
  ├── stats/         # News statistics page
  └── page.tsx       # Home page
components/
  ├── news-card.tsx            # Article display
  ├── news-feed.tsx            # Feed container
  ├── search-filters.tsx       # Search and filters
  ├── bookmarked-articles.tsx  # Bookmarks list
  └── ui/                      # UI components
lib/
  ├── news-service.ts          # News fetching
  ├── summarize-service.ts     # AI summarization
  ├── bookmark-service.ts      # Bookmark management
  └── types.ts                 # TypeScript types
```

## How It Works

1. **Fetch News**: The app fetches articles from NewsAPI based on selected category or search query
2. **Summarize**: Each article is summarized using OpenAI's GPT model (concise 2-3 sentence summary)
3. **Sentiment Analysis**: The AI also analyzes sentiment (positive/negative/neutral)
4. **Cache Results**: Summaries and news are cached in Redis to reduce API calls
5. **Display**: Articles are shown in card format with title, image, summary, sentiment badge, and actions

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Deploy on Vercel

The easiest way to deploy your app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy
