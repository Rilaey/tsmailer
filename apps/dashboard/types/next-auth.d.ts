import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { ObjectId } from "mongodb";

declare module "next-auth" {
  interface Session {
    user: {
      apiKey: string;
      _id: ObjectId;
      accessToken: JWT;
      _doc: IUser;
    } & DefaultSession["user"];
  }

  interface User {
    _id: ObjectId;
    apiKey: string;
    accessToken: JWT;
    _doc: IUser;
  }

  interface AdapterUser {
    _id: ObjectId;
    apiKey: string;
    accessToken: JWT;
    _doc: IUser;
  }
}
