import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import InteractiveHeroCard from "@/components/ui/interactive-hero-card"

// Placeholder data - replace with your actual product data
const featuredProducts = [
  {
    id: "1",
    name: "Aesthetic Wireless Headphones",
    description: "Immersive sound, all-day comfort.",
    price: "$199.99",
    image: "/placeholder-headphone.jpg", // Replace with your image path
    rating: 4.5,
  },
  {
    id: "2",
    name: "Minimalist Smartwatch",
    description: "Stay connected in style.",
    price: "$249.99",
    image: "/placeholder-watch.jpg", // Replace with your image path
    rating: 4.8,
  },
  {
    id: "3",
    name: "Ergonomic VR Headset",
    description: "Explore new realities.",
    price: "$399.99",
    image: "/placeholder-vr.jpg", // Replace with your image path
    rating: 4.2,
  },
]

const popularCategories = [
  {
    name: "Audio Devices",
    image: "/placeholder-category-audio.jpg", // Replace with your image path
    href: "/products?category=audio",
  },
  {
    name: "Wearable Tech",
    image: "/placeholder-category-wearables.jpg", // Replace with your image path
    href: "/products?category=wearables",
  },
  {
    name: "Gaming Gear",
    image: "/placeholder-category-gaming.jpg", // Replace with your image path
    href: "/products?category=gaming",
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 rounded-lg shadow-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-30">
          {/* Optional: <Image src="/hero-background-pattern.png" layout="fill" objectFit="cover" alt="Background pattern" /> */}
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block">Discover Your</span>
              <span className="block text-blue-400">Next Favorite Gadget.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
              Explore our curated collection of high-quality, aesthetically pleasing tech products designed to inspire and elevate your everyday life.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white group">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          {/* Use the new InteractiveHeroCard component */}
          <InteractiveHeroCard />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group block">
              <Card className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-400/20 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 h-full flex flex-col">
                <CardHeader className="p-0 border-b border-slate-200 dark:border-slate-700">
                  <AspectRatio ratio={4 / 3} className="bg-slate-50 dark:bg-slate-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </AspectRatio>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold mb-2 h-14 line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{product.name}</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 h-10 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{product.price}</p>
                    {product.rating && (
                      <div className="flex items-center">
                        {[...Array(Math.floor(product.rating))].map((_, i) => (
                          <Star key={`star-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                        {product.rating % 1 !== 0 && (
                          <Star key="half-star" className="h-5 w-5 text-yellow-400" />
                        )}
                        <span className="ml-1.5 text-sm text-slate-500 dark:text-slate-400">({product.rating})</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="mb-20 md:mb-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Explore Our Collections
          </h2>
          <p className="mt-3 sm:mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Curated selections to inspire your next discovery.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 lg:gap-x-10 lg:gap-y-12">
          {popularCategories.map((category) => (
            <Link href={category.href} key={category.name} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action / Newsletter */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 rounded-lg shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest updates on new arrivals, special offers, and inspiring tech news.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              required
            />
            <Button type="submit" size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
