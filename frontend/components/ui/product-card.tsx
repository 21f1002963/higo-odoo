import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: string
  title: string
  price: number
  category: string
  condition: string
  image: string
}

export function ProductCard({ id, title, price, category, condition, image }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Link href={`/products/${id}`}>
          <Image
            src={image || "/placeholder.svg?height=300&width=300"}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-2 py-1 text-xs">
              {category}
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              {condition}
            </Badge>
          </div>
          <h3 className="font-medium leading-none line-clamp-1">{title}</h3>
          <p className="font-bold text-lg">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button asChild className="w-full">
            <Link href={`/products/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
