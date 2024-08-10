import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl;

  // if (
  //   pathname.startsWith("/login") ||
  //   pathname.startsWith("/_next") ||
  //   pathname.startsWith("/static") ||
  //   pathname.startsWith("/api/auth")
  // ) {
  //   return NextResponse.next();
  // }

  // // Get the token from the request
  // const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // // Redirect to /login if not authenticated
  // // if (!token) {
  // //   return NextResponse.redirect(new URL("/login", req.url));
  // // }

  // // Continue with the request if authenticated
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!login).*)"] // Apply middleware to all routes except /login
// };
