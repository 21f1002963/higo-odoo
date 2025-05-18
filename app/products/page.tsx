import { Suspense } from "react"
import { Filter, Grid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCategoryFilter } from "@/components/ui/product-category-filter"

async function getProducts(searchParams: { category?: string; search?: string }) {
  try {
    const params = new URLSearchParams()

    if (searchParams.category) {
      params.append("category", searchParams.category)
    }

    if (searchParams.search) {
      params.append("search", searchParams.search)
    }

    // Ensure NEXT_PUBLIC_APP_URL is set in your .env.local or environment variables
    // e.g., NEXT_PUBLIC_APP_URL=http://localhost:3000
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""; 
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    return res.json()
  } catch (error) {
    console.error("Error loading products:", error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const products = await getProducts(searchParams)

  const categories = ["All", "Electronics", "Clothing", "Furniture", "Books", "Home", "Sports", "Toys", "Other"]

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Browse our collection of second-hand items</p>
        </div>
        <div className="flex items-center gap-2">
          <ProductCategoryFilter categories={categories} />
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                price={product.price}
                category={product.category}
                condition={product.condition}
                image={product.images[0] || "/placeholder.svg?height=300&width=300"}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  )
}
