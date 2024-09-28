import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    sub: string;
    user: {
      apiKey: string;
      _id: string;
      accessToken: JWT;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    apiKey: string;
    accessToken: JWT;
  }

  interface AdapterUser {
    _id: string;
    apiKey: string;
    accessToken: JWT;
  }
}
