import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"

async function getProduct(id: string) {
  try {
    await connectToDatabase()

    const product = await Product.findById(id).populate("seller", "name email")

    if (!product) {
      return null
    }

    return product
  } catch (error) {
    console.error("Error loading product:", error)
    return null
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  const { userId } = await auth()

  if (!product) {
    notFound()
  }

  // Check if the current user is the seller
  let isOwner = false

  if (userId) {
    await connectToDatabase()
    const user = await User.findOne({ clerkId: userId })

    if (user) {
      isOwner = user._id.toString() === product.seller._id.toString()
    }
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, i: number) => (
                <div key={i} className="aspect-square relative overflow-hidden rounded-lg border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} - Image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="secondary">{product.condition}</Badge>
            </div>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Seller</h3>
              <p className="text-muted-foreground">{product.seller.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Quantity Available</h3>
              <p className="text-muted-foreground">{product.quantity}</p>
            </div>
            {product.brand && (
              <div>
                <h3 className="font-medium">Brand</h3>
                <p className="text-muted-foreground">{product.brand}</p>
              </div>
            )}
            {product.model && (
              <div>
                <h3 className="font-medium">Model</h3>
                <p className="text-muted-foreground">{product.model}</p>
              </div>
            )}
            {product.year && (
              <div>
                <h3 className="font-medium">Year</h3>
                <p className="text-muted-foreground">{product.year}</p>
              </div>
            )}
            {product.color && (
              <div>
                <h3 className="font-medium">Color</h3>
                <p className="text-muted-foreground">{product.color}</p>
              </div>
            )}
            {product.material && (
              <div>
                <h3 className="font-medium">Material</h3>
                <p className="text-muted-foreground">{product.material}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Original Packaging:</h3>
              <p className="text-muted-foreground">{product.originalPackaging ? "Yes" : "No"}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Manual/Instructions Included:</h3>
              <p className="text-muted-foreground">{product.manualIncluded ? "Yes" : "No"}</p>
            </div>
          </div>

          {product.workingCondition && (
            <div className="space-y-2">
              <h3 className="font-medium">Working Condition</h3>
              <p className="text-muted-foreground">{product.workingCondition}</p>
            </div>
          )}

          <div className="flex gap-4">
            {isOwner ? (
              <Button asChild className="w-full">
                <Link href={`/products/${product._id}/edit`}>Edit Product</Link>
              </Button>
            ) : (
              <>
                <AddToCartButton productId={product._id} className="w-full" />
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
