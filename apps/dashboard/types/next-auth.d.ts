import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      apiKey: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    apiKey: string;
  }

  interface AdapterUser {
    id: string;
    apiKey: string;
  }
}
