import { emailValidation } from "@repo/utility";
import { useState } from "react";
import { useRouter } from "next/router";

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

  const router = useRouter();

  const signUpUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      if (!signUpFormState.name) {
        throw new Error("Name field is required");
      }

      if (!signUpFormState.email) {
        throw new Error("Email field is required");
      }

      if (!signUpFormState.email.match(emailValidation)) {
        throw new Error("Email is not of valid format");
      }

      if (!signUpFormState.password) {
        throw new Error("Password field is required");
      }

      const response = await fetch("/api/auth/userRegistration", {
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

      setIsLoading(false);

      router.push({
        pathname: "/verify-email",
        query: {
          email: signUpFormState.email
        }
      });

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
