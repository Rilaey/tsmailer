type IUser = {
  _id: string;
  name: string;
  email: string;
  password: string | undefined | null;
  image: string | undefined | null;
  expires: string | undefined | null;
  // __v: number;
};

export type { IUser };
