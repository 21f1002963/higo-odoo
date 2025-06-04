import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Trash2 } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItemQuantity } from "@/components/cart/cart-item-quantity"
import { CheckoutButton } from "@/components/cart/checkout-button"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Cart from "@/models/Cart"

async function getUserCart(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return { items: [] }
    }

    const cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.product",
      select: "title price images",
    })

    if (!cart) {
      return { items: [] }
    }

    return cart
  } catch (error) {
    console.error("Error loading cart:", error)
    return { items: [] }
  }
}

export default async function CartPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/login")
  }

  const cart = await getUserCart(userId)

  const calculateTotal = () => {
    return cart.items.reduce((total: number, item: any) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your items and proceed to checkout</p>
        </div>
      </div>

      {cart.items.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <Card key={item.product._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md">
                      <Image
                        src={item.product.images?.[0] || "/placeholder.svg?height=96&width=96"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.product._id}`} className="font-medium hover:underline">
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <CartItemQuantity productId={item.product._id} quantity={item.quantity} />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <CheckoutButton className="w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground" />
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Looks like you haven&apos;t added any products to your cart yet.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/products/browse">Browse Products</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
