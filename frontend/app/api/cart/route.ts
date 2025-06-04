import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

// Get user's cart
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

    let cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.product",
      select: "title price images",
    })

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if product exists
    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if quantity is valid
    if (quantity > product.quantity) {
      return NextResponse.json({ message: "Not enough items in stock" }, { status: 400 })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id })

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      })
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity
    } else {
      // Product not in cart, add new item
      cart.items.push({
        product: productId,
        quantity,
      })
    }

    await cart.save()

    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "title price images",
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ message: "Error adding to cart" }, { status: 500 })
  }
}

// Update cart item
export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId || !quantity) {
      return NextResponse.json({ message: "Product ID and quantity are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Find cart
    let cart = await Cart.findOne({ user: user._id })

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not in cart" }, { status: 404 })
    }

    // Check if quantity is 0, remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()

    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "title price images",
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ message: "Error updating cart" }, { status: 500 })
  }
}

// Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const url = new URL(req.url)
    const productId = url.searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Find cart
    let cart = await Cart.findOne({ user: user._id })

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    // Remove item from cart
    cart.items = cart.items.filter((item) => item.product.toString() !== productId)

    await cart.save()

    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "title price images",
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ message: "Error removing from cart" }, { status: 500 })
  }
}
