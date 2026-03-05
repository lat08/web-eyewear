import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware(request: any) {
  // Add ngrok header to skip warning page
  const response = NextResponse.next();
  response.headers.set('ngrok-skip-browser-warning', 'true');
  
  // Run auth middleware
  return auth(request);
}

export const config = {
  matcher: ["/profile/:path*", "/checkout", "/admin/:path*"],
};
