import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";

interface loginFormStateProps {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginFormState, setLoginFormState] = useState<loginFormStateProps>({
    email: "",
    password: ""
  });

  const userContext = useContext(UserContext);

  const login = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      if (!loginFormState.email || !loginFormState.password) {
        throw new Error("Please enter email and password");
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginFormState.email,
          password: loginFormState.password
        })
      });

      if (!response.ok) {
        throw new Error("Error logging user in.");
      }

      const data = await response.json();

      userContext.setUser(data);

      setIsLoading(false);

      window.location.href = "/";

      setLoginFormState({
        email: "",
        password: ""
      });
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(userContext?.user));
  }, [userContext]);

  return {
    error,
    isLoading,
    loginFormState,
    setLoginFormState,
    login
  };
};
