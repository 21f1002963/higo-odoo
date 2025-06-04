"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductCategoryFilterProps {
  categories: string[]
}

export function ProductCategoryFilter({ categories }: ProductCategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "All"

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString()) // Preserve other search params
    if (value === "All") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    // Navigate to /products page with new category
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select onValueChange={handleCategoryChange} defaultValue={currentCategory}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category === "All" ? "All Categories" : category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
