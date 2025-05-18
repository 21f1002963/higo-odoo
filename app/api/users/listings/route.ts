import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

// Get user's listings
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

    const products = await Product.find({ seller: user._id }).sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ message: "Error fetching listings" }, { status: 500 })
  }
}
