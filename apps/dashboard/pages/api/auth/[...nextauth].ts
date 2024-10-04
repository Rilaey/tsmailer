import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { CustomMongoDBAdapter } from "./lib/db";
import { EmailProviders } from "@repo/enums";
import { ObjectId } from "mongodb";

const getDomainWithoutSubdomain = (url: string): string => {
  const urlParts = new URL(url).hostname.split(".");
  return urlParts.slice(-(urlParts.length === 4 ? 3 : 2)).join(".");
};

// Check if the app is running on a secure connection
const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

const cookiePrefix = useSecureCookies ? "__Secure-" : "";

// Extract hostname for subdomain usage, only relevant in production
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL as string);

const isLocalhost = process.env.NEXTAUTH_URL?.includes("localhost");

export const authOptions: NextAuthOptions = {
  adapter: CustomMongoDBAdapter as any,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // 'lax' helps maintain cookies across subdomains
        path: "/", // The cookie will be sent with all requests to this path
        secure: useSecureCookies, // Ensure cookies are secure in production
        domain: isLocalhost ? "localhost" : `.${hostName}` // Use 'localhost' in dev, root domain in production
      }
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
    // newUser: "" // if a new user is detected, takes them to this page
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
            "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://mail.google.com/"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session, ...rest }) {
      if (user && token) {
        // when the id is passed back to nextauth, it auto converts to a string.
        // we need this to always be an objectId
        const userId = new ObjectId(user._id);

        token.id = userId;
        user._id = userId;
      }

      if (user && trigger == "signUp") {
        // Nested mongo doc on user
        user = user._doc;

        token.email = user.email;
        token.name = user.name;
        token.apiKey = user.apiKey;

        if (account && account?.provider in EmailProviders) {
          // adjust provider name for nodemailer conventions
          if (account.provider == "google") {
            account.provider = "gmail";
          }

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
                id: user._id,
                access_token: account?.access_token,
                refresh_token: account?.refresh_token,
                nickName: account?.provider
              })
            }
          );
        }
      }

      return { ...token, ...user };
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user, ...rest }) {
      session.user.accessToken = token;

      return { ...session, ...token, ...user };
    },
    async signIn({ user, profile, account }) {
      return true;
    }
  },
  events: {
    signOut: async ({ token }) => {
      await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/nextauth/events`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            event: "signOut",
            id: token.id as ObjectId
          })
        }
      );
    },
    signIn: async ({ user }) => {
      await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/nextauth/events`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            event: "signIn",
            id: user.id
          })
        }
      );

      await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/userStats/validateMonthlyResetDate`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ apiKey: user.apiKey })
        }
      );
    }
  },
  theme: {
    colorScheme: "dark"
  }
};

export default NextAuth(authOptions);
