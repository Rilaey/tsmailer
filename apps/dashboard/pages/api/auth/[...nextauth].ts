import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { clientPromise, CustomMongoDBAdapter } from "./lib/db";
import CredentialsProvider from "next-auth/providers/credentials";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password"
        },
        isEmailVerified: {}
      },
      async authorize(credentials) {
        const credentialDetails = {
          email: credentials?.email,
          password: credentials?.password
        };

        const db = (await clientPromise).db();

        const credUser = await db.collection("users").findOne({
          email: credentialDetails.email
        });

        if (!credUser) {
          throw new Error("No user found with provided email.");
        }

        const isValidPassword = await bcrypt.compare(
          credentialDetails.password ?? "",
          credUser?.password ?? ""
        );

        if (!isValidPassword) {
          throw new Error("Invalid email or password.");
        }

        if (!credUser.isEmailVerified) {
          throw new Error(
            "Please verify your email address before signing in."
          );
        }

        const user = {
          id: credUser._id.toString(),
          email: credUser.email,
          name: credUser.name
        };

        return user;
      }
    }),
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
      console.log("user", user);
      console.log("profile", profile);
      console.log("account", account);

      return true;
    }
  }
};

export default NextAuth(authOptions);
