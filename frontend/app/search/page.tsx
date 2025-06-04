"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery) {
      setProducts([])
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(`api/products?search=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to search products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
    searchProducts(query)
  }

  useEffect(() => {
    if (initialQuery) {
      searchProducts(initialQuery)
    }
  }, [initialQuery])

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Search Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Searching products...</p>
        </div>
      ) : (
        <>
          {initialQuery && (
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                {products.length === 0
                  ? "No results found"
                  : `Found ${products.length} result${products.length === 1 ? "" : "s"} for "${initialQuery}"`}
              </h2>
            </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  category={product.category}
                  condition={product.condition}
                  image={product.images[0] || "/placeholder.svg?height=300&width=300"}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
