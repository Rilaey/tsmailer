type IRole = "Free User" | "Standard User" | "Pro User" | "Admin";

type ITier = "Free" | "Standard" | "Pro" | "Enterprise";

type IUser = {
  _id: string;
  name: string;
  email: string;
  image: string | undefined | null;
  role: IRole[];
  tier: ITier;
  createdDate: number;
  lastModifiedDate: number;
};

export type { IUser };
