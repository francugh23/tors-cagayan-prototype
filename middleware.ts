import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedin = !!req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return NextResponse.next();

  // if (isApiAuthRoute) {
  //   return null;
  // }

  // if (isAuthRoute) {
  //   if (isLoggedin) {
  //     const userRole = req?.auth?.user.role || "UNKNOWN"; // Default to "UNKNOWN" if role is not available
  //     return Response.redirect(
  //       new URL(DEFAULT_LOGIN_REDIRECT(userRole), nextUrl)
  //     );
  //   }
  //   return null;
  // }

  if (isAuthRoute && isLoggedin) {
    const userRole = req?.auth?.user.role || "UNKNOWN";
    const redirectUrl = DEFAULT_LOGIN_REDIRECT(userRole);

    if (pathname !== redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  // if (!isLoggedin && !isPublicRoute) {
  //   return Response.redirect(new URL("/auth/login", nextUrl));
  // }

  // return null;

  if (!isLoggedin && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Allow normal access
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
