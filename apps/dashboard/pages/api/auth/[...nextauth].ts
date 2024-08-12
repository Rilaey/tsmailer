import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CustomMongoDBAdapter from "./lib/db";

export const authOptions: NextAuthOptions = {
  adapter: CustomMongoDBAdapter as any,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl;
    },
    session({ session, token, user }) {
      return { ...session, token, user };
    },
    async jwt({ token, account, user }) {
      token.accessToken = account?.access_token;
      return { ...token, ...user, ...account };
    }
  }
};

export default NextAuth(authOptions);
