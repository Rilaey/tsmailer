import { useState } from "react";

export const useResendEmailVerification = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resendEmailVerification = async (
    e: { preventDefault: () => void },
    email: string
  ) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/resendEmailVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(
          "Error resending verification email. Please try again."
        );
      }

      const data = await response.json();

      setIsLoading(false);

      return data;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    error,
    isLoading,
    resendEmailVerification,
    setIsLoading
  };
};
