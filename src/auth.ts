import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas";
import { getUserByEmail, getUserById } from "./utils/getUser";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (!session.user) return session;

      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.role) {
        session.user.role = token.role;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;

      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = LoginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        // Fetch user from database
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
