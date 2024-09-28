import { ObjectId } from "mongoose";

type IRole = "Free User" | "Standard User" | "Pro User" | "Admin";

type ITier = "Free" | "Standard" | "Pro" | "Enterprise";

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  image: string | undefined | null;
  role: IRole[];
  tier: ITier;
  apiKey: string;
  street: string;
  city: string;
  zipCode: number;
  state: string;
  phoneNumber: number;
  ipWhitelist: string[];
  ipBlacklist: string[];
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUser };
