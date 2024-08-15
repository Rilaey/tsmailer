import { useState } from "react";

interface ISignUpFormState {
  email: string;
  name: string;
  password: string;
  confirmedPassword: string;
}

export const useSignUpUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signUpFormState, setSignUpFormState] = useState<ISignUpFormState>({
    email: "",
    name: "",
    password: "",
    confirmedPassword: ""
  });

  const signUpUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setError(null);
    setIsLoading(false);

    try {
      if (!signUpFormState.name) {
        throw new Error("Name field is required");
      }

      if (!signUpFormState.email) {
        throw new Error("Email field is required");
      }

      if (!signUpFormState.password) {
        throw new Error("Password field is required");
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signUpFormState.email,
          name: signUpFormState.name,
          password: signUpFormState.password
        })
      });

      if (!response.ok) {
        throw new Error("Errors attempting to create user. Please try again.");
      }

      setSignUpFormState({
        email: "",
        name: "",
        password: "",
        confirmedPassword: ""
      });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    signUpFormState,
    setSignUpFormState,
    signUpUser
  };
};
