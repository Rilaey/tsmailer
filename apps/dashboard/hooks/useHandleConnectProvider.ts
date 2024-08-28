import { useRouter } from "next/router";

export const useHandleConnectProvider = () => {
  const router = useRouter();

  const handleConnectProvider = async (provider: string) => {
    switch (provider) {
      case "gmail":
        router.push(`${process.env.DASHBOARD_API_URL}/api/google/connect`);
        break;
      case "yahoo":
      case "aol":
        router.push(`${process.env.DASHBOARD_API_URL}/api/yahoo/connect`);
        break;
      case "outlook":
        router.push(`${process.env.DASHBOARD_API_URL}/api/outlook/connect`);
        break;
      case "zoho":
        router.push(`${process.env.DASHBOARD_API_URL}/api/zoho/connect`);
        break;
      default:
        break;
    }
  };

  return {
    handleConnectProvider
  };
};
