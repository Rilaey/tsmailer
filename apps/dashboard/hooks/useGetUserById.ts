import { UserContext } from "./../context/userContext";
import { useState, useContext } from "react";
import { useAuthToken } from "./useAuthToken";

export const useGetUserById = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userContext = useContext(UserContext);

  const { token } = useAuthToken();

  const getUserById = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (token?.id) {
        const response = await fetch(`/api/getUserById`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ _id: token.id })
        });

        if (!response.ok) {
          throw new Error("Issues with response.");
        }

        const json = await response.json();

        if (json) {
          //@ts-ignore
          //wants the password field
          userContext.setUser((prev) => {
            if (!prev) {
              return {
                _id: json._id,
                name: json.name,
                email: json.email,
                image: json.image ?? "",
                expires: token?.exp
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
