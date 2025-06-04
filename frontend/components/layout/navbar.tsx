"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, ShoppingCart, Menu, Package, PlusCircle, UserCircle, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { appUser, signOut } = useAuth(); // Use appUser and new signOut
  const isSignedIn = !!appUser; // Determine signed-in status from appUser

  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      signOut(); // Call signOut from AuthContext (can be async or not depending on its new impl)
      // Optionally, redirect after sign out if not handled by AuthContext's signOut
      // router.push('/login'); 
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally show a toast message for logout failure
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Clerk-based isLoading and Skeleton loader section has been removed.

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
                        href="/sell" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Sell Item</span>
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
                        href="/login" // Changed from /sign-in
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/register" // Changed from /sign-up
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
              href="/sell" 
              className={`text-sm font-medium ${pathname === "/sell" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
            >
              Sell Item
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

          {isSignedIn && appUser ? ( 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoggingOut}>
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{appUser.username || appUser.email || 'User'}</DropdownMenuLabel>
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
              <Link href="/login" passHref> 
                <Button variant="default" size="sm" disabled={isLoggingOut}>
                  Sign In
                </Button>
              </Link>
               <Link href="/register" passHref className="ml-2"> 
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
