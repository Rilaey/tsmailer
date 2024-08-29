import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { CustomMongoDBAdapter } from "./lib/db";
import { EmailProviders } from "@repo/enums";

export const authOptions: NextAuthOptions = {
  adapter: CustomMongoDBAdapter as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: parseInt(process.env.JWT_MAX_AGE ?? "2592000")
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          prompt: "login"
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        if (account && account?.provider in EmailProviders) {
          await fetch(
            `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/emailAccounts/createInitialEmailAccount`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                email: user.email,
                provider: account?.provider,
                id: user.id,
                access_token: account?.access_token,
                refresh_token: account?.refresh_token
              })
            }
          );
        }
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
