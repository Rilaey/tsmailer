type IUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  __v: number;
};

export type { IUser };
