import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { drizzle } from "drizzle-orm/node-postgres";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/schemas";
import "dotenv/config";
import { db } from "@/db";

// Init the auth lib
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: any) {
      // make sure user exists first
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
