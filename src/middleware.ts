import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/orders(.*)",
    "/profile(.*)"
]);

// If the key is missing (e.g. during build or before user adds it), we skip auth
// This prevents the "Missing Publishable Key" error from crashing the dev server
const isClerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default isClerkEnabled
    ? clerkMiddleware(async (auth, req) => {
        if (isProtectedRoute(req)) await auth.protect();
    })
    : (req: any) => {
        return NextResponse.next();
    };

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
