import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, ShoppingBag, PlusCircle } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Product from "@/models/Product"
import Order from "@/models/Order"

async function getUserListings(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return []
    }

    const listings = await Product.find({ seller: user._id }).sort({ createdAt: -1 })
    return listings
  } catch (error) {
    console.error("Error loading listings:", error)
    return []
  }
}

async function getUserOrders(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return []
    }

    const orders = await Order.find({ user: user._id })
      .populate({
        path: "items.product",
        select: "title images",
      })
      .sort({ createdAt: -1 })

    return orders
  } catch (error) {
    console.error("Error loading orders:", error)
    return []
  }
}

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/login")
  }

  const [listings, orders] = await Promise.all([getUserListings(userId), getUserOrders(userId)])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings and view your purchase history</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Tabs defaultValue="listings">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {listings && listings.length > 0 ? (
              <div className="grid gap-4">
                {listings.map((listing: any) => (
                  <Card key={listing._id}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md">
                          <Image
                            src={listing.images[0] || "/placeholder.svg?height=80&width=80"}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${listing.price.toFixed(2)} · {listing.category} · {listing.condition}
                          </p>
                          <p className="text-sm text-muted-foreground">Quantity: {listing.quantity}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/products/${listing._id}`}>View</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/products/${listing._id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground" />
                  <CardTitle>No Listings Yet</CardTitle>
                  <CardDescription>You haven&apos;t listed any products for sale yet.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild>
                    <Link href="/products/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Product
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            {orders && orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order: any) => (
                  <Card key={order._id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <CardDescription>
                        Status: <span className="font-medium">{order.status}</span> · Total:{" "}
                        <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md">
                              <Image
                                src={item.product.images?.[0] || "/placeholder.svg?height=64&width=64"}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
                  <CardTitle>No Purchases Yet</CardTitle>
                  <CardDescription>You haven&apos;t made any purchases yet.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild>
                    <Link href="/products/browse">Browse Products</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
