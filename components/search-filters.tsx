"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

const categories = [
  { value: "general", label: "General" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
]

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "general")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(category, searchQuery)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateFilters(value, searchQuery)
  }

  const updateFilters = (category: string, query: string) => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (query) params.set("query", query)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <Tabs value={category} onValueChange={handleCategoryChange}>
        <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-md">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search news..."
            className="pl-8 bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100"
        >
          Search
        </Button>
      </form>
    </div>
  )
}
