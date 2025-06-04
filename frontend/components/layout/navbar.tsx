"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, ShoppingCart, Menu, Package, PlusCircle, UserCircle, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react" // Added LogOut and Loader2

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();
  const isSignedIn = !!user; // Determine signed-in status from user object

  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // signOut already redirects to /sign-in, so no need for router.push here
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally show a toast message for logout failure
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 lg:hidden" /> 
            <Skeleton className="h-6 w-24" /> 
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden" disabled={isLoggingOut}>
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
                        <UserCircle className="h-5 w-5" />
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
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground justify-start p-0 h-auto"
                        onClick={() => { handleSignOut(); setIsOpen(false); }}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <LogOut className="h-5 w-5" />
                        )}
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/sign-up"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus className="h-5 w-5" />
                        <span>Sign Up</span>
                      </Link>
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
            className={`text-sm font-medium ${pathname.startsWith("/products") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
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
            <Button variant="ghost" size="icon" disabled={isLoggingOut}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          {isSignedIn && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" disabled={isLoggingOut}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          )}

          {isSignedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoggingOut}>
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.username || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} disabled={isLoggingOut}>
                  {isLoggingOut ? (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                     <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in" passHref>
                <Button variant="default" size="sm" disabled={isLoggingOut}>
                  Sign In
                </Button>
              </Link>
               <Link href="/sign-up" passHref className="ml-2">
                <Button variant="outline" size="sm" disabled={isLoggingOut}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
