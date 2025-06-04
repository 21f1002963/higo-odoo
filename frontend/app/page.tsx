import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton

async function getProducts() {
  try {
    // Use relative URL
    const res = await fetch(`/api/products?limit=6`, {
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

export default async function Home() {
  const products = await getProducts()

  const categories = [
    { name: "Electronics", image: "/placeholder.svg?height=200&width=200" },
    { name: "Clothing", image: "/placeholder.svg?height=200&width=200" },
    { name: "Furniture", image: "/placeholder.svg?height=200&width=200" },
    { name: "Books", image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Sustainable Shopping for a Better Tomorrow
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Buy and sell second-hand items to reduce waste and promote sustainability. Join our community of
                  eco-conscious shoppers today.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/products/browse">Browse Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/register">Join Now</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
              <Image
                src="https://ik.imagekit.io/tsyh865yp/StockCake-Futuristic%20Market%20Scene_1747564679.jpg?updatedAt=1747564723546"
                alt="Sustainable shopping"
                width={500}
                height={500}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover unique second-hand items from our community of sellers.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products && products.length > 0
              ? products.map((product: any) => (
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
              : // Display skeletons if no products
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/products/browse" className="flex items-center gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find exactly what you're looking for in our diverse categories.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose EcoFinds?</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community and make a positive impact on the environment.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Sustainable Shopping</h3>
              <p className="text-muted-foreground text-center">Reduce waste by giving pre-loved items a second life.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Quality Assurance</h3>
              <p className="text-muted-foreground text-center">
                All items are verified and described accurately by our sellers.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Community Focused</h3>
              <p className="text-muted-foreground text-center">
                Join a community of like-minded individuals passionate about sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
