import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      apiKey: string;
      id: string;
      accessToken: JWT;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    apiKey: string;
    accessToken: JWT;
  }

  interface AdapterUser {
    id: string;
    apiKey: string;
    accessToken: JWT;
  }
}
