import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { CustomMongoDBAdapter } from "./lib/db";

export const authOptions: NextAuthOptions = {
  adapter: CustomMongoDBAdapter as any,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
    maxAge: parseInt(process.env.jwtMaxAge ?? "2592000")
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || ""
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      return { ...session, ...token, ...user };
    },
    async signIn({ user, profile, account }) {
      return true;
    }
  }
};

export default NextAuth(authOptions);
