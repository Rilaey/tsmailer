import { useState } from "react";
import { signIn } from "next-auth/react";

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

      const result = await signIn("credentials", {
        redirect: true,
        email: loginFormState.email,
        password: loginFormState.password
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }

      setIsLoading(false);

      setLoginFormState({
        email: "",
        password: ""
      });
    } catch (err: any) {
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
