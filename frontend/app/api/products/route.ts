import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

// Get all products
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category")
    const search = url.searchParams.get("search")

    await connectToDatabase()

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const products = await Product.find(query).populate("seller", "name email").sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 })
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const data = await req.json()

    await connectToDatabase()

    // Find or create user based on Clerk ID
    let user = await User.findOne({ clerkId: userId })

    if (!user) {
      // Get user details from Clerk
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user details from Clerk")
      }

      const userData = await response.json()

      // Create new user in our database
      user = await User.create({
        clerkId: userId,
        name: userData.first_name + " " + userData.last_name,
        email: userData.email_addresses[0].email_address,
        image: userData.image_url,
      })
    }

    const product = await Product.create({
      ...data,
      seller: user._id,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: error.message || "Error creating product" }, { status: 500 })
  }
}
