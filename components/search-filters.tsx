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
        <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-slate-100">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search news..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    </div>
  )
}
