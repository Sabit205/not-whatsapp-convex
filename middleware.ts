import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/', 
  '/api/auth/webhook',
]);

export default clerkMiddleware(async (auth, request) => {
  console.log('Incoming Request URL:', request.url);

  // Handle public routes
  if (isPublicRoute(request)) { // Pass the entire request object
    console.log('Public route accessed:', request.url);
    return; // Skip authentication for public routes
  }

  console.log('Protected route accessed:', request.url);

  // Handle protected routes
  try {
    await auth.protect();
    console.log('Authentication successful for:', request.url);
  } catch (error) {
    console.error('Authentication failed for:', request.url, 'Error:', error);

    // Optionally, you can throw an error or return a custom response
    throw error; // Re-throw to let Clerk handle the redirect
  }
});

export const config = {
  matcher: [
    // Exclude Next.js internals and static files from middleware
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always apply middleware to API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};
