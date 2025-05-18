import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error: any) {
    console.error("Error registering user:", error)
    return NextResponse.json({ message: error.message || "Error registering user" }, { status: 500 })
  }
}
