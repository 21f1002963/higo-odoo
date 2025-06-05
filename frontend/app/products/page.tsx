import { Suspense } from "react"
import { Filter, Grid, List } from "lucide-react"
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
// import { ProductCategoryFilter } from "@/components/ui/product-category-filter"
import { cn } from "@/lib/utils"
// import ProductFilters from "@/components/product-filters"

interface Product {
  id: string;
  title: string;
  price: number;
  category?: { name: string };
  images?: string[];
  // Add other product fields as necessary based on API_DOCUMENTATION.md
}

async function getProducts(searchParams: { category?: string; search?: string }) {
  try {
    const params = new URLSearchParams()

    if (searchParams.category) {
      params.append("category", searchParams.category)
    }

    if (searchParams.search) {
      params.append("search", searchParams.search)
    }

    const queryString = params.toString();
    const apiUrl = queryString ? `/api/products?${queryString}` : "/api/products";

    // Use relative URL
    const res = await fetch(apiUrl, {
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

// ProductCard component (defined locally)
const ProductCard = ({ product }: { product: Product }) => (
  <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
    <div className="w-full h-48 bg-muted rounded-md mb-4 overflow-hidden">
      {product.images && product.images[0] ? (
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
      )}
    </div>
    <h2 className="text-xl font-semibold mb-2 truncate" title={product.title}>{product.title}</h2>
    <p className="text-foreground mb-1">Price: ${product.price}</p>
    <p className="text-sm text-muted-foreground mb-3">Category: {product.category?.name || 'N/A'}</p>
    <Link href={`/products/${product.id}`} className="text-primary hover:underline font-medium">
      View Details
    </Link>
  </div>
)

const mockProducts: Product[] = [
  { id: '1', title: 'Vintage Leather Jacket', price: 120, category: { name: 'Clothing' }, images: ['https://via.placeholder.com/300x200.png?text=Jacket'] },
  { id: '2', title: 'Antique Wooden Chair', price: 75, category: { name: 'Furniture' }, images: ['https://via.placeholder.com/300x200.png?text=Chair'] },
  { id: '3', title: 'Retro Gaming Console with Classic Games', price: 200, category: { name: 'Electronics' }, images: ['https://via.placeholder.com/300x200.png?text=Console'] },
  { id: '4', title: 'Handmade Ceramic Vase Collection - Set of 3', price: 45, category: { name: 'Home Decor' }, images: ['https://via.placeholder.com/300x200.png?text=Vase'] },
  { id: '5', title: 'Rare First Edition Novel', price: 300, category: { name: 'Books' }, images: ['https://via.placeholder.com/300x200.png?text=Book'] },
  { id: '6', title: 'Mountain Bike - Like New Condition', price: 250, category: { name: 'Sports' }, images: ['https://via.placeholder.com/300x200.png?text=Bike'] },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const products: Product[] = await getProducts(searchParams)

  const categories = ["All", "Electronics", "Clothing", "Furniture", "Books", "Home", "Sports", "Toys", "Other"]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-2">Explore Products</h1>
        <p className="text-lg text-muted-foreground text-center mb-8">Find unique items from our community.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Input type="search" placeholder="Search products... (e.g., vintage, console)" className="flex-grow max-w-lg" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Replace with actual filter options based on ProductFilters component */}
              <DropdownMenuItem>Category: Electronics</DropdownMenuItem>
              <DropdownMenuItem>Category: Clothing</DropdownMenuItem>
              <DropdownMenuItem>Condition: Like New</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">No products found. Check back later or try a different search!</p>
      )}
      
      <div className="mt-12 flex justify-center items-center space-x-2">
        <Button variant="outline" disabled>Previous</Button>
        <Button variant="default">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="outline">10</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}
