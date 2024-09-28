import { Session } from "inspector";
import { useSession } from "next-auth/react";
import React from "react";
import { createContext, ReactNode } from "react";

interface SessionUser {
  update: () => void;
  data: UserData;
  status: "authenticated" | "loading" | "unauthenticated";
}

interface UserData {
  email: string;
  exp: number;
  expires: string;
  iat: number;
  id: string;
  jti: string;
  name: string;
  image: string;
  sub: string;
}
interface IUserContext {
  user: SessionUser | null;
}

// create context
export const UserContext = createContext<IUserContext>({
  user: null
});

interface UserContextProviderProps {
  children: ReactNode;
}

// provider
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const session = useSession();

  return (
    <UserContext.Provider
      value={{ user: (session as unknown as SessionUser) || null }}
    >
      {children}
    </UserContext.Provider>
  );
};
