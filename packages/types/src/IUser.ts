type IUser = {
  _id: string;
  name: string;
  email: string;
  image: string | undefined | null;
  createdDate: number;
  lastModifiedDate: number;
};

export type { IUser };
