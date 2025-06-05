import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Currently, this is a pass-through middleware.
  // Add any custom middleware logic here if needed in the future
  // (e.g., checking for a custom auth token).
  return NextResponse.next();
}

export const config = {
  // This configuration can be adjusted when JWT authentication is implemented.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude API, static files, images, and favicon
    "/(api|trpc)(.*)" // Match all API routes for potential future protection
  ],
};