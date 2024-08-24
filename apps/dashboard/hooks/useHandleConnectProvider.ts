import "dotenv/config";
import { useState } from "react";

export const useHandleConnectProvider = () => {
  // handle errors differently.
  // 1) send users back to dashboard home with error
  const [error, setError] = useState<string | null>(null);

  const handleConnectProvider = async (provider: string, session: any) => {
    console.log(process.env.NEXT_PUBLIC_DASHBOARD_API_URL);
    switch (provider) {
      case "Gmail":
        await fetch(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/google/connect`,
          {
            // works with no-cors
            mode: "no-cors"
          }
        );
        break;
      case "Yahoo":
        await fetch(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/yahoo/connect`,
          {
            method: "GET"
          }
        );
        break;
      default:
        break;
    }
  };

  return {
    handleConnectProvider
  };
};
