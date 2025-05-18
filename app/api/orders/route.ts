import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

// Get user's orders
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const orders = await Order.find({ user: user._id })
      .populate({
        path: "items.product",
        select: "title images",
      })
      .sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.product",
      select: "title price quantity seller",
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 })
    }

    // Calculate total amount and prepare order items
    let totalAmount = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return NextResponse.json({ message: `Product ${item.product} not found` }, { status: 404 })
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ message: `Not enough ${product.title} in stock` }, { status: 400 })
      }

      // Decrease product quantity
      product.quantity -= item.quantity
      await product.save()

      // Add to order items
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      })

      totalAmount += product.price * item.quantity
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      status: "Pending",
    })

    // Clear cart
    cart.items = []
    await cart.save()

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Error creating order" }, { status: 500 })
  }
}
