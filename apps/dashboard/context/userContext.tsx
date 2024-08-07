import { IUser } from "@packages/types";
import React from "react";
import { createContext, ReactNode, useState } from "react";

interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

// create context
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {}
});

interface UserContextProviderProps {
  children: ReactNode;
}

// provider
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
