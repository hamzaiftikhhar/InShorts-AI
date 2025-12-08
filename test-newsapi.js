#!/usr/bin/env node
/**
 * Quick test script to verify NewsAPI integration works
 * Usage: node test-newsapi.js <YOUR_API_KEY>
 */

const apiKey = process.argv[2];

if (!apiKey) {
  console.error("❌ Usage: node test-newsapi.js YOUR_NEWSAPI_KEY");
  console.error("Get a free key at https://newsapi.org/register");
  process.exit(1);
}

const NEWSAPI_BASE = "https://newsapi.org/v2";

async function testNewsAPI() {
  try {
    console.log("🔍 Testing NewsAPI with category: technology...\n");

    const url = new URL(`${NEWSAPI_BASE}/top-headlines`);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("category", "technology");
    url.searchParams.set("country", "us");
    url.searchParams.set("pageSize", "5");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data?.message || `HTTP ${response.status}`);
      process.exit(1);
    }

    if (data.status !== "ok") {
      console.error("❌ API Error:", data?.message);
      process.exit(1);
    }

    console.log(`✅ Success! Fetched ${data.articles.length} articles\n`);
    console.log("📰 Sample articles:\n");

    data.articles.slice(0, 3).forEach((article, i) => {
      console.log(`${i + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${new Date(article.publishedAt).toLocaleString()}`);
      console.log(`   Description: ${article.description?.substring(0, 100)}...\n`);
    });

    console.log("✨ NewsAPI is working correctly!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

testNewsAPI();
