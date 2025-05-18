import { NextResponse, type NextRequest } from "next/server"
import { getAuthenticationParameters } from "@/lib/imagekit"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  const { userId } = auth() // Changed from await auth()

  if (!userId) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const authenticationParameters = getAuthenticationParameters()
    return NextResponse.json(authenticationParameters)
  } catch (error) {
    console.error("Error getting ImageKit authentication parameters:", error)
    return NextResponse.json(
      { message: "Error getting ImageKit authentication parameters" },
      { status: 500 },
    )
  }
}
