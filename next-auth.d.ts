import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession, type JWT as DefaultJWT } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  // isTwoFactorEnabled?: boolean
  // isOAuth?: boolean
};

export type ExtendedJWT = DefaultJWT & {
  role?: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }

  interface JWT extends ExtendedJWT {}
}