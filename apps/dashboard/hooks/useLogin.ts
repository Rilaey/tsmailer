import { useState } from "react";

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

      setIsLoading(false);
      console.log(loginFormState);
      setLoginFormState({
        email: "",
        password: ""
      });
    } catch (err: any) {
      console.log(err.message);
      setIsLoading(false);
      setError(err.message);
    }
  };

  return {
    error,
    isLoading,
    loginFormState,
    setLoginFormState,
    login
  };
};
