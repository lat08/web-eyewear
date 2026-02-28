import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth?.user;
      
      console.log("[AUTH DEBUG] Path:", pathname);
      console.log("[AUTH DEBUG] Auth Object:", JSON.stringify(auth));
      
      // Strict protection for admin routes
      if (pathname.startsWith("/admin")) {
        // Return true only if authenticated and role is ADMIN
        return isAuthenticated && (auth?.user as any)?.role === "ADMIN";
      }

      // Strict protection for user routes
      const protectedRoutes = ["/profile", "/checkout", "/orders"];
      const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
      
      if (isProtected) {
        return isAuthenticated;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
