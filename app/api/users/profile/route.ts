import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth"

// Get user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    const userProfile = await User.findById(user.id).select("-password")

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 })
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name, image } = await req.json()

    await connectToDatabase()

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { name, image },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: error.message || "Error updating profile" }, { status: 500 })
  }
}
