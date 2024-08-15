import { useState } from "react";

export const useVerifyUserEmail = () => {
  const [errorVerifyingUserEmail, setErrorVerifyingUserEmail] = useState<
    string | null
  >(null);
  const [successfulVerification, setSuccessfulVerification] =
    useState<boolean>(false);

  const verifyUserEmail = async (email: string) => {
    setErrorVerifyingUserEmail(null);
    setSuccessfulVerification(false);

    try {
      const response = await fetch("/api/verifyUserEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error("Unable to locate user to verify email address.");
      }

      setSuccessfulVerification(true);
    } catch (err: any) {
      setErrorVerifyingUserEmail(err.message);
    }
  };

  return {
    errorVerifyingUserEmail,
    successfulVerification,
    verifyUserEmail
  };
};
