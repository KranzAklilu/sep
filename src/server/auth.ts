import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { verify } from "argon2";

import { db } from "~/server/db";
import { UserRole } from "@prisma/client";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      finishedRegistration: boolean | null;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role as UserRole;
        session.user.finishedRegistration = token.finishedRegistration as
          | boolean
          | null;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
        include: {
          Venue: true,
        },
      });

      console.log({ dbUser });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }
      console.log({ dbUser });
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        picture: dbUser.image,
        finishedRegistration: !dbUser
          ? null
          : dbUser.role === "VenueOwner"
            ? !!dbUser.Venue?.name ||
              !!dbUser.Venue?.location ||
              !!dbUser.Venue?.pricePerHour ||
              !!dbUser.Venue?.capacity ||
              !!dbUser.Venue?.phone ||
              !!dbUser.Venue?.openHour ||
              !!dbUser.Venue?.closeHour ||
              !!dbUser.Venue?.availableDate
            : dbUser.role === "Attendee"
              ? !!dbUser.name || !!dbUser.phone || !!dbUser.address
              : true,
      };
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jhon@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error(
            JSON.stringify({ message: "Invalid email or password" }),
          );
        }

        if (!user.password || user.password === "") {
          throw new Error(
            JSON.stringify({ message: "Invalid email or password" }),
          );
        }
        const passwordMatch = await verify(user.password, credentials.password);
        if (!passwordMatch) {
          throw new Error(
            JSON.stringify({ message: "Invalid email or password" }),
          );
        }

        return {
          id: user.id,
          role: user.role,
          email: user.email,
        };
      },
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
