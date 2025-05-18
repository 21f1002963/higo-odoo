import { auth } from "@clerk/nextjs/server"

export async function getCurrentUser() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  return { id: userId }
}
