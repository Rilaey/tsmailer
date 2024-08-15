type IUser = {
  _id: string;
  name: string;
  email: string;
  password: string | undefined | null;
  image: string | undefined | null;
  expires: string | undefined | null;
  isEmailVerified: boolean;
};

export type { IUser };
