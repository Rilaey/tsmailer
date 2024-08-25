import { useRouter } from "next/router";

export const useHandleConnectProvider = () => {
  const router = useRouter();

  const handleConnectProvider = async (provider: string, session: any) => {
    switch (provider) {
      case "Gmail":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/google/connect`
        );
        break;
      case "Yahoo":
      case "AOL":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/yahoo/connect`
        );
        break;
      case "Outlook":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/outlook/connect`
        );
        break;
      case "Zoho":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/zoho/connect`
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
