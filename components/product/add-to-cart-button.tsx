"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const addToCart = async () => {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to add to cart")
      }

      toast({
        title: "Added to cart",
        description: "The product has been added to your cart",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={addToCart} className={className} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
