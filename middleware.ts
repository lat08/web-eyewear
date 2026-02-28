export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/profile/:path*", "/checkout", "/admin/:path*"],
};
