import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import prisma from "./lib/db";
import { User, UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // events: {
  //   async linkAccount({ user }) {
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() },
  //     });
  //   },
  // },
  callbacks: {
    async signIn({ user }) {
      // Allow OAuth without email verification
      // if (account?.provider !== "credentials") return true;

      // const existingUser = await getUserById(user.id!);

      // // Prevent Sign In w/o Email Verification
      // if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      //     existingUser.id
      //   );

      //   if (!twoFactorConfirmation) return false;

      //   // DELETE TWO FACTOR CONFIRMATION FOR NEXT SIGN IN
      //   await prisma.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id },
      //   });
      // }

      return !!user;
    },
    async jwt({ token, user }) {
      // if (!token.sub) return token;

      // const existingUser = await getUserById(token.sub);

      // if (!existingUser) return token;

      // const existingAccount = await getAccountByUserId(existingUser.id);

      // token.isOAuth = !!existingAccount;
      // token.name = existingUser.name;
      // token.email = existingUser.email;
      // token.role = existingUser.role;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      if (user) {
        const prismaUser = user as User;
        token.sub = prismaUser.id;
        token.name = prismaUser.name;
        token.email = prismaUser.email;
        token.role = prismaUser.role;
      }
      return token;
    },
    async session({ token, session }) {
      // if (token.sub && session.user) {
      //   session.user.id = token.sub;
      // }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole;
      // }

      // if (session.user) {
      //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      // }

      // if (session.user) {
      //   session.user.name = token.name;
      //   session.user.email = token.email as string;
      //   session.user.isOAuth = token.isOAuth as boolean;
      // }

      // return session;
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
