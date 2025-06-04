"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface CartItemQuantityProps {
  productId: string
  quantity: number
}

export function CartItemQuantity({ productId, quantity }: CartItemQuantityProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(quantity)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setIsLoading(true)

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update cart")
      }

      setItemQuantity(newQuantity)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={() => updateQuantity(itemQuantity - 1)}
        disabled={isLoading || itemQuantity <= 1}
      >
        <Minus className="h-3 w-3" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <Input
        type="number"
        min="1"
        value={itemQuantity}
        onChange={(e) => {
          const value = Number.parseInt(e.target.value)
          if (!isNaN(value) && value >= 1) {
            setItemQuantity(value)
          }
        }}
        onBlur={() => updateQuantity(itemQuantity)}
        className="h-8 w-12 rounded-none border-x-0 text-center"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={() => updateQuantity(itemQuantity + 1)}
        disabled={isLoading}
      >
        <Plus className="h-3 w-3" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  )
}
