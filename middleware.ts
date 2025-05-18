import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/products/browse',
  '/products/new', // Add /products/new to public routes
  '/api/imagekit/auth', // Assuming this needs to be accessible for uploads
  '/api/products(.*)', // Assuming product fetching API is public
  '/login(.*)',
  '/signup(.*)',
  '/sso-callback(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  // Add other protected routes here
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
}, {
  // debug: true // Uncomment for debugging
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}