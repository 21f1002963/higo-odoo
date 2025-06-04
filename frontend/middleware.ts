import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Currently, this is a pass-through middleware.
  // Add any custom middleware logic here if needed in the future
  // (e.g., checking for a custom auth token).
  return NextResponse.next();
}

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: [
    "/((?!.+\\.[\w]+$|_next).*)", // Match all routes except static files and _next internals
    "/", // Match the root route explicitly
    "/(api|trpc)(.*)" // Match all API routes
  ],
};