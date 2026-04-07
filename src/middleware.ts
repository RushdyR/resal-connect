import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  // Remove X-Frame-Options to allow iframe embedding
  response.headers.delete("X-Frame-Options");

  // Set CSP frame-ancestors to control which domains can embed this site
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://merchant.resal.me https://stage.boonus.app http://localhost:3000"
  );

  return response;
}

export const config = {
  matcher: "/(.*)",
};
