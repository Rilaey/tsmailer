import { UserContext } from "./../context/userContext";
import { useState, useContext } from "react";
import { useSession } from "next-auth/react";

export const useGetUserById = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userContext = useContext(UserContext);

  const { data: session } = useSession();

  const getUserById = async () => {
    setIsLoading(true);
    setError(null);

    try {
      //@ts-ignore
      // id is in the session, but not a part of the interface.
      if (session?.id) {
        const response = await fetch(`/api/getUserById`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          //@ts-ignore
          // id is in the session, but not a part of the interface.
          body: JSON.stringify({ _id: session.id })
        });

        if (!response.ok) {
          throw new Error("Issues with response.");
        }

        const data = await response.json();

        if (data) {
          userContext.setUser((prev) => {
            if (!prev) {
              return {
                _id: data._id,
                name: data.name,
                email: data.email,
                image: data.image ?? "",
                expires: session?.expires,
                password: data.password,
                isEmailVerified: data.isEmailVerified,
                logsId: data.logsId,
                emailAccountsId: data.emailAccountsId,
                jti: null
              };
            }
            return prev;
          });
        }

        setError(null);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return {
    getUserById,
    error,
    isLoading
  };
};
