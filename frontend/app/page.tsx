import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton

async function getProducts() {
  try {
    // Use relative URL
    const res = await fetch(`/api/products?limit=6`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    return res.json()
  } catch (error) {
    console.error("Error loading products:", error)
    return []
  }
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to EcoFinds
        </h1>

        <p className="mt-3 text-2xl">
          Your marketplace for sustainable second-hand goods.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/products" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Browse Products &rarr;</h3>
            <p className="mt-4 text-xl">
              Find great deals on pre-loved items.
            </p>
          </Link>

          <Link href="/sell" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Sell an Item &rarr;</h3>
            <p className="mt-4 text-xl">
              List your items and connect with buyers.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
