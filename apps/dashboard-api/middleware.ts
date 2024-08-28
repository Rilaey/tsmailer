import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXTAUTH_URL as string
    );
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // Apply CORS headers to all other requests
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXTAUTH_URL as string
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}

// Apply this middleware to all API routes
export const config = {
  matcher: "/api/:path*" // Match all API routes
};
