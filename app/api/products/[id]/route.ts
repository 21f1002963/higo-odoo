import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

// Get a single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const product = await Product.findById(params.id).populate("seller", "name email")

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 })
  }
}

// Update a product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if the user is the seller
    if (product.seller.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const data = await req.json()

    const updatedProduct = await Product.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: error.message || "Error updating product" }, { status: 500 })
  }
}

// Delete a product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if the user is the seller
    if (product.seller.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 })
  }
}
