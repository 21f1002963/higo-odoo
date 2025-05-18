"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { Home, Search, ShoppingCart, Menu, Package, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl" onClick={() => setIsOpen(false)}>
                  <Package className="h-6 w-6 text-green-600" />
                  <span>EcoFinds</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserButton />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/products/new"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Add Product</span>
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <SignInButton>
                          <Button variant="ghost" className="w-full justify-start p-0">
                            <span>Sign In</span>
                          </Button>
                        </SignInButton>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <SignUpButton>
                          <Button variant="ghost" className="w-full justify-start p-0">
                            <span>Sign Up</span>
                          </Button>
                        </SignUpButton>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Package className="h-6 w-6 text-green-600" />
            <span className="hidden sm:inline-block">EcoFinds</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${pathname === "/" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`text-sm font-medium ${pathname === "/products" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
          >
            Products
          </Link>
          {isSignedIn && (
            <Link
              href="/products/new"
              className={`text-sm font-medium ${pathname === "/products/new" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
            >
              Add Product
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton>
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
